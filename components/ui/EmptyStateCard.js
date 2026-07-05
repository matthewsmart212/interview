export default function EmptyStateCard({
  icon: Icon,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <div className={`empty-state${className ? ` ${className}` : ""}`}>
      {Icon ? (
        <span className="empty-state-icon" aria-hidden>
          <Icon size={30} />
        </span>
      ) : null}
      {title ? <div className="empty-state-title">{title}</div> : null}
      {description ? <p className="empty-state-sub">{description}</p> : null}
      {children}
    </div>
  );
}
