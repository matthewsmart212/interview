import Link from "next/link";
import Phone from "../../components/Phone";
import TopBar from "../../components/TopBar";
import Avatar from "../../components/Avatar";
import Waveform from "../../components/Waveform";
import { Volume } from "../../components/Icons";
import m from "./interview.module.css";

export default function InterviewPage() {
  return (
    <Phone dark>
      <div className={m.immersive}>
        <div className={m.stageBg} />
        <Avatar pose="idle" fill alt="AI interviewer" />
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
            <div className={m.qcardHead}>
              <Volume size={20} />
            </div>
            <p className={m.qtext}>
              Can you tell me about a time you had to deal with a difficult
              customer? How did you handle it?
            </p>
            <Waveform bars={30} className={m.qwave} height={30} />
          </div>
          <Link href="/interview/your-turn" className={m.hint}>
            Tap to answer
          </Link>
        </div>
      </div>
    </Phone>
  );
}
