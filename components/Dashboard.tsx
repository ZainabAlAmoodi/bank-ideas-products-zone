"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import type { ProductsSource } from "@/lib/queries";
import { useTooltip } from "@/lib/useTooltip";
import { Sidebar } from "@/components/Sidebar";
import { Overview } from "@/components/Overview";
import { ProductDetail } from "@/components/ProductDetail";
import { DestModal, type DestTarget } from "@/components/DestModal";
import { DeepDiveModal } from "@/components/DeepDiveModal";
import { Tooltip } from "@/components/Tooltip";

export function Dashboard({ products, dataSource }: { products: Product[]; dataSource: ProductsSource }) {
  const [view, setView] = useState<string>("overview");
  const [destTarget, setDestTarget] = useState<DestTarget | null>(null);
  const [deepDiveProductId, setDeepDiveProductId] = useState<string | null>(null);
  const { tip, showTip, hideTip } = useTooltip();

  const activeProduct: Product | null = view === "overview" ? null : products.find((p) => p.id === view) ?? null;

  return (
    <div className="app-shell">
      <Sidebar products={products} view={view} onNavigate={setView} />

      <main className="main">
        <div className="main-header">
          <div>
            <h1 className="main-title">{activeProduct ? activeProduct.name : "Portfolio Overview"}</h1>
            <p className="main-tagline">
              {activeProduct
                ? activeProduct.tagline
                : "All account products at a glance — balances, growth, and where each one stands."}
            </p>
          </div>
          <div className="period-pill">
            Snapshot: <b>Q3 2026</b> &middot; {dataSource === "supabase" ? "live from Supabase" : "sample data"}
          </div>
        </div>

        {activeProduct ? (
          <ProductDetail
            product={activeProduct}
            showTip={showTip}
            hideTip={hideTip}
            onBack={() => setView("overview")}
            onOpenDest={() => setDestTarget({ products: [activeProduct], label: activeProduct.name })}
            onOpenDeepDive={setDeepDiveProductId}
          />
        ) : (
          <Overview
            products={products}
            showTip={showTip}
            hideTip={hideTip}
            onOpenProduct={setView}
            onOpenDest={() => setDestTarget({ products, label: "All products" })}
            onOpenDeepDive={setDeepDiveProductId}
          />
        )}
      </main>

      <DestModal target={destTarget} showTip={showTip} hideTip={hideTip} onClose={() => setDestTarget(null)} />
      <DeepDiveModal
        products={products}
        productId={deepDiveProductId}
        showTip={showTip}
        hideTip={hideTip}
        onClose={() => setDeepDiveProductId(null)}
      />
      <Tooltip tip={tip} />
    </div>
  );
}
