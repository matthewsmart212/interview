import Phone from "../Phone";
import BottomNav from "../BottomNav";
import CoachStage from "../CoachStage";
import MobilePageLayout from "./MobilePageLayout";

/**
 * App shell — coach-led by default (room + avatar + options sheet).
 * Pass coach={false} for rare flat screens.
 *
 * All routed content is wrapped in MobilePageLayout so bottom-nav
 * clearance (nav + safe-area + 20px) is applied once, globally.
 *
 * heroVariant / messageVariant / sheetVariant control layout per page.
 */
export default function AppShell({
  children,
  navActive,
  noNav = false,
  noHeader = false,
  className = "",
  coach = true,
  coachPose = "welcoming",
  coachTitle,
  coachSpeech,
  heroVariant = "large",
  messageVariant = "default",
  sheetVariant = "standard",
  messageClampLines,
  heroSlot = null,
}) {
  const withNav = !noNav;
  const page = (
    <MobilePageLayout withNav={withNav}>{children}</MobilePageLayout>
  );

  if (!coach) {
    const screenClass = [
      "screen",
      "screen-pad",
      !noHeader && "has-app-header",
      withNav && "has-nav",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Phone>
        <div className={screenClass}>{page}</div>
        {withNav && <BottomNav active={navActive} />}
      </Phone>
    );
  }

  const screenClass = [
    "screen",
    "coach-route",
    withNav && "has-nav",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Phone immersive>
      <div className={screenClass}>
        <CoachStage
          pose={coachPose}
          title={coachTitle}
          speech={coachSpeech}
          noHeader={noHeader || noNav}
          heroVariant={heroVariant}
          messageVariant={messageVariant}
          sheetVariant={sheetVariant}
          messageClampLines={messageClampLines}
          heroSlot={heroSlot}
        >
          {page}
        </CoachStage>
      </div>
      {withNav && <BottomNav active={navActive} />}
    </Phone>
  );
}
