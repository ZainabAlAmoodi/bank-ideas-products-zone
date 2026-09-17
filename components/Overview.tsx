"use client";

import type { MouseEvent } from "react";
import { fmtBHD, fmtNum, fmtPct, sum, type Product } from "@/lib/data";
import { PRODUCT_HISTORY } from "@/lib/history";
import { getFlaggedProducts } from "@/lib/triggers";
import { BarList } from "@/components/BarList";
import { DeltaChip } from "@/components/DeltaChip";
import { DestCard } from "@/components/DestCard";
import { ProductCard } from "@/components/ProductCard";
import { TrendChart } from "@/components/TrendChart";
import { KpiTile } from "@/components/KpiTile";
import { NeedsAttention } from "@/components/NeedsAttention";

export function Overview({
  products,
  showTip,
  hideTip,
  onOpenProduct,
  onOpenDest,
  onOpenDeepDive,
}: {
  products: Product[];
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  onOpenProduct: (id: string) => void;
  onOpenDest: () => void;
  onOpenDeepDive: (productId: string) => void;
}) {
  const totalCustomers = sum(products.map((p) => p.customers));
  const totalBalance = sum(products.map((p) => p.balance));
  const blendedGrowth = sum(products.map((p) => p.growth * p.balance)) / totalBalance;
  const ranked = [...products].sort((a, b) => b.balance - a.balance);
  const flagged = getFlaggedProducts(products);

  // 3-year quarterly aggregates, for the KPI hover popovers.
  const quarters = PRODUCT_HISTORY[products[0]?.id ?? ""] ?? [];
  const quarterLabels = quarters.map((q) => q.label);
  const aggBalance = quarters.map((_, i) => sum(products.map((p) => PRODUCT_HISTORY[p.id]?.[i]?.balance ?? 0)));
  const aggCustomers = quarters.map((_, i) => sum(products.map((p) => PRODUCT_HISTORY[p.id]?.[i]?.customers ?? 0)));
  const growthSeries = aggBalance.slice(1).map((v, i) => ((v - aggBalance[i]) / (aggBalance[i] || 1)) * 100);
  const growthLabels = quarterLabels.slice(1);

  return (
    <section className="view is-visible">
      <h2 className="section-title" style={{ marginBottom: -6 }}>
        Overall snapshot
      </h2>

      <div className="kpi-row">
        <KpiTile
          eyebrow="Total customers"
          value={fmtNum(totalCustomers)}
          sub={<div className="kpi-sub">Across {products.length} account products</div>}
          popover={
            <>
              <div className="popover-title">Total customers &middot; last 3 years</div>
              <TrendChart
                values={aggCustomers}
                months={quarterLabels}
                showTip={showTip}
                hideTip={hideTip}
                height={130}
                valueLabel="customers"
                formatValue={fmtNum}
              />
            </>
          }
        />
        <KpiTile
          eyebrow="Total balance held"
          value={fmtBHD(totalBalance)}
          sub={<div className="kpi-sub">Sum of all product balances</div>}
          popover={
            <>
              <div className="popover-title">Total balance held &middot; last 3 years</div>
              <TrendChart values={aggBalance} months={quarterLabels} showTip={showTip} hideTip={hideTip} height={130} valueLabel="balance" />
            </>
          }
        />
        <KpiTile
          eyebrow="Blended growth"
          value={fmtPct(blendedGrowth)}
          sub={<DeltaChip pct={blendedGrowth} />}
          popover={
            <>
              <div className="popover-title">Blended growth, quarter over quarter &middot; last 3 years</div>
              <TrendChart
                values={growthSeries}
                months={growthLabels}
                showTip={showTip}
                hideTip={hideTip}
                height={130}
                valueLabel="growth"
                formatValue={fmtPct}
              />
            </>
          }
        />
        <KpiTile
          eyebrow="Products tracked"
          value={products.length}
          sub={<div className="kpi-sub">Accounts only</div>}
          align="right"
          popover={
            <>
              <div className="popover-title">Balance by product</div>
              <BarList
                items={ranked.map((p) => ({
                  label: p.name,
                  value: p.balance,
                  valueLabel: fmtBHD(p.balance),
                  color: "var(--accent)",
                }))}
                showTip={showTip}
                hideTip={hideTip}
                onItemClick={(idx) => onOpenProduct(ranked[idx].id)}
              />
            </>
          }
        />
      </div>

      <NeedsAttention flagged={flagged} totalProducts={products.length} showTip={showTip} hideTip={hideTip} onOpenDeepDive={onOpenDeepDive} />

      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Funds tracker</h2>
          <span className="section-note">Bank-wide inflows and outflows, and where every outflow BHD ends up</span>
        </div>
        <DestCard products={products} label="All products" onOpen={onOpenDest} />
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Products</h2>
          <span className="section-note">Click any product to see its full performance breakdown.</span>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={() => onOpenProduct(p.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
