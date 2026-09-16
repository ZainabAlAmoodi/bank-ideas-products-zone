import type { TipState } from "@/lib/useTooltip";

export function Tooltip({ tip }: { tip: TipState }) {
  return (
    <div id="tip" className={tip.visible ? "visible" : ""} style={{ left: tip.x, top: tip.y }}>
      <b>{tip.label}</b>
      <br />
      {tip.value}
    </div>
  );
}
