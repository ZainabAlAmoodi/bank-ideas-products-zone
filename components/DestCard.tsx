import { computeDestination, destShares, fmtBHD, sum, type Product } from "@/lib/data";

export function DestCard({ products, label, onOpen }: { products: Product[]; label: string; onOpen: () => void }) {
  const { totals, total: totalOutflow } = computeDestination(products);
  const shares = destShares(totals, totalOutflow);
  const totalInflow = sum(products.flatMap((p) => p.channels.inflow.map((c) => c.value)));

  return (
    <button className="dest-card" onClick={onOpen}>
      <div className="dest-card-head">
        <h3>{label}</h3>
        <span className="dest-open-hint">Full breakdown &rarr;</span>
      </div>
      <div className="dest-flow-stats">
        <div>
          <div className="stat-mini-label">Total inflows</div>
          <div className="stat-mini-value tabular">{fmtBHD(totalInflow)}</div>
        </div>
        <div>
          <div className="stat-mini-label">Total outflows</div>
          <div className="stat-mini-value tabular">{fmtBHD(totalOutflow)}</div>
        </div>
      </div>
      <div className="stacked-bar">
        {shares.map((s) => (
          <span key={s.bucket} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      <div className="dest-legend">
        {shares.map((s) => (
          <span className="item" key={s.bucket}>
            <span className="swatch" style={{ background: s.color }} />
            {s.label} <b>{s.pct.toFixed(0)}%</b>
          </span>
        ))}
      </div>
    </button>
  );
}
