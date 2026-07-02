export default function CircularProgress({
  value = 0,
  size = 120,
  stroke = 12,
  color = "var(--brand)",
  track = "var(--brand-050)",
  animated = false,
  children,
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={
            animated
              ? { transition: "stroke-dashoffset 1.3s cubic-bezier(0.3, 0.6, 0.2, 1)" }
              : undefined
          }
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}
