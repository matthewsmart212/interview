/**
 * Shared mobile page layout.
 *
 * Applies the global bottom clearance token:
 *   nav height + safe-area-inset-bottom + 20px
 *
 * Flat routes render that as an in-flow spacer. Coach routes use the
 * same token on `.coach-route.has-nav` so the sheet scrollport ends
 * above the fixed nav (spacer is hidden there). Do not add per-page
 * bottom-nav padding elsewhere.
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
