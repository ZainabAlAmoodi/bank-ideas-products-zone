import type { MouseEvent, ReactNode } from "react";
import { COMPETITORS, recencyLabel, type BisbCampaign, type Campaign, type CompetitorIntel, type Recency } from "@/lib/competitors";
import { BarList } from "@/components/BarList";
import { BisbMark } from "@/components/BisbMark";

const RECENCY_ORDER: Recency[] = ["this-week", "this-month", "ongoing"];

// Market share + a two-way research split (what BisB is doing vs. what other
// banks are doing) for one product's competitor set. Shared by the deep-dive
// modal (flagged products) and every product's own tab (all products) —
// content only, no section-header/numbering markup, so each caller can wrap
// it to match its own surrounding layout.
export function CompetitorStanding({
  intel,
  showTip,
  hideTip,
}: {
  intel: CompetitorIntel;
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
}) {
  const groups = RECENCY_ORDER.map((r) => ({ recency: r, items: intel.campaigns.filter((c) => c.recency === r) })).filter(
    (g) => g.items.length > 0
  );

  return (
    <>
      <p className="story-step-sub">{intel.category} &mdash; estimated market share</p>
      <BarList
        items={intel.marketShare.map((m) => ({
          label: m.label,
          value: m.sharePct,
          valueLabel: `${m.sharePct}%`,
          color: m.color,
          logoSrc: m.bankId === "bisb" ? undefined : COMPETITORS.find((b) => b.id === m.bankId)?.logo,
          productName: m.productName,
        }))}
        showTip={showTip}
        hideTip={hideTip}
      />
      <p className="estimate-note">
        Illustrative estimate for this prototype &mdash; CBB publishes sector-wide statistics, not per-bank-per-product
        breakdowns, so this is not an official figure.
      </p>

      <div className="recency-group">
        <div className="recency-group-label">
          What BisB is doing
          <span className="rule" />
        </div>
        <div className="trend-grid">
          {intel.bisbCampaigns.map((c) => (
            <CampaignCard key={c.title} campaign={c} head={<BisbMark size={16} />} bankLabel="BisB" />
          ))}
        </div>
      </div>

      <div className="recency-group">
        <div className="recency-group-label">
          What other banks are doing
          <span className="rule" />
        </div>
        {groups.map(({ recency, items }) => (
          <div className="recency-group" key={recency}>
            <div className={`recency-group-label ${recency}`}>
              {recencyLabel(recency)}
              <span className="rule" />
            </div>
            <div className="trend-grid">
              {items.map((c) => {
                const bank = COMPETITORS.find((b) => b.id === c.bankId)!;
                return (
                  <CampaignCard
                    key={c.title}
                    campaign={c}
                    // eslint-disable-next-line @next/next/no-img-element
                    head={<img src={bank.logo} alt={bank.name} className="bank-logo" />}
                    bankLabel={bank.name}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CampaignCard({ campaign, head, bankLabel }: { campaign: Campaign | BisbCampaign; head: ReactNode; bankLabel: string }) {
  return (
    <div className="campaign-card" title={bankLabel}>
      <div className="campaign-card-head">
        {head}
        <span className="date">{campaign.date}</span>
      </div>
      <div className="campaign-title">{campaign.title}</div>
      <p className="campaign-desc">{campaign.description}</p>
      <a className="campaign-source" href={campaign.source} target="_blank" rel="noopener noreferrer">
        Source &rarr;
      </a>
    </div>
  );
}
