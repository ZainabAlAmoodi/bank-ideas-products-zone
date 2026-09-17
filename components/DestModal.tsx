"use client";

import { useEffect, type MouseEvent } from "react";
import { computeDestination, destShares, fmtBHD, productName, DEST_META, type Product } from "@/lib/data";
import { getInternalTransfersFrom } from "@/lib/internalTransfers";
import { BarList } from "@/components/BarList";

export interface DestTarget {
  products: Product[];
  label: string;
}

function aggregateChannels(products: Product[], direction: "inflow" | "outflow") {
  const map = new Map<string, number>();
  products.forEach((p) => p.channels[direction].forEach((c) => map.set(c.name, (map.get(c.name) ?? 0) + c.value)));
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function DestModal({
  target,
  showTip,
  hideTip,
  onClose,
}: {
  target: DestTarget | null;
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  onClose: () => void;
}) {
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
  const internalTransfers = getInternalTransfersFrom(products.map((p) => p.id));

  const topInflow = aggregateChannels(products, "inflow").slice(0, 3);
  const topOutflowOpportunity = aggregateChannels(products, "outflow").slice(0, 3);

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

        {internalTransfers.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Stayed within BisB &mdash; from</th>
                  <th>To</th>
                  <th className="num">Avg. monthly volume</th>
                </tr>
              </thead>
              <tbody>
                {internalTransfers.map((f) => (
                  <tr key={`${f.fromProductId}-${f.toProductId}`}>
                    <td>{productName(f.fromProductId)}</td>
                    <td>{productName(f.toProductId)}</td>
                    <td className="num tabular">{fmtBHD(f.volume)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

        <div className="grid-2 equal">
          <div>
            <div className="popover-subtitle">Top performing channels &middot; inflows</div>
            <BarList
              items={topInflow.map((c, i) => ({
                label: c.name,
                value: c.value,
                valueLabel: fmtBHD(c.value),
                color: "var(--flow-in)",
                badge:
                  i === 0 ? (
                    <span className="badge good">
                      <span className="dot" />
                      Top
                    </span>
                  ) : undefined,
              }))}
              showTip={showTip}
              hideTip={hideTip}
            />
          </div>
          <div>
            <div className="popover-subtitle">Channels with opportunity &middot; highest outflows</div>
            <BarList
              items={topOutflowOpportunity.map((c) => ({
                label: c.name,
                value: c.value,
                valueLabel: fmtBHD(c.value),
                color: "var(--flow-out)",
                badge: (
                  <span className="badge opportunity">
                    <span className="dot" />
                    Opportunity
                  </span>
                ),
              }))}
              showTip={showTip}
              hideTip={hideTip}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
