import styles from "./coach-message.module.css";

/**
 * Soft frosted coach message card (replaces harsh solid white bubble).
 * variant: "default" | "compact"
 */
export default function CoachMessage({
  title,
  speech,
  variant = "default",
  className = "",
}) {
  if (!title && !speech) return null;

  return (
    <div
      className={`${styles.wrap} ${variant === "compact" ? styles.compact : ""} ${className}`.trim()}
    >
      <div className={styles.card}>
        {title ? <p className={styles.title}>{title}</p> : null}
        {speech ? <p className={styles.text}>{speech}</p> : null}
      </div>
    </div>
  );
}
