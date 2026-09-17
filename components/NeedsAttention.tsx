"use client";

import type { MouseEvent } from "react";
import { MONTHS, type Product } from "@/lib/data";
import { PRODUCT_HISTORY } from "@/lib/history";
import type { FlaggedProduct } from "@/lib/triggers";
import { TrendChart } from "@/components/TrendChart";

function formatPct(p: number): string {
  return `${p > 0 ? "+" : ""}${p.toFixed(1)}%`;
}

export function NeedsAttention({
  flagged,
  totalProducts,
  showTip,
  hideTip,
  onOpenDeepDive,
}: {
  flagged: FlaggedProduct[];
  totalProducts: number;
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  onOpenDeepDive: (productId: string) => void;
}) {
  return (
    <div className="section">
      <div className="section-head">
        <h2 className="section-title">Areas of focus</h2>
        <span className="section-note">Flagged by comparing this year against the same quarter, the last two years</span>
      </div>

      {flagged.length === 0 ? (
        <p className="attention-headline">
          <b>No products</b> are showing a year-over-year reversal this quarter — every decline currently
          tracking is consistent with its prior trend.
        </p>
      ) : (
        <>
          <p className="attention-headline">
            <b>
              {flagged.length} of {totalProducts} products
            </b>{" "}
            broke a prior growth trend this quarter — not just a normal seasonal dip.
          </p>
          <div className="attention-grid">
            {flagged.map(({ product, trigger }) => (
              <AlertCard
                key={product.id}
                product={product}
                priorYoY={trigger.priorYoY}
                currentYoY={trigger.currentYoY}
                period={trigger.period}
                showTip={showTip}
                hideTip={hideTip}
                onOpen={() => onOpenDeepDive(product.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AlertCard({
  product,
  priorYoY,
  currentYoY,
  period,
  showTip,
  hideTip,
  onOpen,
}: {
  product: Product;
  priorYoY: number;
  currentYoY: number;
  period: string;
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  onOpen: () => void;
}) {
  const history = PRODUCT_HISTORY[product.id];
  const values = history ? history.map((h) => h.balance) : product.trend;
  const labels = history ? history.map((h) => h.label) : MONTHS;

  return (
    <button className="alert-card" onClick={onOpen}>
      <div className="alert-card-head">
        <span className="name">{product.name}</span>
        <span className="badge critical">
          <span className="dot" />
          Needs attention
        </span>
      </div>
      <p className="alert-reason">
        Grew {formatPct(priorYoY)} in {period} the year before, but this {period} is down {formatPct(currentYoY)}{" "}
        against the same quarter last year.
      </p>
      <div className="alert-yoy-row">
        <div>
          <div className="yoy-label">Prior YoY</div>
          <div className="yoy-value" style={{ color: "var(--good)" }}>
            {formatPct(priorYoY)}
          </div>
        </div>
        <div>
          <div className="yoy-label">This year</div>
          <div className="yoy-value" style={{ color: "var(--critical)" }}>
            {formatPct(currentYoY)}
          </div>
        </div>
      </div>
      <TrendChart values={values} months={labels} showTip={showTip} hideTip={hideTip} compact />
    </button>
  );
}
