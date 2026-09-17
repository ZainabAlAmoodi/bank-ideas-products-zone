// Detail behind the "stayed within BisB" bucket in the Funds Tracker: which
// account type the money moved TO when it left a product via the "Own &
// Other Account Transfer" channel, rather than just a single lump total.
// Sample/illustrative, but each product's flows sum to exactly that
// product's existing "Own & Other Account Transfer" channel value in
// lib/data.ts, so the two datasets never contradict each other.

export interface InternalTransferFlow {
  fromProductId: string;
  toProductId: string;
  volume: number; // BHD millions, avg monthly
}

export const INTERNAL_TRANSFERS: InternalTransferFlow[] = [
  // Tejoori Al Islami — Own & Other Account Transfer = 3.0
  { fromProductId: "tejoori-al-islami", toProductId: "current-savings", volume: 2.0 },
  { fromProductId: "tejoori-al-islami", toProductId: "tejoori-premium", volume: 1.0 },

  // Tejoori Premium — Own & Other Account Transfer = 8.0
  { fromProductId: "tejoori-premium", toProductId: "current-savings", volume: 3.0 },
  { fromProductId: "tejoori-premium", toProductId: "investment-deposits", volume: 3.0 },
  { fromProductId: "tejoori-premium", toProductId: "bisb-premium", volume: 2.0 },

  // Tejoori Saver — Own & Other Account Transfer = 3.0
  { fromProductId: "tejoori-saver", toProductId: "current-savings", volume: 1.5 },
  { fromProductId: "tejoori-saver", toProductId: "tejoori-premium", volume: 1.5 },

  // Investment Deposits — Own & Other Account Transfer = 10.0
  { fromProductId: "investment-deposits", toProductId: "current-savings", volume: 6.0 },
  { fromProductId: "investment-deposits", toProductId: "tejoori-premium", volume: 4.0 },

  // BisB Premium — Own & Other Account Transfer = 4.0
  { fromProductId: "bisb-premium", toProductId: "current-savings", volume: 2.0 },
  { fromProductId: "bisb-premium", toProductId: "investment-deposits", volume: 2.0 },

  // Current & Savings — Own & Other Account Transfer = 4.0
  { fromProductId: "current-savings", toProductId: "tejoori-al-islami", volume: 2.5 },
  { fromProductId: "current-savings", toProductId: "tejoori-saver", volume: 1.5 },
];

export function getInternalTransfersFrom(productIds: string[]): InternalTransferFlow[] {
  const idSet = new Set(productIds);
  return INTERNAL_TRANSFERS.filter((f) => idSet.has(f.fromProductId)).sort((a, b) => b.volume - a.volume);
}
