import Link from "next/link";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import Avatar from "../../../components/Avatar";
import Waveform from "../../../components/Waveform";
import m from "../interview.module.css";

export default function YourTurnPage() {
  return (
    <Phone dark immersive>
      <div className={`${m.immersive} ${m.questionScreen}`}>
        <div className={m.stageBg} />
        <Avatar
          pose="welcoming"
          fallbackPose="idle"
          fill
          alt="AI interviewer listening"
        />
        <div className={m.immersiveShade} />

        <TopBar
          title="Your Turn"
          backHref="/interview"
          overlay
          right={
            <Link href="/home" className="pill-end">
              End
            </Link>
          }
        />

        <div className={m.bottomArea}>
          <div className={`${m.qcard} ${m.darkCard}`}>
            <div className={m.listening}>Listening...</div>
            <div className={m.speak}>Speak clearly</div>
            <div className={m.qfooter}>
              <Waveform bars={28} className={m.qwave} height={30} />
            </div>
          </div>
        </div>

        <div className={m.bottomBar}>
          <Link href="/interview/analyzing" className={m.answerBtn}>
            Tap to speak
          </Link>
        </div>
      </div>
    </Phone>
  );
}
