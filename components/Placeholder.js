export default function Placeholder({
  label = "Image",
  width = "100%",
  height = "100%",
  rounded = 0,
  className = "",
  style = {},
}) {
  return (
    <div
      className={`placeholder ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded,
        ...style,
      }}
      aria-label={`${label} placeholder`}
      role="img"
    >
      <span>{label}</span>
    </div>
  );
}
