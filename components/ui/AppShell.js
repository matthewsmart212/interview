import Phone from "../Phone";
import BottomNav from "../BottomNav";
import CoachStage from "../CoachStage";

/**
 * App shell — coach-led by default (room + avatar + options sheet).
 * Pass coach={false} for rare flat screens.
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
}) {
  if (!coach) {
    const screenClass = [
      "screen",
      "screen-pad",
      !noHeader && "has-app-header",
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

  const screenClass = [
    "screen",
    "coach-route",
    !noNav && "has-nav",
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
        >
          {children}
        </CoachStage>
      </div>
      {!noNav && <BottomNav active={navActive} />}
    </Phone>
  );
}
