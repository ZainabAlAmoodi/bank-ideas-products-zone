import { computeDestination, destShares, fmtBHD, type Product } from "@/lib/data";

export function DestCard({
  products,
  label,
  onOpen,
}: {
  products: Product[];
  label: string;
  onOpen: () => void;
}) {
  const { totals, total } = computeDestination(products);
  const shares = destShares(totals, total);

  return (
    <button className="dest-card" onClick={onOpen}>
      <div className="dest-card-head">
        <h3>
          {label} &middot; monthly avg. {fmtBHD(total)} in outflows
        </h3>
        <span className="dest-open-hint">Full breakdown &rarr;</span>
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
