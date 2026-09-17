"use client";

import { useState } from "react";
import { fmtBHD, fmtPct, type Product } from "@/lib/data";
import type { ActionItem } from "@/lib/competitors";
import type { Trigger } from "@/lib/triggers";

// Checklist + combined forecast for a product's action plan. Picking items
// recomputes a simple additive projection live: baseline extrapolates the
// current YoY trend; each checked action adds its own illustrative uplift on
// top. Hover (native title tooltip, so long sentences wrap normally) explains
// the numbers rather than just stating them.
export function ActionPlanForecast({ product, trigger, actionPlan }: { product: Product; trigger: Trigger | null; actionPlan: ActionItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const baselinePct = trigger?.currentYoY ?? 0;
  const lastBalance = product.balance;
  const selectedItems = actionPlan.filter((a) => selected.has(a.id));
  const impactSum = selectedItems.reduce((s, a) => s + a.impactPct, 0);
  const projectedPct = baselinePct + impactSum;

  const baselineBalance = lastBalance * (1 + baselinePct / 100);
  const projectedBalance = lastBalance * (1 + projectedPct / 100);
  const deltaBalance = projectedBalance - baselineBalance;

  const baselineTitle = `Assumes the current ${fmtPct(baselinePct)} year-over-year trend continues unchanged into next quarter, applied to the latest balance of ${fmtBHD(lastBalance)}.`;
  const projectedTitle =
    selectedItems.length === 0
      ? "Check one or more actions on the left to project their combined effect."
      : `Baseline ${fmtPct(baselinePct)} + ${selectedItems.map((a) => fmtPct(a.impactPct)).join(" + ")} = ${fmtPct(projectedPct)} combined, applied to ${fmtBHD(lastBalance)}. This is a simple additive model, not a rigorous forecast.`;
  const deltaTitle =
    selectedItems.length === 0
      ? "No actions selected yet."
      : selectedItems.map((a) => `• ${a.text} (${fmtPct(a.impactPct)}): ${a.rationale}`).join(" ");

  return (
    <div className="plan-forecast-layout">
      <div className="plan-checklist">
        {actionPlan.map((item, i) => {
          const checked = selected.has(item.id);
          return (
            <label className={`plan-item ${checked ? "is-checked" : ""}`} key={item.id}>
              <input type="checkbox" checked={checked} onChange={() => toggle(item.id)} />
              <div className="plan-item-body">
                <span className="plan-item-text">
                  {i + 1}. {item.text}
                </span>
                <span className="plan-item-impact">Est. impact: {fmtPct(item.impactPct)} next quarter</span>
              </div>
            </label>
          );
        })}
      </div>

      <div className="forecast-panel">
        <div className="forecast-title">Combined forecast</div>
        <div className="forecast-stats">
          <div className="forecast-stat" title={baselineTitle}>
            <span className="fs-label">Baseline (no action)</span>
            <span className="fs-value tabular">{fmtBHD(baselineBalance)}</span>
          </div>
          <div className="forecast-stat" title={projectedTitle}>
            <span className="fs-label">
              With {selectedItems.length} selected action{selectedItems.length === 1 ? "" : "s"}
            </span>
            <span className="fs-value tabular">{fmtBHD(projectedBalance)}</span>
          </div>
        </div>
        <div className="forecast-delta" title={deltaTitle}>
          <span className="fs-label">Projected net impact</span>
          <span className="fd-value tabular">
            {deltaBalance >= 0 ? "+" : "−"}
            {fmtBHD(Math.abs(deltaBalance))}
          </span>
        </div>
        {selectedItems.length === 0 && <p className="forecast-empty">Check actions on the left to see their combined effect here.</p>}
      </div>
    </div>
  );
}
