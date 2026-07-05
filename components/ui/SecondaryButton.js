export default function SecondaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`btn btn-secondary btn-pill${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
