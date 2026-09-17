import { PRODUCT_HISTORY } from "./history";
import type { Product } from "./data";

export interface Trigger {
  flagged: boolean;
  /** YoY change, same quarter, the year before the current one (e.g. 2025 vs 2024). */
  priorYoY: number;
  /** YoY change, same quarter, this year vs. last year (e.g. 2026 vs 2025). */
  currentYoY: number;
  /** The quarter label being compared across all three years, e.g. "Q3". */
  period: string;
}

// A product is only flagged when this year breaks a prior growth pattern —
// a decline that follows another decline is treated as an expected trend,
// not an alert. Always compares the same quarter across years, so a normal
// seasonal dip never gets mistaken for a reversal.
export function computeTrigger(productId: string): Trigger | null {
  const history = PRODUCT_HISTORY[productId];
  if (!history || history.length < 11) return null;

  const latestQuarter = history[history.length - 1].quarter;
  const sameQuarter = history.filter((h) => h.quarter === latestQuarter).sort((a, b) => a.year - b.year);
  if (sameQuarter.length < 3) return null;

  const [twoYearsAgo, lastYear, thisYear] = sameQuarter.slice(-3);
  const priorYoY = ((lastYear.balance - twoYearsAgo.balance) / twoYearsAgo.balance) * 100;
  const currentYoY = ((thisYear.balance - lastYear.balance) / lastYear.balance) * 100;

  return {
    flagged: currentYoY < 0 && priorYoY >= 0,
    priorYoY,
    currentYoY,
    period: `Q${latestQuarter}`,
  };
}

export interface FlaggedProduct {
  product: Product;
  trigger: Trigger;
}

export function getFlaggedProducts(products: Product[]): FlaggedProduct[] {
  return products
    .map((product) => ({ product, trigger: computeTrigger(product.id) }))
    .filter((f): f is FlaggedProduct => Boolean(f.trigger?.flagged));
}
