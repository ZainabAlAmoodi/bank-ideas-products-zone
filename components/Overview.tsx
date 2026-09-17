"use client";

import type { MouseEvent } from "react";
import { fmtBHD, fmtNum, fmtPct, sum, MONTHS, type Product } from "@/lib/data";
import { BarList } from "@/components/BarList";
import { DeltaChip } from "@/components/DeltaChip";
import { DestCard } from "@/components/DestCard";
import { ProductCard } from "@/components/ProductCard";
import { TrendChart } from "@/components/TrendChart";

export function Overview({
  products,
  showTip,
  hideTip,
  onOpenProduct,
  onOpenDest,
}: {
  products: Product[];
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  onOpenProduct: (id: string) => void;
  onOpenDest: () => void;
}) {
  const totalCustomers = sum(products.map((p) => p.customers));
  const totalBalance = sum(products.map((p) => p.balance));
  const blendedGrowth = sum(products.map((p) => p.growth * p.balance)) / totalBalance;
  const ranked = [...products].sort((a, b) => b.balance - a.balance);

  const monthCount = Math.max(...products.map((p) => p.trend.length), MONTHS.length);
  const months = MONTHS.slice(-monthCount);
  const portfolioTrend = Array.from({ length: monthCount }, (_, i) => sum(products.map((p) => p.trend[i] ?? 0)));

  return (
    <section className="view is-visible">
      <div className="kpi-row">
        <div className="kpi-tile">
          <div className="eyebrow">Total customers</div>
          <div className="kpi-value tabular">{fmtNum(totalCustomers)}</div>
          <div className="kpi-sub">Across {products.length} account products</div>
        </div>
        <div className="kpi-tile">
          <div className="eyebrow">Total balance held</div>
          <div className="kpi-value tabular">{fmtBHD(totalBalance)}</div>
          <div className="kpi-sub">Sum of all product balances</div>
        </div>
        <div className="kpi-tile">
          <div className="eyebrow">Blended growth</div>
          <div className="kpi-value tabular">{fmtPct(blendedGrowth)}</div>
          <DeltaChip pct={blendedGrowth} />
        </div>
        <div className="kpi-tile">
          <div className="eyebrow">Products tracked</div>
          <div className="kpi-value tabular">{products.length}</div>
          <div className="kpi-sub">Accounts only</div>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Total balance trend</h2>
          <span className="section-note">Sum of every product&apos;s balance, last {monthCount} months</span>
        </div>
        <div className="card trend-wrap">
          <TrendChart values={portfolioTrend} months={months} showTip={showTip} hideTip={hideTip} height={140} />
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Balance trend by product</h2>
          <span className="section-note">Same {monthCount}-month window, side by side. Click a card to open that product.</span>
        </div>
        <div className="trend-grid">
          {products.map((p) => (
            <button key={p.id} className="trend-mini" onClick={() => onOpenProduct(p.id)}>
              <div className="trend-mini-head">
                <span className="name">{p.name}</span>
                <DeltaChip pct={p.growth} />
              </div>
              <div className="trend-mini-value tabular">{fmtBHD(p.balance)}</div>
              <TrendChart values={p.trend} months={MONTHS} showTip={showTip} hideTip={hideTip} compact />
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Balance by product</h2>
          <span className="section-note">Total balance held, ranked. Click a bar to open its detail view.</span>
        </div>
        <div className="card">
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
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Where outflow money goes</h2>
          <span className="section-note">Bank-wide: internal transfers vs. cash withdrawals vs. digital withdrawals</span>
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
