/**
 * Shared mobile page layout.
 *
 * Scrollable page content ends with a bottom spacer so it never sits
 * beneath the fixed bottom navigation (nav height + safe-area + 20px).
 * Used by AppShell across coach and flat routes — do not add per-page
 * bottom nav padding elsewhere.
 */
export default function MobilePageLayout({
  children,
  withNav = true,
  className = "",
}) {
  const layoutClass = [
    "mobile-page-layout",
    withNav ? "mobile-page-layout--with-nav" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={layoutClass}>
      {children}
      {withNav ? (
        <div className="bottom-content-spacer" aria-hidden="true" />
      ) : null}
    </div>
  );
}
