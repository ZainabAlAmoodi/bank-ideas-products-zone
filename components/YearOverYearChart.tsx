"use client";

import { useId, type MouseEvent } from "react";
import { fmtBHD } from "@/lib/data";
import type { QuarterPoint } from "@/lib/history";

const W = 520;
const PAD_L = 44;
const PAD_R = 14;
const PAD_T = 16;
const PAD_B = 30;
const QUARTERS = [1, 2, 3, 4] as const;

// One line per year (light -> bold, oldest -> current), plotted against a
// shared Q1-Q4 x-axis, so a same-quarter year-over-year comparison — the
// basis for the trigger system — is something you can actually see.
export function YearOverYearChart({
  history,
  showTip,
  hideTip,
  height = 220,
}: {
  history: QuarterPoint[];
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  height?: number;
}) {
  const gradientId = `yoy-${useId()}`;
  const H = height;

  const years = Array.from(new Set(history.map((h) => h.year))).sort();
  const byYear = years.map((year) => ({
    year,
    points: QUARTERS.map((q) => history.find((h) => h.year === year && h.quarter === q) ?? null),
  }));

  const allValues = history.map((h) => h.balance);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const x = (qIdx: number) => PAD_L + (qIdx / (QUARTERS.length - 1)) * (W - PAD_L - PAD_R);
  const y = (v: number) => H - PAD_B - ((v - min) / range) * (H - PAD_T - PAD_B);

  const gridSteps = [0, 1, 2, 3].map((g) => min + (range * g) / 3);
  const yearColor = (year: number) => `var(--yoy-${year})`;
  const isCurrent = (year: number) => year === years[years.length - 1];

  return (
    <div>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={yearColor(years[years.length - 1])} stopOpacity={0.22} />
            <stop offset="100%" stopColor={yearColor(years[years.length - 1])} stopOpacity={0} />
          </linearGradient>
        </defs>

        {gridSteps.map((v, g) => {
          const yy = y(v);
          return (
            <g key={g}>
              <line x1={PAD_L} y1={yy} x2={W - PAD_R} y2={yy} stroke="var(--grid-line)" strokeWidth={1} />
              <text x={PAD_L - 8} y={yy + 3} fontSize={9} textAnchor="end" fill="var(--ink-3)">
                {v.toFixed(0)}
              </text>
            </g>
          );
        })}

        {QUARTERS.map((q, i) => (
          <text key={q} x={x(i)} y={H - 10} fontSize={9} textAnchor="middle" fill="var(--ink-3)">
            Q{q}
          </text>
        ))}

        {byYear.map(({ year, points }) => {
          const present = points
            .map((p, i) => (p ? { i, p } : null))
            .filter((v): v is { i: number; p: QuarterPoint } => v !== null);
          if (present.length === 0) return null;

          const pathD = present.map(({ i, p }, k) => `${k === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.balance).toFixed(1)}`).join(" ");
          const current = isCurrent(year);
          const color = yearColor(year);

          const areaD =
            current && present.length > 1
              ? `${pathD} L ${x(present[present.length - 1].i).toFixed(1)} ${H - PAD_B} L ${x(present[0].i).toFixed(1)} ${H - PAD_B} Z`
              : null;

          return (
            <g key={year}>
              {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}
              <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={current ? 2.75 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={current ? 1 : 0.85}
              />
              {present.map(({ i, p }) => (
                <g key={i}>
                  <circle
                    cx={x(i)}
                    cy={y(p.balance)}
                    r={9}
                    fill="transparent"
                    onMouseMove={(e) => showTip(e, p.label, fmtBHD(p.balance))}
                    onMouseLeave={hideTip}
                  />
                  <circle cx={x(i)} cy={y(p.balance)} r={current ? 4 : 3} fill={color} stroke="var(--surface)" strokeWidth={1.5} />
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="chart-legend">
        {years.map((year) => (
          <span className="item" key={year}>
            <span className="swatch" style={{ background: yearColor(year) }} />
            {year}
            {isCurrent(year) ? " (current)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
