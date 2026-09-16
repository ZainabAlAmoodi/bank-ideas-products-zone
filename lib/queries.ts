import "server-only";
import { getSupabaseClient } from "./supabase/client";
import { PRODUCTS as MOCK_PRODUCTS, type Product, type SegmentKey } from "./data";

export type ProductsSource = "supabase" | "mock";

interface ProductRow {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[] | null;
  mono: string;
}

interface MonthlyRow {
  product_id: string;
  month: string;
  customers: number;
  balance_bhd_m: number | string;
  inflow_bhd_m: number | string;
  outflow_bhd_m: number | string;
}

interface SegmentMetricRow {
  product_id: string;
  segment_key: SegmentKey;
  value_pct: number | string;
}

interface ChannelMetricRow {
  product_id: string;
  volume_bhd_m: number | string;
  channels: { name: string; direction: "inflow" | "outflow" } | null;
}

// Fetches every table from Supabase and reshapes it back into the same
// `Product[]` shape the dashboard components already expect. Falls back to
// the bundled sample data (lib/data.ts) whenever Supabase isn't configured
// yet, or a query fails, so the app keeps working during setup.
export async function getProducts(): Promise<{ products: Product[]; source: ProductsSource }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { products: MOCK_PRODUCTS, source: "mock" };
  }

  try {
    const [productsRes, monthlyRes, segmentsRes, channelsRes] = await Promise.all([
      supabase.from("products").select("id, name, tagline, description, tags, mono").eq("is_active", true).order("sort_order"),
      supabase.from("product_metrics_monthly").select("product_id, month, customers, balance_bhd_m, inflow_bhd_m, outflow_bhd_m").order("month"),
      supabase.from("product_segment_metrics").select("product_id, segment_key, value_pct"),
      supabase.from("product_channel_metrics").select("product_id, volume_bhd_m, channels(name, direction)"),
    ]);

    const firstError = productsRes.error || monthlyRes.error || segmentsRes.error || channelsRes.error;
    if (firstError) throw firstError;

    const productRows = (productsRes.data ?? []) as ProductRow[];
    if (productRows.length === 0) throw new Error("Supabase returned no active products");

    const monthlyRows = (monthlyRes.data ?? []) as MonthlyRow[];
    const segmentRows = (segmentsRes.data ?? []) as SegmentMetricRow[];
    const channelRows = (channelsRes.data ?? []) as unknown as ChannelMetricRow[];

    const products: Product[] = productRows.map((row) => {
      const months = monthlyRows
        .filter((m) => m.product_id === row.id)
        .sort((a, b) => a.month.localeCompare(b.month));
      const latest = months[months.length - 1];
      const first = months[0];
      const firstBalance = first ? Number(first.balance_bhd_m) : 0;
      const latestBalance = latest ? Number(latest.balance_bhd_m) : 0;
      const growth = firstBalance ? ((latestBalance - firstBalance) / firstBalance) * 100 : 0;

      const segments = Object.fromEntries(
        segmentRows.filter((s) => s.product_id === row.id).map((s) => [s.segment_key, Number(s.value_pct)])
      ) as Record<SegmentKey, number>;

      const productChannels = channelRows.filter((c) => c.product_id === row.id && c.channels);
      const toEntries = (direction: "inflow" | "outflow") =>
        productChannels
          .filter((c) => c.channels!.direction === direction)
          .map((c) => ({ name: c.channels!.name, value: Number(c.volume_bhd_m) }));

      return {
        id: row.id,
        mono: row.mono,
        name: row.name,
        tagline: row.tagline,
        description: row.description,
        tags: row.tags ?? [],
        customers: latest?.customers ?? 0,
        balance: latestBalance,
        growth,
        trend: months.map((m) => Number(m.balance_bhd_m)),
        flow: {
          inflow: months.map((m) => Number(m.inflow_bhd_m)),
          outflow: months.map((m) => Number(m.outflow_bhd_m)),
        },
        segments,
        channels: { inflow: toEntries("inflow"), outflow: toEntries("outflow") },
      };
    });

    return { products, source: "supabase" };
  } catch (err) {
    console.error("[supabase] falling back to sample data:", err);
    return { products: MOCK_PRODUCTS, source: "mock" };
  }
}
