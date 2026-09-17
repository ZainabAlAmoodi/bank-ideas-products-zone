// Three years of quarterly history (Q1'24 → Q3'26) per product — the basis
// for the trigger/alert system in lib/triggers.ts. Sample data, hand-authored
// so a couple of products genuinely demonstrate a year-over-year reversal and
// one demonstrates an ongoing-but-not-alarming decline; the rest just grow.
//
// Each product's Q2'26/Q3'26 balance is anchored to match the existing
// 6-month `trend` (Jun/Sep) and `balance` fields in lib/data.ts, so the two
// datasets never contradict each other.

export interface QuarterPoint {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  label: string; // e.g. "Q3'26"
  balance: number; // BHD millions
  customers: number;
  inflow: number; // BHD millions, quarterly total
  outflow: number; // BHD millions, quarterly total
}

const LABELS: { year: number; quarter: 1 | 2 | 3 | 4 }[] = [
  { year: 2024, quarter: 1 },
  { year: 2024, quarter: 2 },
  { year: 2024, quarter: 3 },
  { year: 2024, quarter: 4 },
  { year: 2025, quarter: 1 },
  { year: 2025, quarter: 2 },
  { year: 2025, quarter: 3 },
  { year: 2025, quarter: 4 },
  { year: 2026, quarter: 1 },
  { year: 2026, quarter: 2 },
  { year: 2026, quarter: 3 },
];

function series(
  balance: number[],
  customers: number[],
  inflow: number[],
  outflow: number[]
): QuarterPoint[] {
  return LABELS.map((l, i) => ({
    ...l,
    label: `Q${l.quarter}'${String(l.year).slice(2)}`,
    balance: balance[i],
    customers: customers[i],
    inflow: inflow[i],
    outflow: outflow[i],
  }));
}

// Reversal: healthy growth through 2025, then a decline vs. the same quarter
// a year earlier — the pattern the trigger system is built to catch.
const tejooriAlIslami = series(
  [558.0, 572.0, 590.0, 604.0, 597.0, 613.0, 631.3, 646.0, 624.0, 598.5, 612.4],
  [176000, 178500, 181000, 184000, 185500, 187000, 189000, 190500, 188000, 186000, 184500],
  [118, 121, 124, 128, 130, 133, 136, 139, 132, 134, 145],
  [100, 103, 105, 108, 110, 112, 114, 117, 118, 119, 127]
);

// Consistent, healthy growth throughout — not flagged.
const tejooriPremium = series(
  [660.0, 680.0, 700.0, 725.0, 750.0, 770.0, 790.0, 805.0, 815.0, 835.0, 890.0],
  [2600, 2750, 2900, 3000, 3050, 3100, 3150, 3180, 3200, 3220, 3240],
  [50, 54, 58, 62, 65, 67, 69, 70, 68, 71, 79],
  [35, 38, 40, 42, 44, 45, 46, 47, 47, 48, 57]
);

// Consistent, healthy growth throughout — not flagged.
const tejooriSaver = series(
  [110.0, 114.0, 118.0, 122.0, 126.0, 129.0, 132.0, 135.0, 137.0, 140.2, 145.7],
  [21000, 22200, 23400, 24300, 24900, 25400, 25800, 26100, 26400, 26600, 26800],
  [28, 31, 33, 35, 36, 37, 38, 39, 38, 39, 44],
  [20, 22, 24, 25, 26, 27, 28, 29, 28, 29, 36]
);

// Ongoing decline in both YoY comparisons (and moderating, -4.1% -> -2.1%) —
// deliberately NOT flagged, to prove the trigger isn't just "down = alert".
const investmentDeposits = series(
  [672.0, 666.0, 660.0, 652.0, 645.0, 639.0, 633.0, 632.0, 630.0, 626.4, 620.0],
  [9800, 9700, 9600, 9500, 9400, 9350, 9300, 9250, 9200, 9180, 9150],
  [65, 62, 60, 58, 56, 54, 52, 50, 49, 51, 42],
  [50, 52, 54, 55, 56, 57, 58, 59, 58, 57, 60]
);

// Consistent, healthy growth throughout — not flagged.
const bisbPremium = series(
  [240.0, 248.0, 255.0, 262.0, 268.0, 273.0, 278.0, 283.0, 287.0, 291.5, 300.0],
  [10800, 11100, 11400, 11700, 11900, 12050, 12150, 12250, 12320, 12360, 12400],
  [38, 41, 44, 46, 47, 48, 49, 50, 49, 51, 56],
  [30, 32, 34, 36, 37, 38, 39, 40, 40, 41, 48]
);

// Reversal: growing through 2025, a mild YoY decline in 2026 — even though
// the last 6 months alone look like a recovery (still below last year's
// same-quarter level, which is exactly the kind of thing month-to-month
// views miss and a YoY trigger catches).
const currentSavings = series(
  [452.0, 461.0, 470.0, 467.0, 473.0, 480.0, 485.0, 479.0, 471.0, 474.9, 478.2],
  [228000, 231000, 234500, 237000, 238500, 240000, 242500, 243000, 240500, 241000, 241600],
  [150, 155, 158, 162, 164, 167, 169, 172, 168, 170, 176],
  [148, 150, 153, 156, 158, 160, 162, 165, 163, 166, 173]
);

export const PRODUCT_HISTORY: Record<string, QuarterPoint[]> = {
  "tejoori-al-islami": tejooriAlIslami,
  "tejoori-premium": tejooriPremium,
  "tejoori-saver": tejooriSaver,
  "investment-deposits": investmentDeposits,
  "bisb-premium": bisbPremium,
  "current-savings": currentSavings,
};
