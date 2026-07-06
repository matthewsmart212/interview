import { FileText } from "../Icons";
import CircularProgress from "../CircularProgress";
import s from "./cv-score-card.module.css";

function scorePill(score) {
  if (score >= 80) return { label: "Strong CV", cls: "ready" };
  if (score >= 65) return { label: "Good base", cls: "upcoming" };
  return { label: "Room to grow", cls: "prep" };
}

export default function CVScoreCard({
  fileName,
  meta,
  score,
  featured = false,
  className = "",
}) {
  const pill = scorePill(score);
  const cardCls = [s.card, featured ? s.featured : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`${cardCls}${className ? ` ${className}` : ""}`}>
      <span className={s.icon} aria-hidden>
        <FileText size={22} />
      </span>

      <span className={s.body}>
        <span className={s.fileName}>{fileName}</span>
        {meta ? <span className={s.meta}>{meta}</span> : null}
        <span className={s.pills}>
          <span className={`status-pill ${pill.cls}`}>{pill.label}</span>
        </span>
      </span>

      <span className={s.side}>
        <CircularProgress
          value={score}
          size={48}
          stroke={4}
          color="var(--brand)"
          track="rgba(124, 92, 255, 0.22)"
        >
          <span className={s.ringPct}>{score}</span>
        </CircularProgress>
      </span>
    </div>
  );
}
