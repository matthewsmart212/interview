import Phone from "../Phone";
import BottomNav from "../BottomNav";
import CoachStage from "../CoachStage";

/**
 * App shell — coach-led by default (room + avatar + options sheet).
 * Pass coach={false} for rare flat screens.
 */
export default function AppShell({
  children,
  navActive,
  noNav = false,
  className = "",
  coach = true,
  coachPose = "welcoming",
  coachTitle,
  coachSpeech,
}) {
  if (!coach) {
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
        >
          {children}
        </CoachStage>
      </div>
      {!noNav && <BottomNav active={navActive} />}
    </Phone>
  );
}
