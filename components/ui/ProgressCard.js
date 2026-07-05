import s from "./progress-card.module.css";

export default function ProgressCard({
  title,
  badge,
  children,
  className = "",
}) {
  return (
    <div className={`card ${s.card}${className ? ` ${className}` : ""}`}>
      {(title || badge) && (
        <div className={s.head}>
          {title ? <span className={s.title}>{title}</span> : null}
          {badge ? <span className={s.badge}>{badge}</span> : null}
        </div>
      )}
      {children}
    </div>
  );
}
