export default function Phone({ dark = false, children }) {
  return <div className={`phone${dark ? " dark" : ""}`}>{children}</div>;
}
