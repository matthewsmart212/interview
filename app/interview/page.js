import Link from "next/link";
import Phone from "../../components/Phone";
import TopBar from "../../components/TopBar";
import Avatar from "../../components/Avatar";
import Waveform from "../../components/Waveform";
import { Volume } from "../../components/Icons";
import m from "./interview.module.css";

export default function InterviewPage() {
  return (
    <Phone dark immersive>
      <div className={`${m.immersive} ${m.questionScreen}`}>
        <div className={m.stageBg} />
        <Avatar pose="presenting" fallbackPose="idle" fill alt="AI interviewer" />
        <div className={m.immersiveShade} />

        <TopBar
          title="AI Mock Interview"
          backHref="/home"
          overlay
          right={
            <Link href="/home" className="pill-end">
              End
            </Link>
          }
        />

        <div className={m.topArea}>
          <span className={m.qbadge}>Question 2 of 8</span>
        </div>

        <div className={m.bottomArea}>
          <div className={m.qcard}>
            <p className={m.qtext}>
              Can you tell me about a time you had to deal with a difficult
              customer? How did you handle it?
            </p>
            <div className={m.qfooter}>
              <Waveform bars={28} className={m.qwave} height={30} />
              <button className={m.qvolume} aria-label="Replay question audio">
                <Volume size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className={m.bottomBar}>
          <Link href="/interview/your-turn" className={m.answerBtn}>
            Tap to answer
          </Link>
        </div>
      </div>
    </Phone>
  );
}
