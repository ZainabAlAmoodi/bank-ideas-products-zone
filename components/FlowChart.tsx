"use client";

import type { MouseEvent } from "react";
import { fmtBHD } from "@/lib/data";

const W = 520;
const H = 220;
const PAD_L = 44;
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 28;

export function FlowChart({
  months,
  inflow,
  outflow,
  showTip,
  hideTip,
}: {
  months: string[];
  inflow: number[];
  outflow: number[];
  showTip: (e: MouseEvent, label: string, value: string) => void;
  hideTip: () => void;
}) {
  const max = Math.max(...inflow, ...outflow, 1);
  const baseY = PAD_T + (H - PAD_T - PAD_B) / 2;
  const scale = (H - PAD_T - PAD_B) / 2 / max;
  const bw = (W - PAD_L - PAD_R) / months.length;
  const barW = bw * 0.36;

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <line x1={PAD_L} y1={baseY} x2={W - PAD_R} y2={baseY} stroke="var(--grid-line)" strokeWidth={1.5} />
      {months.map((m, i) => {
        const cx = PAD_L + bw * i + bw / 2;
        const inH = inflow[i] * scale;
        const outH = outflow[i] * scale;
        return (
          <g key={m}>
            <rect
              x={cx - barW / 2}
              y={baseY - inH}
              width={barW}
              height={inH}
              rx={3}
              fill="var(--flow-in)"
              onMouseMove={(e) => showTip(e, `${m} inflow`, fmtBHD(inflow[i]))}
              onMouseLeave={hideTip}
            />
            <rect
              x={cx - barW / 2}
              y={baseY}
              width={barW}
              height={outH}
              rx={3}
              fill="var(--flow-out)"
              onMouseMove={(e) => showTip(e, `${m} outflow`, fmtBHD(outflow[i]))}
              onMouseLeave={hideTip}
            />
            <text x={cx} y={H - 8} fontSize={9} textAnchor="middle" fill="var(--ink-3)">
              {m}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
