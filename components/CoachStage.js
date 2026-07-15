"use client";

import Avatar from "./Avatar";
import CoachMessage from "./CoachMessage";
import styles from "./coach-stage.module.css";

/**
 * Full-bleed interview room + coach avatar + content panel.
 *
 * heroVariant "home" places the avatar on the right and accepts a custom
 * heroSlot (greeting + chips) on the left — matching the home mockup.
 * The content panel sits above the avatar so cards cover it cleanly.
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
  messageClampLines,
  heroSlot = null,
}) {
  const isHome = heroVariant === "home";
  const showMessage =
    !isHome &&
    !heroSlot &&
    messageVariant !== "none" &&
    Boolean(title || speech);

  const stageClass = [
    styles.stage,
    noHeader ? styles.noHeader : "",
    showMessage || heroSlot || isHome ? "" : styles.noMessage,
    isHome ? styles.home : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={stageClass}>
      <div className={styles.bg} aria-hidden />
      <div className={styles.shade} aria-hidden />

      <div className={styles.scroller}>
        <div className={styles.hero}>
          <div className={styles.coach}>
            <Avatar
              pose={pose}
              alt="Your interview coach"
              fill
              className={styles.avatar}
            />
          </div>

          {heroSlot ? (
            <div className={styles.heroSlot}>{heroSlot}</div>
          ) : showMessage ? (
            <div className={styles.speechWrap}>
              <CoachMessage
                title={title}
                speech={speech}
                variant={messageVariant === "compact" ? "compact" : "default"}
                clampLines={messageClampLines}
              />
            </div>
          ) : null}
        </div>

        <div
          className={`${styles.panel}${isHome ? ` ${styles.panelHome}` : ""}`}
        >
          {isHome ? (
            <>
              {/* Explicit black sheet behind cards — fade only on the top edge */}
              <div className={styles.homeSheet} aria-hidden>
                <div className={styles.homeSheetFade} />
                <div className={styles.homeSheetFill} />
              </div>
              <div className={styles.panelBody}>{children}</div>
            </>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
