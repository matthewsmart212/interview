"use client";

import { useState } from "react";

const POSE_LABEL = {
  waving: "Waving",
  idle: "Coach",
  presenting: "Pointing",
  welcoming: "Welcome",
  thinking: "Thinking",
  thumbsup: "Great!",
  listening: "Listening",
};

export default function Avatar({
  pose = "idle",
  fallbackPose,
  alt,
  fill = false,
  round = false,
  className = "",
  style = {},
}) {
  const [failedSrcs, setFailedSrcs] = useState({});
  const label = alt || "AI coach";

  const primary = `/avatars/${pose}.png`;
  const fallback = fallbackPose ? `/avatars/${fallbackPose}.png` : null;
  const src = !failedSrcs[primary]
    ? primary
    : fallback && !failedSrcs[fallback]
    ? fallback
    : null;

  const cls = [
    fill ? "avatar-fill" : "avatar-img",
    round ? "avatar-round" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (!src) {
    return (
      <div
        className={`placeholder ${cls}`}
        style={style}
        role="img"
        aria-label={label}
      >
        <span>{POSE_LABEL[pose] || "Avatar"}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={label}
      className={cls}
      style={style}
      onError={() => setFailedSrcs((p) => ({ ...p, [src]: true }))}
    />
  );
}
