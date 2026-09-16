-- Account Products Performance dashboard — initial schema.
-- Maps the shape currently hardcoded in lib/data.ts onto normalized tables.

create type segment_key as enum (
  'youth', 'female', 'maleprof', 'resprof', 'retirees', 'sme', 'exec'
);

create type channel_direction as enum ('inflow', 'outflow');

-- Where an outflow ultimately lands: stays inside the bank, physical cash,
-- or leaves electronically. Only meaningful for direction = 'outflow'.
create type dest_bucket as enum ('internal', 'cash', 'outside');

-- ---------------------------------------------------------------- products
create table products (
  id text primary key,               -- slug, e.g. 'tejoori-al-islami'
  name text not null,
  tagline text not null,
  description text not null,
  tags text[] not null default '{}',
  mono text not null,                -- 2-letter badge, e.g. 'TA'
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------ segments (lookup)
create table segments (
  key segment_key primary key,
  label text not null,               -- e.g. 'Bahraini Male Professionals'
  color_token text not null,         -- e.g. 'var(--seg-maleprof)'
  sort_order int not null default 0
);

-- ------------------------------------------------------- channels (lookup)
create table channels (
  id bigint generated always as identity primary key,
  name text not null,                -- e.g. 'Card & POS Payments'
  direction channel_direction not null,
  bucket dest_bucket,                -- required when direction = 'outflow'
  unique (name, direction),
  constraint bucket_required_for_outflow
    check (direction = 'inflow' or bucket is not null)
);

-- --------------------------------------- product_metrics_monthly (trend)
-- Feeds: customers, total balance, growth %, balance trend chart,
-- and the monthly inflow-vs-outflow chart.
create table product_metrics_monthly (
  id bigint generated always as identity primary key,
  product_id text not null references products(id) on delete cascade,
  month date not null,               -- first-of-month, e.g. 2026-09-01
  customers int not null,
  balance_bhd_m numeric(14, 2) not null,   -- BHD, millions
  inflow_bhd_m numeric(14, 2) not null,    -- BHD, millions
  outflow_bhd_m numeric(14, 2) not null,   -- BHD, millions
  unique (product_id, month)
);

-- ------------------------------------------------- product_segment_metrics
-- Feeds: segment performance bars, best-performing / opportunity callouts.
create table product_segment_metrics (
  id bigint generated always as identity primary key,
  product_id text not null references products(id) on delete cascade,
  segment_key segment_key not null references segments(key),
  month date not null,               -- snapshot date this reading is as-of
  value_pct numeric(5, 2) not null,  -- % share of this product's balance
  unique (product_id, segment_key, month)
);

-- ------------------------------------------------- product_channel_metrics
-- Feeds: best inflow channels, outflow-channel opportunities, and the
-- "where outflow money goes" internal/cash/digital breakdown (via channels.bucket).
create table product_channel_metrics (
  id bigint generated always as identity primary key,
  product_id text not null references products(id) on delete cascade,
  channel_id bigint not null references channels(id) on delete cascade,
  month date not null,               -- snapshot date this reading is as-of
  volume_bhd_m numeric(14, 2) not null,  -- avg monthly volume, BHD millions
  unique (product_id, channel_id, month)
);

create index on product_metrics_monthly (product_id, month);
create index on product_segment_metrics (product_id, month);
create index on product_channel_metrics (product_id, month);

-- ---------------------------------------------------------------- RLS
-- This is aggregated, non-personal performance data — safe to read publicly
-- within the app. Writes should only ever go through the service role key
-- (e.g. the seed script), never the anon key.
alter table products enable row level security;
alter table segments enable row level security;
alter table channels enable row level security;
alter table product_metrics_monthly enable row level security;
alter table product_segment_metrics enable row level security;
alter table product_channel_metrics enable row level security;

create policy "public read" on products for select using (true);
create policy "public read" on segments for select using (true);
create policy "public read" on channels for select using (true);
create policy "public read" on product_metrics_monthly for select using (true);
create policy "public read" on product_segment_metrics for select using (true);
create policy "public read" on product_channel_metrics for select using (true);
