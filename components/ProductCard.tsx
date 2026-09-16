import { fmtBHD, fmtNum, type Product } from "@/lib/data";
import { DeltaChip } from "@/components/DeltaChip";

export function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  return (
    <button className="product-card" onClick={onOpen}>
      <div className="product-card-top">
        <div className="mono-badge">{product.mono}</div>
        <div>
          <h3>{product.name}</h3>
          <div className="tagline">{product.tagline}</div>
        </div>
      </div>
      <div className="product-card-stats">
        <div>
          <div className="stat-mini-label">Customers</div>
          <div className="stat-mini-value tabular">{fmtNum(product.customers)}</div>
        </div>
        <div>
          <div className="stat-mini-label">Balance</div>
          <div className="stat-mini-value tabular">{fmtBHD(product.balance)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="stat-mini-label">Growth</div>
          <DeltaChip pct={product.growth} />
        </div>
      </div>
    </button>
  );
}
