"use client";

import { useEffect } from "react";
import { computeDestination, destShares, fmtBHD, DEST_META, type Product } from "@/lib/data";

export interface DestTarget {
  products: Product[];
  label: string;
}

export function DestModal({ target, onClose }: { target: DestTarget | null; onClose: () => void }) {
  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [target, onClose]);

  if (!target) return null;
  const { products, label } = target;
  const { totals, total, byChannel } = computeDestination(products);
  const shares = destShares(totals, total);

  return (
    <div
      className="modal-overlay is-open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="dest-modal-title">
        <div className="modal-head">
          <div>
            <h2 id="dest-modal-title">Outflow destination &mdash; {label}</h2>
            <p>
              Where every outflow BHD ultimately went, based on average monthly channel volume ({fmtBHD(total)}{" "}
              total).
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="dest-stat-row">
          {shares.map((s) => (
            <div className="dest-stat" key={s.bucket}>
              <div className="swatch-lbl">
                <span className="swatch" style={{ background: s.color }} />
                {s.label}
              </div>
              <div className="val tabular">{fmtBHD(totals[s.bucket])}</div>
              <div className="pct">
                {s.pct.toFixed(1)}% of outflows &middot; {s.hint}
              </div>
            </div>
          ))}
        </div>

        <div className="stacked-bar" style={{ height: 20 }}>
          {shares.map((s) => (
            <span key={s.bucket} style={{ width: `${s.pct}%`, background: s.color }} />
          ))}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="modal-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Destination</th>
                <th className="num">Avg. monthly volume</th>
                <th className="num">Share of outflow</th>
              </tr>
            </thead>
            <tbody>
              {byChannel.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td>
                    <span className="badge neutral">
                      <span className="dot" style={{ background: DEST_META[c.bucket].color }} />
                      {DEST_META[c.bucket].label}
                    </span>
                  </td>
                  <td className="num tabular">{fmtBHD(c.value)}</td>
                  <td className="num tabular">{(total ? (c.value / total) * 100 : 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
