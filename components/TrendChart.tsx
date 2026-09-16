"use client";

import { useId, type MouseEvent } from "react";
import { fmtBHD } from "@/lib/data";

const W = 520;

export function TrendChart({
  values,
  months,
  showTip,
  hideTip,
  compact = false,
}: {
  values: number[];
  months: string[];
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
  /** Smaller, chrome-free rendering for small-multiples / at-a-glance use. */
  compact?: boolean;
}) {
  const gradientId = `areaGrad-${useId()}`;

  const H = compact ? 88 : 220;
  const padL = compact ? 6 : 44;
  const padR = compact ? 6 : 14;
  const padT = compact ? 10 : 16;
  const padB = compact ? 10 : 28;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const x = (i: number) => padL + (i / (values.length - 1)) * (W - padL - padR);
  const y = (v: number) => H - padB - ((v - min) / range) * (H - padT - padB);

  const gridSteps = compact ? [] : [0, 1, 2, 3].map((g) => min + (range * g) / 3);
  const pathD = values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const areaD = `${pathD} L ${x(values.length - 1).toFixed(1)} ${H - padB} L ${x(0).toFixed(1)} ${H - padB} Z`;

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--flow-in)" stopOpacity={0.28} />
          <stop offset="100%" stopColor="var(--flow-in)" stopOpacity={0} />
        </linearGradient>
      </defs>

      {gridSteps.map((v, g) => {
        const yy = y(v);
        return (
          <g key={g}>
            <line x1={padL} y1={yy} x2={W - padR} y2={yy} stroke="var(--grid-line)" strokeWidth={1} />
            <text x={padL - 8} y={yy + 3} fontSize={9} textAnchor="end" fill="var(--ink-3)">
              {v.toFixed(0)}
            </text>
          </g>
        );
      })}

      <path d={areaD} fill={`url(#${gradientId})`} />
      <path d={pathD} fill="none" stroke="var(--flow-in)" strokeWidth={compact ? 2 : 2.5} strokeLinecap="round" strokeLinejoin="round" />

      {values.map((v, i) => (
        <g key={i}>
          <circle
            cx={x(i)}
            cy={y(v)}
            r={compact ? 7 : 9}
            fill="transparent"
            onMouseMove={(e) => showTip(e, `${months[i]} balance`, fmtBHD(v))}
            onMouseLeave={hideTip}
          />
          <circle
            cx={x(i)}
            cy={y(v)}
            r={i === values.length - 1 ? (compact ? 3.5 : 4.5) : compact ? 0 : 3}
            fill="var(--flow-in)"
            stroke="var(--surface)"
            strokeWidth={1.5}
          />
        </g>
      ))}

      {!compact &&
        months.map((m, i) => (
          <text key={m} x={x(i)} y={H - 8} fontSize={9} textAnchor="middle" fill="var(--ink-3)">
            {m}
          </text>
        ))}
    </svg>
  );
}
