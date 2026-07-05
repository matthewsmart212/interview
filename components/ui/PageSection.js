export default function PageSection({
  title,
  action,
  children,
  className = "",
  id,
}) {
  return (
    <section className={`page-section${className ? ` ${className}` : ""}`} id={id}>
      {(title || action) && (
        <div className="page-section-head">
          {title ? <h2 className="section-title">{title}</h2> : null}
          {action ?? null}
        </div>
      )}
      {children}
    </section>
  );
}
