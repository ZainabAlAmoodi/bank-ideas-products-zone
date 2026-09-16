import { fmtPct } from "@/lib/data";

export function DeltaChip({ pct }: { pct: number }) {
  const pos = pct >= 0;
  return (
    <span className={`kpi-delta ${pos ? "pos" : "neg"}`}>
      {pos ? "▲" : "▼"} {fmtPct(pct)}
    </span>
  );
}
