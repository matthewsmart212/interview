export default function Phone({ dark = false, immersive = false, children }) {
  const cls = [
    "phone",
    dark ? "dark" : "",
    immersive ? "immersive-shell" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return <div className={cls}>{children}</div>;
}
