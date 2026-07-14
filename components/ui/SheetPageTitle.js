/**
 * Consistent page title at the top of every coach content panel.
 * Optional `action` slot (e.g. "+ Add") sits on the right.
 */
export default function SheetPageTitle({ children, action, className = "" }) {
  return (
    <div className={`sheet-page-head ${className}`.trim()}>
      <h1 className="sheet-page-title">{children}</h1>
      {action ? <div className="sheet-page-action">{action}</div> : null}
    </div>
  );
}
