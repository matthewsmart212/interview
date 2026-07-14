"use client";

import Avatar from "./Avatar";
import styles from "./coach-stage.module.css";

/**
 * Full-bleed interview room + coach avatar.
 * Content (options) sits in the sheet underneath — she's always the guide.
 */
export default function CoachStage({
  pose = "welcoming",
  title,
  speech,
  children,
  className = "",
  noHeader = false,
}) {
  return (
    <div
      className={`${styles.stage} ${noHeader ? styles.noHeader : ""} ${className}`.trim()}
    >
      <div className={styles.bg} aria-hidden />
      <div className={styles.shade} aria-hidden />

      <div className={styles.coach}>
        <Avatar pose={pose} alt="Your interview coach" fill className={styles.avatar} />
      </div>

      {(title || speech) && (
        <div className={styles.speechWrap}>
          <div className={styles.speech}>
            {title ? <p className={styles.speechTitle}>{title}</p> : null}
            {speech ? <p className={styles.speechText}>{speech}</p> : null}
          </div>
        </div>
      )}

      <div className={styles.sheet}>
        <div className={styles.sheetInner}>{children}</div>
      </div>
    </div>
  );
}
