"use client";

import type { MouseEvent } from "react";
import { fmtBHD, fmtNum, fmtPct, sum, rankedSegments, MONTHS, type Product } from "@/lib/data";
import { computeTrigger } from "@/lib/triggers";
import { PRODUCT_COMPETITOR_INTEL } from "@/lib/competitors";
import { BarList } from "@/components/BarList";
import { DeltaChip } from "@/components/DeltaChip";
import { TrendChart } from "@/components/TrendChart";
import { FlowChart } from "@/components/FlowChart";
import { DestCard } from "@/components/DestCard";
import { CompetitorStanding } from "@/components/CompetitorStanding";
import { ActionPlanForecast } from "@/components/ActionPlanForecast";

export function ProductDetail({
  product,
  showTip,
  hideTip,
  onBack,
  onOpenDest,
  onOpenDeepDive,
}: {
  product: Product;
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  onBack: () => void;
  onOpenDest: () => void;
  onOpenDeepDive: (productId: string) => void;
}) {
  const avgBalance = (product.balance * 1_000_000) / product.customers;

  const segEntries = rankedSegments(product);
  const best = segEntries.slice(0, 2);
  const opportunity = [...segEntries].slice(-2).reverse();

  const trigger = computeTrigger(product.id);

  const inRanked = [...product.channels.inflow].sort((a, b) => b.value - a.value);
  const outRanked = [...product.channels.outflow].sort((a, b) => b.value - a.value);
  const oppIdx = outRanked.length - 1;
  const oppIdx2 = outRanked.length - 2;

  const netTotal = sum(product.flow.inflow) - sum(product.flow.outflow);

  return (
    <section className="view is-visible">
      <button className="back-link" onClick={onBack}>
        &larr; Portfolio Overview
      </button>

      {trigger?.flagged && (
        <div className="attention-banner">
          <span className="msg">
            <span className="flag-dot" />
            Down {fmtPct(trigger.currentYoY)} vs. the same quarter last year, after growing {fmtPct(trigger.priorYoY)}
            the year before — this needs attention.
          </span>
          <button onClick={() => onOpenDeepDive(product.id)}>View deep dive</button>
        </div>
      )}

      <div className="card">
        <div className="product-card-top" style={{ marginBottom: 10 }}>
          <div className="mono-badge" style={{ width: 48, height: 48, fontSize: ".95rem" }}>
            {product.mono}
          </div>
          <div>
            <h2 style={{ fontSize: "1.15rem" }}>{product.name}</h2>
            <div className="tagline">{product.tagline}</div>
          </div>
        </div>
        <p style={{ color: "var(--ink-2)", fontSize: ".9rem", maxWidth: "70ch", marginBottom: 12 }}>
          {product.description}
        </p>
        <div className="tag-row">
          {product.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi-tile">
          <div className="eyebrow">Customers using product</div>
          <div className="kpi-value tabular">{fmtNum(product.customers)}</div>
        </div>
        <div className="kpi-tile">
          <div className="eyebrow">Total balance held</div>
          <div className="kpi-value tabular">{fmtBHD(product.balance)}</div>
        </div>
        <div className="kpi-tile">
          <div className="eyebrow">Growth (period on period)</div>
          <div className="kpi-value tabular">{fmtPct(product.growth)}</div>
          <DeltaChip pct={product.growth} />
        </div>
        <div className="kpi-tile">
          <div className="eyebrow">Avg. balance / customer</div>
          <div className="kpi-value tabular">BHD {Math.round(avgBalance).toLocaleString("en-US")}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="section">
          <div className="section-head">
            <h2 className="section-title">Balance trend</h2>
            <span className="section-note">Last 6 months, BHD millions</span>
          </div>
          <div className="card trend-wrap">
            <TrendChart values={product.trend} months={MONTHS} showTip={showTip} hideTip={hideTip} />
          </div>
        </div>
        <div className="section">
          <div className="section-head">
            <h2 className="section-title">Monthly inflow vs. outflow</h2>
            <span className="section-note">BHD millions, by month</span>
          </div>
          <div className="card trend-wrap">
            <FlowChart months={MONTHS} inflow={product.flow.inflow} outflow={product.flow.outflow} showTip={showTip} hideTip={hideTip} />
            <div className="chart-legend">
              <span className="item">
                <span className="swatch" style={{ background: "var(--flow-in)" }} />
                Inflow
              </span>
              <span className="item">
                <span className="swatch" style={{ background: "var(--flow-out)" }} />
                Outflow
              </span>
              <span className="item">
                Net (6mo):{" "}
                <b style={{ color: netTotal >= 0 ? "var(--good)" : "var(--critical)" }}>
                  {netTotal >= 0 ? "+" : "-"}
                  {fmtBHD(Math.abs(netTotal))}
                </b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Segment performance</h2>
          <span className="section-note">Share of this product&apos;s total balance, by customer segment</span>
        </div>
        <div className="card">
          <BarList
            items={segEntries.map((s) => ({
              label: s.meta.label,
              value: s.value,
              valueLabel: `${s.value}%`,
              color: s.meta.color,
            }))}
            showTip={showTip}
            hideTip={hideTip}
          />
        </div>
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

      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Channels</h2>
          <span className="section-note">Average monthly volume, BHD millions</span>
        </div>
        <div className="grid-2 equal">
          <div className="card">
            <div className="section-head" style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: ".86rem" }}>Best channels for inflows</h3>
            </div>
            <BarList
              items={inRanked.map((c, i) => ({
                label: c.name,
                value: c.value,
                valueLabel: fmtBHD(c.value),
                color: "var(--flow-in)",
                badge:
                  i === 0 ? (
                    <span className="badge good">
                      <span className="dot" />
                      Top channel
                    </span>
                  ) : undefined,
              }))}
              showTip={showTip}
              hideTip={hideTip}
            />
          </div>
          <div className="card">
            <div className="section-head" style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: ".86rem" }}>Channels with opportunity for outflows</h3>
            </div>
            <BarList
              items={outRanked.map((c, i) => ({
                label: c.name,
                value: c.value,
                valueLabel: fmtBHD(c.value),
                color: "var(--flow-out)",
                badge:
                  i === oppIdx || i === oppIdx2 ? (
                    <span className="badge opportunity">
                      <span className="dot" />
                      Opportunity
                    </span>
                  ) : undefined,
              }))}
              showTip={showTip}
              hideTip={hideTip}
            />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Funds tracker</h2>
          <span className="section-note">Inflows and outflows for {product.name}, and where every outflow BHD ends up</span>
        </div>
        <DestCard products={[product]} label={product.name} onOpen={onOpenDest} />
      </div>

      {(() => {
        const intel = PRODUCT_COMPETITOR_INTEL[product.id];
        if (!intel) return null;
        return (
          <>
            <div className="section">
              <div className="section-head">
                <h2 className="section-title">Where BisB stands vs. competitors</h2>
                <span className="section-note">Figures below are specific to {product.name} only</span>
              </div>
              <CompetitorStanding intel={intel} showTip={showTip} hideTip={hideTip} />
            </div>

            <div className="section">
              <div className="section-head">
                <h2 className="section-title">Action plan</h2>
                <span className="section-note">Check the actions you&apos;d run for {product.name} — the panel recomputes the forecast live</span>
              </div>
              <ActionPlanForecast product={product} trigger={trigger} actionPlan={intel.actionPlan} />
            </div>
          </>
        );
      })()}
    </section>
  );
}
