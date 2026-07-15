import CircularProgress from "./CircularProgress";
import styles from "./readiness-ring.module.css";

/**
 * Compact readiness progress ring with optional label.
 */
export default function ReadinessRing({
  value = 0,
  size = 64,
  stroke = 7,
  showLabel = false,
  label,
  className = "",
  color = "#a78bfa",
  track = "rgba(167, 139, 250, 0.18)",
}) {
  const pct = Math.max(0, Math.min(100, value));
  const display = label ?? `${pct}%`;

  return (
    <div className={`${styles.wrap} ${className}`.trim()}>
      <CircularProgress
        value={pct}
        size={size}
        stroke={stroke}
        color={color}
        track={track}
        animated
      >
        <span className={styles.value} style={{ fontSize: size * 0.22 }}>
          {pct > 0 ? `${pct}%` : "—"}
        </span>
      </CircularProgress>
      {showLabel ? <span className={styles.label}>{display}</span> : null}
    </div>
  );
}
