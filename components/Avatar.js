"use client";

import { useState } from "react";

const POSE_LABEL = {
  waving: "Waving",
  idle: "Coach",
  presenting: "Pointing",
  welcoming: "Welcome",
  thinking: "Thinking",
  thumbsup: "Great!",
};

export default function Avatar({
  pose = "idle",
  alt,
  fill = false,
  round = false,
  className = "",
  style = {},
}) {
  const [failed, setFailed] = useState(false);
  const src = `/avatars/${pose}.png`;
  const label = alt || "AI coach";

  const cls = [
    fill ? "avatar-fill" : "avatar-img",
    round ? "avatar-round" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (failed) {
    return (
      <div className={`placeholder ${cls}`} style={style} role="img" aria-label={label}>
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
      onError={() => setFailed(true)}
    />
  );
}
