import Phone from "../Phone";
import BottomNav from "../BottomNav";

export default function AppShell({
  children,
  navActive,
  noNav = false,
  className = "",
}) {
  const screenClass = [
    "screen",
    "screen-pad",
    "has-app-header",
    !noNav && "has-nav",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Phone>
      <div className={screenClass}>{children}</div>
      {!noNav && <BottomNav active={navActive} />}
    </Phone>
  );
}
