"use client";

import { useEffect, type MouseEvent } from "react";
import { rankedSegments, type Product } from "@/lib/data";
import { computeTrigger } from "@/lib/triggers";
import { PRODUCT_HISTORY } from "@/lib/history";
import { PRODUCT_COMPETITOR_INTEL } from "@/lib/competitors";
import { YearOverYearChart } from "@/components/YearOverYearChart";
import { BarList } from "@/components/BarList";
import { CompetitorStanding } from "@/components/CompetitorStanding";
import { ActionPlanForecast } from "@/components/ActionPlanForecast";

function formatPct(p: number): string {
  return `${p > 0 ? "+" : ""}${p.toFixed(1)}%`;
}

export function DeepDiveModal({
  products,
  productId,
  showTip,
  hideTip,
  onClose,
}: {
  products: Product[];
  productId: string | null;
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!productId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [productId, onClose]);

  const product = productId ? products.find((p) => p.id === productId) ?? null : null;
  const intel = productId ? PRODUCT_COMPETITOR_INTEL[productId] : undefined;

  if (!product || !productId) return null;

  const trigger = computeTrigger(productId);
  const history = PRODUCT_HISTORY[productId];
  const best = rankedSegments(product).slice(0, 2);
  const opportunity = [...rankedSegments(product)].slice(-2).reverse();

  return (
    <div
      className="modal-overlay is-open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box wide" role="dialog" aria-modal="true" aria-labelledby="deepdive-title">
        <div className="modal-head">
          <div>
            <h2 id="deepdive-title">{product.name} — deep dive</h2>
            <p>Performance today, market standing, and a concrete action plan.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="story-step">
          <div className="story-step-head">
            <span className="story-step-num">1</span>
            <h3>Today</h3>
          </div>
          {trigger && (
            <p className="story-step-sub" style={{ marginBottom: -4 }}>
              Grew {formatPct(trigger.priorYoY)} in {trigger.period} the year before, but this {trigger.period} is
              down {formatPct(trigger.currentYoY)} against the same quarter last year — not a normal seasonal
              dip.
            </p>
          )}
          {history && <YearOverYearChart history={history} showTip={showTip} hideTip={hideTip} height={170} />}
          <BarList
            items={rankedSegments(product).map((s) => ({
              label: s.meta.label,
              value: s.value,
              valueLabel: `${s.value}%`,
              color: s.meta.color,
            }))}
            showTip={showTip}
            hideTip={hideTip}
          />
          <div className="callout-grid">
            <div className="callout good">
              <h4>
                <span className="badge good">
                  <span className="dot" />
                  Best performing
                </span>
              </h4>
              <ul>
                {best.map((s) => (
                  <li key={s.key}>
                    <span>{s.meta.label}</span>
                    <b>{s.value}%</b>
                  </li>
                ))}
              </ul>
            </div>
            <div className="callout opportunity">
              <h4>
                <span className="badge opportunity">
                  <span className="dot" />
                  Opportunity
                </span>
              </h4>
              <ul>
                {opportunity.map((s) => (
                  <li key={s.key}>
                    <span>{s.meta.label}</span>
                    <b>{s.value}%</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="story-divider" />

        <div className="story-step">
          <div className="story-step-head">
            <span className="story-step-num">2</span>
            <h3>Where BisB stands vs. competitors</h3>
          </div>
          {intel ? (
            <CompetitorStanding intel={intel} showTip={showTip} hideTip={hideTip} />
          ) : (
            <p className="story-step-sub">No competitor intel recorded for this product yet.</p>
          )}
        </div>

        <hr className="story-divider" />

        <div className="story-step">
          <div className="story-step-head">
            <span className="story-step-num">3</span>
            <h3>Action plan</h3>
          </div>
          {intel ? (
            <>
              <p className="story-step-sub">Check the actions you&apos;d run — the panel on the right recomputes the combined forecast live.</p>
              <ActionPlanForecast product={product} trigger={trigger} actionPlan={intel.actionPlan} />
            </>
          ) : (
            <p className="story-step-sub">No action plan recorded for this product yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
