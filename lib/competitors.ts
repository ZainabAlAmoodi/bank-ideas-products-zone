// Competitive intelligence for the deep-dive view and each product's own tab.
// Two distinct kinds of data live here, and they should never be confused:
//
// - `marketShare` figures are ILLUSTRATIVE ESTIMATES for this prototype. CBB
//   publishes sector-wide statistics, not per-bank-per-product breakdowns, so
//   there is no public source for "BisB vs. Al Salam Bank Tejoori share" —
//   every UI surface showing these numbers must label them as such.
// - `campaigns` are REAL, current, and sourced (checked 2026-09-17) — each
//   entry links to where it came from. `recency` is a curated tag, not a live
//   feed — there is no way to reliably scan a bank's social pages in real
//   time, so this is a refreshable research snapshot grouped like one.
// - `actionPlan` items carry an illustrative `impactPct` so the deep-dive can
//   show a combined forecast when the user selects a subset of them — a
//   simple additive model, not a rigorous prediction, and labeled as such.

export interface CompetitorBank {
  id: "alsalam" | "nbb" | "ila";
  name: string;
  short: string;
  color: string; // CSS var, fixed brand color per bank — not theme-dependent
  logo: string; // path under /public — the bank's real, current logo
}

export const COMPETITORS: CompetitorBank[] = [
  { id: "alsalam", name: "Al Salam Bank", short: "Al Salam", color: "var(--bank-alsalam)", logo: "/logos/alsalam.png" },
  { id: "nbb", name: "National Bank of Bahrain", short: "NBB", color: "var(--bank-nbb)", logo: "/logos/nbb.svg" },
  { id: "ila", name: "ila Bank", short: "ila", color: "var(--bank-ila)", logo: "/logos/ila.png" },
];

export interface MarketShareEntry {
  bankId: "bisb" | CompetitorBank["id"];
  label: string;
  sharePct: number;
  color: string;
  /** The competitor's actual named product in this category, shown next to their logo — omitted where no specific real product is known. */
  productName?: string;
}

export type Recency = "this-week" | "this-month" | "ongoing";

export interface Campaign {
  bankId: CompetitorBank["id"];
  title: string;
  description: string;
  date: string;
  recency: Recency;
  source: string;
}

// BisB's own recent activity in this category — real and sourced, same as
// `campaigns`, just without a `bankId` since it's always BisB.
export interface BisbCampaign {
  title: string;
  description: string;
  date: string;
  recency: Recency;
  source: string;
}

export interface ActionItem {
  id: string;
  text: string;
  impactPct: number; // illustrative uplift to next comparable quarter's balance, percentage points
  rationale: string; // shown in the forecast tooltip when this item is selected
}

export interface CompetitorIntel {
  category: string;
  marketShare: MarketShareEntry[]; // illustrative estimate, sums to ~100
  bisbCampaigns: BisbCampaign[]; // what BisB itself has been doing — real, sourced
  campaigns: Campaign[]; // what other banks have been doing — real, sourced
  actionPlan: ActionItem[];
}

const RECENCY_LABEL: Record<Recency, string> = {
  "this-week": "This week",
  "this-month": "This month",
  ongoing: "Ongoing",
};

export function recencyLabel(r: Recency): string {
  return RECENCY_LABEL[r];
}

function shares(
  bisb: { pct: number; label: string },
  alsalam: { pct: number; product?: string },
  nbb: { pct: number; product?: string },
  ila: { pct: number; product?: string }
): MarketShareEntry[] {
  return [
    { bankId: "bisb", label: bisb.label, sharePct: bisb.pct, color: "var(--bisb-self)" },
    { bankId: "alsalam", label: "Al Salam Bank", sharePct: alsalam.pct, color: "var(--bank-alsalam)", productName: alsalam.product },
    { bankId: "nbb", label: "NBB", sharePct: nbb.pct, color: "var(--bank-nbb)", productName: nbb.product },
    { bankId: "ila", label: "ila Bank", sharePct: ila.pct, color: "var(--bank-ila)", productName: ila.product },
  ];
}

export const PRODUCT_COMPETITOR_INTEL: Record<string, CompetitorIntel> = {
  "tejoori-al-islami": {
    category: "Prize-linked savings",
    marketShare: shares(
      { pct: 22, label: "BisB — Tejoori Al Islami" },
      { pct: 31, product: "Danat 2026" },
      { pct: 34, product: "Thara'a Prize Account" },
      { pct: 13 }
    ),
    bisbCampaigns: [
      {
        title: "Tejoori Al Islami 2026 — more categories, more ways to win",
        description:
          "USD 1M annual grand prize, 3 quarterly USD 200k prizes, and 8 monthly USD 50k prizes, plus new categories: Tejoori Premium, Tejoori for Her (with Mattar Jewellery), Tejoori Youth, Tejoori SME, Tejoori First Time Winner, and Tejoori GCC for digital account openings.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.bisb.com/en/tejoori-al-islami-2026-offers-more-categories-and-more-ways-win-usd1-million-grand-prize",
      },
      {
        title: "“You Deserve More” salary-link campaign",
        description: "Customers linking their salary account to Tejoori Al Islami were entered to win an extra month's salary (up to BD 1,500), across 3 winners.",
        date: "1 May – 30 Jun 2026",
        recency: "ongoing",
        source: "https://www.newsofbahrain.com/business/132022.html",
      },
      {
        title: "Badriya Jaafar wins USD 200,000",
        description: "Latest quarterly grand-prize winner announced under the 2026 scheme — the draw cadence is active and being actively promoted.",
        date: "2026",
        recency: "this-month",
        source: "https://www.bisb.com/en/badriya-jaafar-wins-usd-200000-bisbs-tejoori-al-islami-draw",
      },
    ],
    campaigns: [
      {
        bankId: "nbb",
        title: "“Race from Bahrain to Malaysia”",
        description:
          "Chance to attend the F1 Gulf Air Bahrain Grand Prix at Sepang, incl. return airfare for two and a 5-star stay; opt in via the NBB Points App, earned through Mastercard credit/prepaid spend.",
        date: "runs until 20 Sep 2026",
        recency: "this-week",
        source: "https://www.bizbahrain.com/nbb-launches-race-from-bahrain-to-malaysia-campaign-offering-a-chance-to-win-a-travel-package-for-two/",
      },
      {
        bankId: "alsalam",
        title: "Danat 2026 — “Designed by You”",
        description:
          "Four BD 1,000,000 grand prizes with customers voting on how they're distributed; 1 entry per BD 5 saved, plus a dedicated youth prize track.",
        date: "2026",
        recency: "ongoing",
        source:
          "https://www.alsalambank.com/en/al-salam-bank-engages-clients-in-designing-the-danat-2026-scheme-and-offers-4-grand-prizes-of-bd-1-million-each-2/",
      },
      {
        bankId: "nbb",
        title: "Thara'a Prize Account 2026",
        description:
          "USD 6M prize pool including seafront villas at Diyar Al Muharraq; every BHD 50 saved = 1 entry, with 3/6-month balances doubling or tripling chances.",
        date: "Mar 2026 – Apr 2027",
        recency: "ongoing",
        source: "https://www.newsofbahrain.com/business/126832.html",
      },
      {
        bankId: "alsalam",
        title: "20th anniversary youth campaign",
        description:
          "Customers born in 2006 (turning 20 this year) get instant prizes via a digital game — cash, laptops, Apple Watches, and an iPhone 17 Pro.",
        date: "2026, 20th-anniversary tie-in",
        recency: "this-month",
        source: "https://www.newsofbahrain.com/business/127055.html",
      },
      {
        bankId: "alsalam",
        title: "New Financing Settlement Campaign",
        description:
          "Monthly draw automatically entering eligible clients to win a full settlement of their existing financing, plus smaller 3-installment-settlement prizes, running through 2026.",
        date: "2026, monthly draws",
        recency: "ongoing",
        source: "https://www.newsofbahrain.com/bahrain/126113.html",
      },
    ],
    actionPlan: [
      {
        id: "tai-q4-booster",
        text: "Launch a Q4 booster round for Tejoori Al Islami ahead of Al Salam's Danat 2026 and NBB's Thara'a — both refreshed their flagship prize pools this year while BisB's has stayed flat.",
        impactPct: 1.5,
        rationale:
          "Historically, BisB's own Q4 draw refreshes have coincided with a quarter-over-quarter balance uptick (visible in the 2024 and 2025 Q4 points) — modeled here as a partial, one-quarter recovery.",
      },
      {
        id: "tai-youth-track",
        text: "Defend the Youth segment specifically: Danat 2026 ships a dedicated youth prize track (1 entry per BD 5) — match or beat it, since Youth is already BisB's single largest Tejoori segment.",
        impactPct: 1.0,
        rationale:
          "Youth already holds the largest share of this product's balance; a targeted counter-offer defends the segment most exposed to Al Salam's youth-specific mechanic rather than spreading spend thinly across all segments.",
      },
      {
        id: "tai-cross-sell",
        text: "SMEs and Top Executives are under-represented in Tejoori Al Islami — bundle a Tejoori entry perk into BisB Premium / Saver relationship touchpoints to cross-sell rather than competing purely on prize size.",
        impactPct: 0.7,
        rationale:
          "Cross-sell uplift is modeled conservatively since it draws on already-engaged BisB Premium/Saver customers rather than acquiring new balance — a slower but lower-cost lever than a prize-pool increase.",
      },
      {
        id: "tai-loyalty-tiers",
        text: "Track NBB's tiered “3/6-month balance = double/triple entries” mechanic — it's a lock-in incentive BisB's scheme doesn't currently have.",
        impactPct: 0.4,
        rationale:
          "A retention-tier mechanic mainly slows outflow rather than driving new inflow, so it's modeled as the smallest single contributor — but it compounds well with the other three actions.",
      },
    ],
  },
  "current-savings": {
    category: "Everyday current & savings",
    marketShare: shares(
      { pct: 26, label: "BisB — Current & Savings" },
      { pct: 21, product: "Card spend offers" },
      { pct: 24, product: "Multi-Currency Debit Card" },
      { pct: 29, product: "ila Account" }
    ),
    bisbCampaigns: [
      {
        title: "Bonus Points Campaign 2026 (The Outlet)",
        description: "Card-spend bonus points promotion tied to The Outlet 2026, rewarding everyday card usage.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.bisb.com/en/bonus-points-campaign-tc",
      },
      {
        title: "Jewelry Promotion Campaign",
        description: "Card-linked promotional discounts on jewelry purchases for BisB cardholders.",
        date: "2026",
        recency: "ongoing",
        source: "https://bisb.com/en/jewelry-promotion-campaign",
      },
    ],
    campaigns: [
      {
        bankId: "ila",
        title: "Batelco 0% instalments",
        description:
          "ila credit cardholders can convert Batelco device purchases of BHD 300+ into 0% instalments for up to 24 months, managed end-to-end in the ila app.",
        date: "10 Sep 2026",
        recency: "this-week",
        source: "https://techafricanews.com/2026/09/10/batelco-and-ila-bank-offer-0-instalment-plans-on-device-purchases-in-bahrain/",
      },
      {
        bankId: "nbb",
        title: "Multi-Currency Debit Card raffle",
        description:
          "Every BHD 100 spent internationally on the new multi-currency debit card = 1 raffle entry for a round-the-world travel package (entries double past BHD 1,000 spend).",
        date: "1 Sep – 30 Nov 2026",
        recency: "this-month",
        source: "https://www.gdnonline.com/Details/1405075/NBB-multi-currency-card-offers-chance-to-win-luxury-travel",
      },
      {
        bankId: "nbb",
        title: "Summer Cashback Campaign",
        description: "Up to 5% cashback on overseas card spend, plus an exclusive travel-voucher raffle.",
        date: "ended 15 Sep 2026",
        recency: "this-month",
        source: "https://www.newsofbahrain.com/business/135507.html",
      },
      {
        bankId: "ila",
        title: "AliExpress instant cashback",
        description: "USD 20 off USD 80+ spend on ila debit/credit/prepaid cards — an everyday digital-spend partnership.",
        date: "ended 11 Jul 2026",
        recency: "ongoing",
        source: "https://ilabank.com/news/ila-Bank-launches-exclusive-AliExpress-offer-with-instant-savings",
      },
      {
        bankId: "nbb",
        title: "Use Our App & Win",
        description: "Cash prizes across 12 monthly winners for using the NBB app — driving everyday-account digital engagement.",
        date: "1 Aug – 31 Dec 2026",
        recency: "ongoing",
        source: "https://www.newsofbahrain.com/business/139764.html",
      },
      {
        bankId: "alsalam",
        title: "Card spend discounts",
        description: "3% off devices and 5% off accessories when paying with an Al Salam Bank card, with instalments up to 24 months.",
        date: "ongoing",
        recency: "ongoing",
        source: "https://www.alsalambank.com/en/special-offers/",
      },
    ],
    actionPlan: [
      {
        id: "cs-card-partnership",
        text: "Counter ila Bank's Batelco/AliExpress-style instalment and cashback partnerships with a comparable everyday-spend partnership on BisB card products — ila is running two of these at once.",
        impactPct: 0.6,
        rationale:
          "Modeled on the scale of BisB's own historical card-spend promos, which move the everyday-account balance modestly but reliably within a quarter.",
      },
      {
        id: "cs-app-draw",
        text: "Mirror NBB's “Use Our App & Win” mechanic with a lightweight monthly draw for BisB Mobile App activity — a low-cost way to defend everyday-account share without a prize-pool arms race.",
        impactPct: 0.5,
        rationale:
          "Low-cost engagement mechanics tend to slow attrition more than they drive new inflow, so this is modeled as a moderate, retention-weighted contribution.",
      },
      {
        id: "cs-segment-focus",
        text: "Youth and Female Workforce are already BisB's strongest Current & Savings segments — protect them first with a targeted digital-engagement push before addressing SMEs / Top Executives, the smaller opportunity segments.",
        impactPct: 0.3,
        rationale:
          "Defending an already-strong segment has a smaller marginal effect than winning back a declining one, but it's the lowest-risk of the four actions.",
      },
      {
        id: "cs-seasonal-cadence",
        text: "Monitor NBB's recurring seasonal-cashback cadence (just wrapped 15 Sep) and time a BisB counter-offer for the next gap in their calendar rather than competing head-on.",
        impactPct: 0.3,
        rationale:
          "Timing around a competitor's seasonal gap is modeled conservatively — the benefit depends on execution timing more than on the offer itself.",
      },
    ],
  },
  "tejoori-premium": {
    category: "Premium investment deposit",
    marketShare: shares(
      { pct: 28, label: "BisB — Tejoori Premium" },
      { pct: 29, product: "Wakala Account" },
      { pct: 24 },
      { pct: 19 }
    ),
    bisbCampaigns: [
      {
        title: "Tejoori Premium & Premium Lite launch",
        description: "Two-tier investment product (BD 50,000 / BD 75,000 minimum), paying profit in advance with medical cover and Tejoori Al Islami draw eligibility.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.bisb.com/en/bisb-unveils-tejoori-premium-investment-product-exclusive-benefits-and-rewards",
      },
      {
        title: "“Most Innovative Islamic Bank in Bahrain” — Tejoori Premium",
        description: "Industry recognition specifically for the Tejoori Premium product.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.newsofbahrain.com/business/119634.html",
      },
      {
        title: "Tejoori Premium prize category (USD 10,000 monthly)",
        description: "Within the 2026 Tejoori Al Islami scheme, Tejoori Premium customers get their own monthly USD 10,000 winner category.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.bisb.com/en/gcc-and-tejoori-al-islami",
      },
    ],
    campaigns: [
      {
        bankId: "alsalam",
        title: "Exclusive Wakala investment campaign (mobile app)",
        description: "A Wakala investment offer available exclusively through Al Salam's mobile app, pushing HNW-style investing toward a self-serve digital flow.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.alsalambank.com/en/al-salam-bank-launches-exclusive-wakala-investment-campaign-through-its-mobile-app/",
      },
      {
        bankId: "alsalam",
        title: "Wealth Management diversified offerings",
        description: "A broadened Wealth Management proposition for HNW/UHNW clients — regional and global investment access as a one-stop shop.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.newsofbahrain.com/business/136747.html",
      },
    ],
    actionPlan: [
      {
        id: "tp-mobile-wakala",
        text: "Promote a mobile-first Wakala investment option, mirroring Al Salam's in-app campaign, to keep BisB's fast-growing Premium base engaged digitally rather than only through branch/RM channels.",
        impactPct: 0.8,
        rationale: "Tejoori Premium is already growing quickly; this targets channel mix (digital vs. branch) rather than trying to accelerate an already-healthy trend further.",
      },
      {
        id: "tp-stepping-stone",
        text: "SMEs and Youth are Tejoori Premium's smallest segments (3% each) — a lower-minimum 'stepping stone' tier bridging from Tejoori Saver could convert already-engaged Saver customers upward.",
        impactPct: 0.6,
        rationale: "Modeled conservatively since it depends on cross-product migration from Tejoori Saver rather than new external balance.",
      },
      {
        id: "tp-wealth-benchmark",
        text: "Benchmark against Al Salam's newly-launched Wealth Management diversified offerings — BisB Premium customers approaching Tejoori Premium's minimum tier are a natural cross-sell audience for a comparable diversified-investment angle.",
        impactPct: 0.5,
        rationale: "A longer-lead cross-sell initiative; effect is modeled as the smallest of the three given the multi-quarter sales cycle typical of wealth products.",
      },
    ],
  },
  "tejoori-saver": {
    category: "SME & entrepreneur savings",
    marketShare: shares(
      { pct: 24, label: "BisB — Tejoori Saver" },
      { pct: 33, product: "MSME Services" },
      { pct: 28, product: "SME Service Points" },
      { pct: 15 }
    ),
    bisbCampaigns: [
      {
        title: "Tejoori Saver & Saver Lite expansion",
        description: "Lower-minimum extension of Tejoori Premium aimed at individual savers, SME owners and entrepreneurs seeking stable returns.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.bisb.com/en/offering-competitive-returns-and-profits-savings-benefits-bisb-expands-tejoori-premium-investment",
      },
      {
        title: "Tejoori SME prize category",
        description: "A dedicated SME category within the 2026 Tejoori Al Islami draw, for customers with an active business account.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.bisb.com/en/gcc-and-tejoori-al-islami",
      },
    ],
    campaigns: [
      {
        bankId: "nbb",
        title: "Dedicated SME service points",
        description: "In-branch SME service points rolled out across 6 flagship branches, offering POS, FX, card and trade services tailored to entrepreneurs.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.newsofbahrain.com/bahrain/125973.html",
      },
      {
        bankId: "nbb",
        title: "National SME Fund partner bank",
        description: "NBB is a named partner (with BDB, BBK and Al Salam Bank, backed by Tamkeen) in a USD 185M national SME Fund.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.bahrainthisweek.com/sme-fund-lauded-as-key-enabler-of-bahrains-private-sector-growth-and-diversification/",
      },
      {
        bankId: "alsalam",
        title: "MSME bespoke services",
        description: "Bespoke MSME services built with fintech/ERP partners (Solidarity, STC, ASB Pay Odoo, Grant Thornton, Ottu).",
        date: "ongoing",
        recency: "ongoing",
        source: "https://www.alsalambank.com/en/msme/",
      },
    ],
    actionPlan: [
      {
        id: "ts-service-points",
        text: "Match NBB's dedicated SME service points with a lightweight BisB equivalent (a named SME relationship contact per branch) — NBB has rolled this out at 6 flagship branches this year.",
        impactPct: 0.9,
        rationale: "Tejoori Saver's largest segment is already SMEs; a service-quality response defends BisB's strongest segment here directly.",
      },
      {
        id: "ts-sme-fund",
        text: "Explore joining or partnering alongside the national SME Fund (BDB + BBK + NBB + Al Salam + Tamkeen) — BisB is not currently named among its partner banks, a visible gap versus two direct competitors.",
        impactPct: 0.7,
        rationale: "A partnership-level move with reputational as well as balance-growth upside; modeled conservatively since it depends on external partner-fund terms.",
      },
      {
        id: "ts-segment-priority",
        text: "Top Executives and Retirees are Tejoori Saver's smallest segments — lower priority here, since the product's core market (SMEs, Resident Professionals) is already BisB's strongest showing bank-wide.",
        impactPct: 0.3,
        rationale: "Included for completeness; the modeled impact is small because it deliberately targets already-minor segments rather than the product's core base.",
      },
    ],
  },
  "investment-deposits": {
    category: "Wakala & Murabaha term deposits",
    marketShare: shares(
      { pct: 26, label: "BisB — Investment Deposits" },
      { pct: 30, product: "Wakala Account" },
      { pct: 25 },
      { pct: 19 }
    ),
    bisbCampaigns: [
      {
        title: "Tejoori Premium & Premium Lite launch",
        description: "The same Wakala-style investment product also competes for term-deposit balance, not just Premium-tier customers.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.bisb.com/en/bisb-unveils-tejoori-premium-investment-product-exclusive-benefits-and-rewards",
      },
    ],
    campaigns: [
      {
        bankId: "alsalam",
        title: "Wakala preferential-rate campaign",
        description: "Wakala Account customers get highly preferential expected profit rates for a limited period, with a chance to triple expected profits.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.alsalambank.com/en/al-salam-banks-wakala-account-customers-enjoy-special-preferential-rates-for-limited-period-alongside-chance-to-triple-their-expected-profits/",
      },
      {
        bankId: "alsalam",
        title: "Exclusive Wakala investment campaign (mobile app)",
        description: "The same in-app Wakala campaign competing for term-deposit-style balance, not just Premium-tier customers.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.alsalambank.com/en/al-salam-bank-launches-exclusive-wakala-investment-campaign-through-its-mobile-app/",
      },
    ],
    actionPlan: [
      {
        id: "id-rate-promo",
        text: "Counter Al Salam's preferential-rate Wakala campaign (triple expected profit for a limited period) with a comparable time-boxed rate promotion — Investment Deposits' decline has been narrowing, and a rate incentive could be enough to flip it to growth.",
        impactPct: 1.0,
        rationale: "This product's YoY decline is already moderating (-4.1% to -2.1%); a rate-based promo is modeled as the most direct lever to close the remaining gap.",
      },
      {
        id: "id-mobile-channel",
        text: "Mirror Al Salam's mobile-app Wakala campaign to reduce reliance on branch-driven inflows, currently this product's dominant channel.",
        impactPct: 0.6,
        rationale: "Branch Counter is this product's single largest inflow channel today — diversifying into a digital channel is modeled as a moderate, channel-mix-driven gain.",
      },
      {
        id: "id-segment-priority",
        text: "Youth and SMEs are structurally small here (2% and 5%) — not a priority; this product's real opportunity is defending Retirees and Top Executives, its two largest and most rate-sensitive segments.",
        impactPct: 0.4,
        rationale: "Retention-focused rather than acquisition-focused, so the modeled impact is smaller but more reliable than trying to grow a structurally minor segment.",
      },
    ],
  },
  "bisb-premium": {
    category: "Premium relationship banking",
    marketShare: shares(
      { pct: 25, label: "BisB — BisB Premium" },
      { pct: 32, product: "Private Banking" },
      { pct: 26 },
      { pct: 17, product: "ila Account" }
    ),
    bisbCampaigns: [
      {
        title: "“Best Islamic Bank in Bahrain” — Euromoney Islamic Finance Awards 2026",
        description: "Bank-wide recognition, a relevant credibility signal for BisB Premium's relationship-banking positioning.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.bahrainthisweek.com/bisb-wins-best-islamic-bank-in-bahrain-at-euromoney-awards-2026/",
      },
      {
        title: "“Most Innovative Islamic Bank in Bahrain” — Tejoori Premium",
        description: "Product-innovation recognition relevant to BisB's Premium/HNW positioning.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.newsofbahrain.com/business/119634.html",
      },
    ],
    campaigns: [
      {
        bankId: "alsalam",
        title: "Private Banking overview",
        description: "A full private-banking stack for HNW/UHNW clients: wealth management, multicurrency deposits, family trust & succession planning, brokerage/IPO and Sukuk services.",
        date: "ongoing",
        recency: "ongoing",
        source: "https://www.alsalambank.com/en/PrivateBanking/private-banking-overview",
      },
      {
        bankId: "nbb",
        title: "ESG & digital-lending recognition",
        description: "Recognized for embedding ESG into core banking activity and investing in digital lending (automated underwriting, digital signatures) through 2025–26.",
        date: "2026",
        recency: "ongoing",
        source: "https://www.euromoney.com/article/9ryp7sk7w944cc4kkksw8oskw/awards-for-excellence-national-winners-2026-bahrain/",
      },
      {
        bankId: "ila",
        title: "Bahrain's leading digital retail bank",
        description: "Recognized as Bahrain's leading digital retail bank in 2025 — a digital-first challenger to traditional relationship banking, even without a dedicated premium tier.",
        date: "2025–26",
        recency: "ongoing",
        source: "https://www.euromoney.com/article/9ryp7sk7w944cc4kkksw8oskw/awards-for-excellence-national-winners-2026-bahrain/",
      },
    ],
    actionPlan: [
      {
        id: "bp-private-banking",
        text: "Benchmark against Al Salam's Private Banking suite (family trust, succession planning, brokerage/IPO access) — BisB Premium's current lifestyle-privileges positioning is narrower than Al Salam's full wealth-management stack.",
        impactPct: 0.7,
        rationale: "A positioning/product-breadth response rather than a promotional one; modeled with a moderate, multi-quarter impact typical of proposition changes.",
      },
      {
        id: "bp-digital-experience",
        text: "ila Bank's recognition as Bahrain's leading digital retail bank is a reminder to keep BisB Premium's app experience competitive even though ila doesn't offer a comparable relationship-banking tier.",
        impactPct: 0.4,
        rationale: "Defensive rather than offensive — ila competes on a different axis (digital-only, no relationship tier), so the modeled impact is smaller and mostly about not losing ground.",
      },
      {
        id: "bp-segment-priority",
        text: "SMEs and Youth are BisB Premium's smallest segments — lower priority; Bahraini Male Professionals and Top Executives, its two largest, are where competitive defense matters most.",
        impactPct: 0.3,
        rationale: "Included for completeness; modeled impact is small because it targets already-minor segments rather than the product's core relationship-banking base.",
      },
    ],
  },
};
