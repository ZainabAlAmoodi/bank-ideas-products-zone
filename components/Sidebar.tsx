import { fmtBHD, fmtPct, type Product } from "@/lib/data";
import { computeTrigger } from "@/lib/triggers";
import { BisbMark } from "@/components/BisbMark";

export function Sidebar({
  products,
  view,
  onNavigate,
}: {
  products: Product[];
  view: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <nav className="sidebar" aria-label="Products">
      <div className="brand">
        <div className="brand-mark">
          <BisbMark size={22} />
        </div>
        <div>
          <div className="brand-word">BisB Studio</div>
          <div className="brand-sub">Account Product Performance</div>
        </div>
      </div>

      <div>
        <div className="nav-label">Dashboard</div>
        <div className="nav-list">
          <button
            className={`nav-item is-home ${view === "overview" ? "is-active" : ""}`}
            onClick={() => onNavigate("overview")}
          >
            <span className="nav-mono">All</span>
            <span className="nav-text">
              <span className="nav-name">Portfolio Overview</span>
            </span>
          </button>
        </div>
      </div>

      <div>
        <div className="nav-label">Account Products</div>
        <div className="nav-list">
          {products.map((p) => (
            <button
              key={p.id}
              className={`nav-item ${view === p.id ? "is-active" : ""}`}
              onClick={() => onNavigate(p.id)}
            >
              <span className="nav-mono">{p.mono}</span>
              <span className="nav-text">
                <span className="nav-name">
                  {p.name} {computeTrigger(p.id)?.flagged && <span className="flag-dot" title="Needs attention" />}
                </span>
                <span className="nav-meta">
                  <span>{fmtBHD(p.balance)}</span>
                  <span className={`nav-growth ${p.growth >= 0 ? "pos" : "neg"}`}>{fmtPct(p.growth)}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-foot">
        Sample data for template purposes.
        <br />
        Edit <code>lib/data.ts</code> to connect real figures.
      </div>
    </nav>
  );
}
