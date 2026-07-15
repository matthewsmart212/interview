"use client";

import { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import CoachMessage from "./CoachMessage";
import styles from "./coach-stage.module.css";

/**
 * Full-bleed interview room + coach avatar + content panel.
 *
 * heroVariant "home" places the avatar on the right and accepts a custom
 * heroSlot (greeting + chips) on the left — matching the home mockup.
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
  const scrollerRef = useRef(null);
  const heroRef = useRef(null);

  const isHome = heroVariant === "home";
  const showMessage =
    !isHome &&
    !heroSlot &&
    messageVariant !== "none" &&
    Boolean(title || speech);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const hero = heroRef.current;
    if (!scroller || !hero) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const t = scroller.scrollTop;
      const h = hero.offsetHeight || 1;
      const y = t * 0.4;
      const opacity = Math.max(0, 1 - t / (h * 0.85));
      hero.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      hero.style.opacity = opacity.toFixed(3);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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

      <div className={styles.scroller} ref={scrollerRef}>
        <div className={styles.hero} ref={heroRef}>
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
          {children}
        </div>
      </div>
    </div>
  );
}
