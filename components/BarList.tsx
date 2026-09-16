"use client";

import type { MouseEvent, ReactNode } from "react";

export interface BarItem {
  label: string;
  value: number;
  valueLabel: string;
  color: string;
  badge?: ReactNode;
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
              <span className="txt">{it.label}</span>
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
