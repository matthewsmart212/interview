"use client";

import Avatar from "./Avatar";
import CoachMessage from "./CoachMessage";
import styles from "./coach-stage.module.css";

/**
 * Full-bleed interview room + coach avatar + options sheet.
 *
 * heroVariant: large | medium | compact | pointing | celebration
 * messageVariant: default | compact | none
 * sheetVariant: standard | elevated | fullHeight
 */
export default function CoachStage({
  pose = "welcoming",
  title,
  speech,
  children,
  className = "",
  noHeader = false,
  heroVariant = "large",
  messageVariant = "default",
  sheetVariant = "standard",
}) {
  const showMessage =
    messageVariant !== "none" && Boolean(title || speech);

  const stageClass = [
    styles.stage,
    noHeader ? styles.noHeader : "",
    styles[`hero_${heroVariant}`] || "",
    showMessage ? "" : styles.noMessage,
    styles[`sheet_${sheetVariant}`] || "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={stageClass}>
      <div className={styles.bg} aria-hidden />
      <div className={styles.shade} aria-hidden />

      <div className={styles.coach}>
        <Avatar
          pose={pose}
          alt="Your interview coach"
          fill
          className={styles.avatar}
        />
      </div>

      {showMessage ? (
        <div className={styles.speechWrap}>
          <CoachMessage
            title={title}
            speech={speech}
            variant={messageVariant === "compact" ? "compact" : "default"}
          />
        </div>
      ) : null}

      <div className={styles.sheet}>
        <div className={styles.sheetInner}>{children}</div>
      </div>
    </div>
  );
}
