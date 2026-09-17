// The BisB arch mark: two overlapping strokes (gold, teal) meeting at a peak,
// echoing the real BisB logo. Colors are fixed brand colors, not theme tokens.
export function BisbMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M47 9 C 22 9 12 28 12 53 L12 62" stroke="var(--brand-gold)" strokeWidth="15" strokeLinecap="round" />
      <path d="M58 23 C 85 23 90 50 90 78 L90 90" stroke="var(--accent-soft)" strokeWidth="18" strokeLinecap="round" />
    </svg>
  );
}
