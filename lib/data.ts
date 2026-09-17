// Sample data for the account products performance dashboard.
// Replace the figures in PRODUCTS with real numbers when available —
// every ranking, badge and total on the dashboard is derived from this file.

export type SegmentKey =
  | "youth"
  | "female"
  | "maleprof"
  | "resprof"
  | "retirees"
  | "sme"
  | "exec";

export interface SegmentMeta {
  key: SegmentKey;
  label: string;
  color: string;
}

export const SEGMENTS: SegmentMeta[] = [
  { key: "youth", label: "Youth", color: "var(--seg-youth)" },
  { key: "female", label: "Female Workforce", color: "var(--seg-female)" },
  { key: "maleprof", label: "Bahraini Male Professionals", color: "var(--seg-maleprof)" },
  { key: "resprof", label: "Resident Professionals", color: "var(--seg-resprof)" },
  { key: "retirees", label: "Retirees", color: "var(--seg-retirees)" },
  { key: "sme", label: "SMEs", color: "var(--seg-sme)" },
  { key: "exec", label: "Top Executives", color: "var(--seg-exec)" },
];

export const segMeta = (key: SegmentKey): SegmentMeta =>
  SEGMENTS.find((s) => s.key === key)!;

export interface RankedSegment {
  key: SegmentKey;
  meta: SegmentMeta;
  value: number;
}

// A product's segments, ranked descending by share — the shared basis for
// every "best performing" / "opportunity" callout across the dashboard.
export function rankedSegments(product: Pick<Product, "segments">): RankedSegment[] {
  return (Object.keys(product.segments) as SegmentKey[])
    .map((key) => ({ key, meta: segMeta(key), value: product.segments[key] }))
    .sort((a, b) => b.value - a.value);
}

export const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export interface ChannelEntry {
  name: string;
  value: number;
}

export interface Product {
  id: string;
  mono: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  customers: number;
  balance: number; // BHD millions
  growth: number; // percent, +/-
  trend: number[]; // 6 monthly balances, BHD millions
  flow: { inflow: number[]; outflow: number[] }; // 6 months, BHD millions
  segments: Record<SegmentKey, number>; // % share of this product's balance
  channels: { inflow: ChannelEntry[]; outflow: ChannelEntry[] }; // avg monthly BHD millions
}

export const PRODUCTS: Product[] = [
  {
    id: "tejoori-al-islami",
    mono: "TA",
    name: "Tejoori Al Islami",
    tagline: "Prize-linked Sharia savings account",
    description:
      "Mass-market savings account that pools deposits into monthly, quarterly and annual prize draws while keeping funds fully Sharia-compliant and accessible.",
    tags: ["Sharia-compliant", "Mass market", "Prize draws"],
    customers: 184500,
    balance: 612.4,
    growth: 4.8,
    trend: [584.2, 591.0, 598.5, 602.1, 607.8, 612.4],
    flow: { inflow: [42, 45, 47, 44, 49, 52], outflow: [38, 40, 41, 39, 43, 45] },
    segments: { youth: 22, female: 18, maleprof: 20, resprof: 12, retirees: 15, sme: 6, exec: 7 },
    channels: {
      inflow: [
        { name: "BisB Mobile App", value: 19 },
        { name: "Salary / Employer Transfer", value: 14 },
        { name: "BisB Online Banking", value: 7 },
        { name: "Branch Counter", value: 6 },
        { name: "Fawri Instant Transfer", value: 4 },
        { name: "ATM / Kiosk Deposit", value: 2 },
      ],
      outflow: [
        { name: "Card & POS Payments", value: 20 },
        { name: "ATM Cash Withdrawal", value: 12 },
        { name: "Fawateer Bill Payment", value: 6 },
        { name: "Own & Other Account Transfer", value: 3 },
        { name: "Standing Orders", value: 3 },
        { name: "International Transfer", value: 1.5 },
        { name: "Branch Counter Withdrawal", value: 1 },
      ],
    },
  },
  {
    id: "tejoori-premium",
    mono: "TP",
    name: "Tejoori Premium",
    tagline: "Premium & Premium Lite investment deposit",
    description:
      "Two-tier investment product (BD 75,000 / BD 50,000 minimum) paying competitive profit in advance, with medical cover and entry into Tejoori Al Islami draws.",
    tags: ["Sharia-compliant", "High minimum balance", "Relationship-managed"],
    customers: 3240,
    balance: 890.0,
    growth: 11.2,
    trend: [800.5, 818.2, 835.0, 852.6, 871.4, 890.0],
    flow: { inflow: [21, 24, 26, 23, 27, 29], outflow: [15, 17, 16, 18, 19, 20] },
    segments: { exec: 34, resprof: 21, maleprof: 19, retirees: 14, female: 6, youth: 3, sme: 3 },
    channels: {
      inflow: [
        { name: "Branch Counter", value: 12 },
        { name: "BisB Online Banking", value: 5 },
        { name: "Salary / Employer Transfer", value: 4 },
        { name: "BisB Mobile App", value: 3 },
        { name: "Fawri Instant Transfer", value: 3 },
        { name: "ATM / Kiosk Deposit", value: 0.5 },
      ],
      outflow: [
        { name: "Own & Other Account Transfer", value: 8 },
        { name: "Card & POS Payments", value: 5 },
        { name: "International Transfer", value: 4 },
        { name: "Fawateer Bill Payment", value: 2 },
        { name: "Standing Orders", value: 1.5 },
        { name: "ATM Cash Withdrawal", value: 1 },
        { name: "Branch Counter Withdrawal", value: 1 },
      ],
    },
  },
  {
    id: "tejoori-saver",
    mono: "TS",
    name: "Tejoori Saver",
    tagline: "Saver & Saver Lite for SMEs and entrepreneurs",
    description:
      "Lower minimum-deposit extension of Tejoori Premium aimed at individual savers, SME owners and entrepreneurs seeking stable returns and added benefits.",
    tags: ["Sharia-compliant", "SME-friendly", "Lower minimum"],
    customers: 26800,
    balance: 145.7,
    growth: 7.5,
    trend: [135.5, 138.0, 140.2, 142.0, 144.1, 145.7],
    flow: { inflow: [12, 13, 14, 13, 15, 16], outflow: [9, 10, 10, 11, 12, 13] },
    segments: { sme: 31, resprof: 19, female: 17, maleprof: 14, youth: 10, retirees: 6, exec: 3 },
    channels: {
      inflow: [
        { name: "Branch Counter", value: 6 },
        { name: "BisB Online Banking", value: 5 },
        { name: "BisB Mobile App", value: 4 },
        { name: "Salary / Employer Transfer", value: 3 },
        { name: "Fawri Instant Transfer", value: 2 },
        { name: "ATM / Kiosk Deposit", value: 1 },
      ],
      outflow: [
        { name: "Card & POS Payments", value: 5 },
        { name: "Standing Orders", value: 4 },
        { name: "Fawateer Bill Payment", value: 3 },
        { name: "Own & Other Account Transfer", value: 3 },
        { name: "ATM Cash Withdrawal", value: 1.5 },
        { name: "International Transfer", value: 1 },
        { name: "Branch Counter Withdrawal", value: 1 },
      ],
    },
  },
  {
    id: "investment-deposits",
    mono: "ID",
    name: "Investment Deposits",
    tagline: "Wakala & Murabaha term deposits",
    description:
      "Fixed-tenor Sharia-compliant term deposits for customers seeking predictable returns over a defined period, renewed or rolled over at maturity.",
    tags: ["Sharia-compliant", "Fixed tenor", "Institutional & retail"],
    customers: 9150,
    balance: 620.0,
    growth: -2.1,
    trend: [633.3, 629.0, 626.4, 624.1, 621.8, 620.0],
    flow: { inflow: [18, 17, 16, 15, 14, 13], outflow: [20, 19, 18, 19, 20, 21] },
    segments: { retirees: 27, exec: 24, resprof: 18, maleprof: 16, female: 8, sme: 5, youth: 2 },
    channels: {
      inflow: [
        { name: "Branch Counter", value: 9 },
        { name: "BisB Online Banking", value: 4 },
        { name: "Salary / Employer Transfer", value: 2 },
        { name: "Fawri Instant Transfer", value: 1.5 },
        { name: "BisB Mobile App", value: 1 },
        { name: "ATM / Kiosk Deposit", value: 0.3 },
      ],
      outflow: [
        { name: "Own & Other Account Transfer", value: 10 },
        { name: "Card & POS Payments", value: 3 },
        { name: "International Transfer", value: 3 },
        { name: "Branch Counter Withdrawal", value: 2 },
        { name: "ATM Cash Withdrawal", value: 2 },
        { name: "Standing Orders", value: 2 },
        { name: "Fawateer Bill Payment", value: 1 },
      ],
    },
  },
  {
    id: "bisb-premium",
    mono: "BP",
    name: "BisB Premium",
    tagline: "Premium relationship banking account",
    description:
      "Relationship-managed current & wealth account bundling preferential rates, dedicated service and lifestyle privileges for high-value customers.",
    tags: ["Sharia-compliant", "Relationship-managed", "Lifestyle privileges"],
    customers: 12400,
    balance: 300.0,
    growth: 5.6,
    trend: [284.1, 288.0, 291.5, 294.8, 297.6, 300.0],
    flow: { inflow: [16, 17, 18, 17, 19, 20], outflow: [13, 14, 14, 15, 16, 17] },
    segments: { maleprof: 26, exec: 22, resprof: 20, retirees: 12, female: 11, youth: 5, sme: 4 },
    channels: {
      inflow: [
        { name: "Branch Counter", value: 8 },
        { name: "BisB Mobile App", value: 4 },
        { name: "BisB Online Banking", value: 4 },
        { name: "Salary / Employer Transfer", value: 3 },
        { name: "Fawri Instant Transfer", value: 2 },
        { name: "ATM / Kiosk Deposit", value: 0.5 },
      ],
      outflow: [
        { name: "Card & POS Payments", value: 6 },
        { name: "Own & Other Account Transfer", value: 4 },
        { name: "International Transfer", value: 3 },
        { name: "Fawateer Bill Payment", value: 2 },
        { name: "ATM Cash Withdrawal", value: 2 },
        { name: "Standing Orders", value: 1.5 },
        { name: "Branch Counter Withdrawal", value: 1 },
      ],
    },
  },
  {
    id: "current-savings",
    mono: "CS",
    name: "Current & Savings",
    tagline: "Everyday transactional accounts",
    description:
      "Core current and savings accounts for day-to-day banking — salary crediting, bill payments, card spend and everyday transfers.",
    tags: ["Sharia-compliant", "Everyday banking", "Highest customer count"],
    customers: 241600,
    balance: 478.2,
    growth: 1.3,
    trend: [472.1, 473.5, 474.9, 475.8, 476.9, 478.2],
    flow: { inflow: [55, 57, 58, 56, 59, 61], outflow: [54, 55, 57, 55, 58, 60] },
    segments: { youth: 24, female: 19, resprof: 17, maleprof: 16, retirees: 11, sme: 8, exec: 5 },
    channels: {
      inflow: [
        { name: "BisB Mobile App", value: 22 },
        { name: "Salary / Employer Transfer", value: 18 },
        { name: "BisB Online Banking", value: 10 },
        { name: "Branch Counter", value: 6 },
        { name: "Fawri Instant Transfer", value: 5 },
        { name: "ATM / Kiosk Deposit", value: 3 },
      ],
      outflow: [
        { name: "Card & POS Payments", value: 24 },
        { name: "ATM Cash Withdrawal", value: 16 },
        { name: "Fawateer Bill Payment", value: 10 },
        { name: "Standing Orders", value: 5 },
        { name: "Own & Other Account Transfer", value: 4 },
        { name: "International Transfer", value: 2 },
        { name: "Branch Counter Withdrawal", value: 2 },
      ],
    },
  },
];

/* ---------------- formatting helpers ---------------- */
export const fmtBHD = (m: number): string =>
  Math.abs(m) >= 1000 ? `BHD ${(m / 1000).toFixed(2)}B` : `BHD ${m.toFixed(1)}M`;
export const fmtNum = (n: number): string => n.toLocaleString("en-US");
export const fmtPct = (p: number): string => `${p > 0 ? "+" : ""}${p.toFixed(1)}%`;
export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

// Reference lookup only (id -> display name) — safe to use even when the
// dashboard is running on live Supabase data, since product slugs/names are
// structural, not figures that would drift between the two data sources.
export const productName = (id: string): string => PRODUCTS.find((p) => p.id === id)?.name ?? id;

/* ---------------- outflow destination ---------------- */
export type DestBucket = "internal" | "cash" | "outside";

// Which bucket each outflow channel ultimately lands in:
// internal = stays inside BisB, cash = physically withdrawn, outside = leaves the bank entirely.
export const CHANNEL_BUCKET: Record<string, DestBucket> = {
  "Own & Other Account Transfer": "internal",
  "ATM Cash Withdrawal": "cash",
  "Branch Counter Withdrawal": "cash",
  "Card & POS Payments": "outside",
  "Fawateer Bill Payment": "outside",
  "Standing Orders": "outside",
  "International Transfer": "outside",
};

export const DEST_META: Record<DestBucket, { label: string; hint: string; color: string }> = {
  internal: {
    label: "Stayed within BisB",
    hint: "Own account & other BisB customer transfers",
    color: "var(--dest-internal)",
  },
  cash: {
    label: "Cash withdrawal",
    hint: "ATM and branch counter cash-out",
    color: "var(--dest-cash)",
  },
  outside: {
    label: "Digital withdrawal",
    hint: "Card/POS, bills, standing orders & international transfers — leaves the bank electronically",
    color: "var(--dest-outside)",
  },
};

export interface DestinationBreakdown {
  totals: Record<DestBucket, number>;
  total: number;
  byChannel: { name: string; value: number; bucket: DestBucket }[];
}

export function computeDestination(products: Product[]): DestinationBreakdown {
  const totals: Record<DestBucket, number> = { internal: 0, cash: 0, outside: 0 };
  const channelTotals = new Map<string, number>();

  products.forEach((p) => {
    p.channels.outflow.forEach(({ name, value }) => {
      const bucket = CHANNEL_BUCKET[name] ?? "outside";
      totals[bucket] += value;
      channelTotals.set(name, (channelTotals.get(name) ?? 0) + value);
    });
  });

  const total = totals.internal + totals.cash + totals.outside;
  const byChannel = [...channelTotals.entries()]
    .map(([name, value]) => ({ name, value, bucket: CHANNEL_BUCKET[name] ?? ("outside" as DestBucket) }))
    .sort((a, b) => b.value - a.value);

  return { totals, total, byChannel };
}

export interface DestShare {
  bucket: DestBucket;
  label: string;
  hint: string;
  color: string;
  pct: number;
}

export function destShares(totals: Record<DestBucket, number>, total: number): DestShare[] {
  return (["internal", "cash", "outside"] as DestBucket[]).map((bucket) => ({
    bucket,
    ...DEST_META[bucket],
    pct: total ? (totals[bucket] / total) * 100 : 0,
  }));
}
