"use client";

import type { MouseEvent, ReactNode } from "react";

export interface BarItem {
  label: string;
  value: number;
  valueLabel: string;
  color: string;
  badge?: ReactNode;
  /** Show this logo before the label (label is kept as the logo's alt text / tooltip). */
  logoSrc?: string;
  /** When set alongside logoSrc, shown as text next to the logo instead of `label`. */
  productName?: string;
}

export function BarList({
  items,
  showTip,
  hideTip,
  onItemClick,
}: {
  items: BarItem[];
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  onItemClick?: (index: number) => void;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="bar-list">
      {items.map((it, idx) => {
        const pct = Math.max((it.value / max) * 100, 2);
        return (
          <div
            className="bar-row"
            key={it.label}
            style={onItemClick ? { cursor: "pointer" } : undefined}
            onClick={onItemClick ? () => onItemClick(idx) : undefined}
          >
            <div className="bar-row-label">
              {it.logoSrc ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.logoSrc} alt={it.label} className="bar-row-logo" />
                  {it.productName && <span className="txt">{it.productName}</span>}
                </>
              ) : (
                <span className="txt">{it.label}</span>
              )}
              {it.badge}
            </div>
            <div
              className="bar-track"
              onMouseMove={(e) => showTip(e, it.label, it.valueLabel)}
              onMouseLeave={hideTip}
            >
              <div className="bar-fill" style={{ width: `${pct}%`, background: it.color }} />
            </div>
            <div className="bar-value tabular">{it.valueLabel}</div>
          </div>
        );
      })}
    </div>
  );
}
