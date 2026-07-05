import { FileText } from "../Icons";
import s from "./cv-score-card.module.css";

export default function CVScoreCard({
  fileName,
  meta,
  score,
  className = "",
}) {
  return (
    <div className={`card ${s.card}${className ? ` ${className}` : ""}`}>
      <span className={s.icon} aria-hidden>
        <FileText size={24} />
      </span>
      <span className={s.body}>
        <span className={s.fileName}>{fileName}</span>
        {meta ? <span className={s.meta}>{meta}</span> : null}
      </span>
      <span className={s.scorePill}>
        <b>{score}</b>
        <span>SCORE</span>
      </span>
    </div>
  );
}
