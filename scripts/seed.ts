// Pushes the data in lib/data.ts into Supabase, matching the schema in
// supabase/migrations/0001_init.sql. Re-run any time lib/data.ts changes.
//
// Usage:  npm run seed
// Needs:  NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
//         (the service role key — never the anon key — since this writes data).

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS, SEGMENTS, CHANNEL_BUCKET, type DestBucket } from "../lib/data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local first.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

// The mock data only carries one 6-month trend series (balance/inflow/outflow)
// and one current snapshot for segments/channels — not real month-by-month
// history for those. Seed the trend across real months, and segments/channels
// as a single snapshot dated at the latest month.
const MONTH_DATES = ["2026-04-01", "2026-05-01", "2026-06-01", "2026-07-01", "2026-08-01", "2026-09-01"];
const SNAPSHOT_MONTH = MONTH_DATES[MONTH_DATES.length - 1];

async function upsert(table: string, rows: Record<string, unknown>[], onConflict: string) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table} (${rows.length} rows)`);
}

async function main() {
  await upsert(
    "segments",
    SEGMENTS.map((s, i) => ({ key: s.key, label: s.label, color_token: s.color, sort_order: i })),
    "key"
  );

  await upsert(
    "products",
    PRODUCTS.map((p, i) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      tags: p.tags,
      mono: p.mono,
      sort_order: i,
    })),
    "id"
  );

  // Dedupe channels by name+direction across every product.
  const channelKey = (name: string, direction: "inflow" | "outflow") => `${name}|${direction}`;
  const channelRows = new Map<string, { name: string; direction: "inflow" | "outflow"; bucket: DestBucket | null }>();
  PRODUCTS.forEach((p) => {
    p.channels.inflow.forEach((c) =>
      channelRows.set(channelKey(c.name, "inflow"), { name: c.name, direction: "inflow", bucket: null })
    );
    p.channels.outflow.forEach((c) =>
      channelRows.set(channelKey(c.name, "outflow"), {
        name: c.name,
        direction: "outflow",
        bucket: CHANNEL_BUCKET[c.name] ?? "outside",
      })
    );
  });

  const { data: insertedChannels, error: channelErr } = await supabase
    .from("channels")
    .upsert([...channelRows.values()], { onConflict: "name,direction" })
    .select("id, name, direction");
  if (channelErr) throw new Error(`channels: ${channelErr.message}`);
  console.log(`✓ channels (${insertedChannels!.length} rows)`);

  const channelId = new Map(insertedChannels!.map((r) => [channelKey(r.name, r.direction as "inflow" | "outflow"), r.id]));

  for (const p of PRODUCTS) {
    await upsert(
      "product_metrics_monthly",
      MONTH_DATES.map((month, i) => ({
        product_id: p.id,
        month,
        customers: p.customers,
        balance_bhd_m: p.trend[i],
        inflow_bhd_m: p.flow.inflow[i],
        outflow_bhd_m: p.flow.outflow[i],
      })),
      "product_id,month"
    );

    await upsert(
      "product_segment_metrics",
      Object.entries(p.segments).map(([segment_key, value_pct]) => ({
        product_id: p.id,
        segment_key,
        month: SNAPSHOT_MONTH,
        value_pct,
      })),
      "product_id,segment_key,month"
    );

    const channelMetricRows = [
      ...p.channels.inflow.map((c) => ({ ...c, direction: "inflow" as const })),
      ...p.channels.outflow.map((c) => ({ ...c, direction: "outflow" as const })),
    ].map((c) => ({
      product_id: p.id,
      channel_id: channelId.get(channelKey(c.name, c.direction)),
      month: SNAPSHOT_MONTH,
      volume_bhd_m: c.value,
    }));
    await upsert("product_channel_metrics", channelMetricRows, "product_id,channel_id,month");
  }

  console.log("\nSeed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
