"use client";

import type { MouseEvent } from "react";
import { fmtBHD } from "@/lib/data";

const W = 520;
const H = 220;
const PAD_L = 44;
const PAD_R = 14;
const PAD_T = 16;
const PAD_B = 28;

export function TrendChart({
  values,
  months,
  showTip,
  hideTip,
}: {
  values: number[];
  months: string[];
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const x = (i: number) => PAD_L + (i / (values.length - 1)) * (W - PAD_L - PAD_R);
  const y = (v: number) => H - PAD_B - ((v - min) / range) * (H - PAD_T - PAD_B);

  const gridSteps = [0, 1, 2, 3].map((g) => min + (range * g) / 3);
  const pathD = values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const areaD = `${pathD} L ${x(values.length - 1).toFixed(1)} ${H - PAD_B} L ${x(0).toFixed(1)} ${H - PAD_B} Z`;

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--flow-in)" stopOpacity={0.28} />
          <stop offset="100%" stopColor="var(--flow-in)" stopOpacity={0} />
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

      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke="var(--flow-in)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {values.map((v, i) => (
        <g key={i}>
          <circle
            cx={x(i)}
            cy={y(v)}
            r={9}
            fill="transparent"
            onMouseMove={(e) => showTip(e, `${months[i]} balance`, fmtBHD(v))}
            onMouseLeave={hideTip}
          />
          <circle cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 4.5 : 3} fill="var(--flow-in)" stroke="var(--surface)" strokeWidth={1.5} />
        </g>
      ))}

      {months.map((m, i) => (
        <text key={m} x={x(i)} y={H - 8} fontSize={9} textAnchor="middle" fill="var(--ink-3)">
          {m}
        </text>
      ))}
    </svg>
  );
}
