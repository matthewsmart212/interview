const HEIGHTS = [
  30, 55, 40, 80, 60, 95, 45, 70, 50, 88, 35, 62, 78, 42, 90, 55, 68, 38, 82,
  48, 72, 30, 60, 85, 44, 66, 52, 92, 36, 74, 58, 40, 80, 46, 64,
];

export default function Waveform({
  bars = 34,
  color = "var(--brand)",
  height = 34,
  animated = true,
  className = "",
}) {
  return (
    <div
      className={`waveform ${className}`}
      style={{ color, height }}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => {
        const h = HEIGHTS[i % HEIGHTS.length];
        return (
          <i
            key={i}
            style={{
              height: `${h}%`,
              animationPlayState: animated ? "running" : "paused",
              animationDelay: `${(i % 12) * 0.08}s`,
              opacity: animated ? 1 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
}
