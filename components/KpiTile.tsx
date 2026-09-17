import type { ReactNode } from "react";

export function KpiTile({
  eyebrow,
  value,
  sub,
  popover,
  align,
}: {
  eyebrow: string;
  value: ReactNode;
  sub?: ReactNode;
  popover?: ReactNode;
  /** Anchor the popover from the right instead of the left, for tiles near the edge. */
  align?: "left" | "right";
}) {
  return (
    <div className={`kpi-tile ${popover ? "has-popover" : ""}`}>
      <div className="eyebrow">{eyebrow}</div>
      <div className="kpi-value tabular">{value}</div>
      {sub}
      {popover && <div className={`popover-panel ${align === "right" ? "align-right" : ""}`}>{popover}</div>}
    </div>
  );
}
