import Link from "next/link";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import Avatar from "../../../components/Avatar";
import Waveform from "../../../components/Waveform";
import { Mic } from "../../../components/Icons";
import m from "../interview.module.css";

export default function YourTurnPage() {
  return (
    <Phone dark immersive>
      <div className={m.immersive}>
        <div className={m.stageBg} />
        <Avatar pose="idle" fill alt="AI interviewer" />
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

        <div className={m.panel}>
          <div className={m.listening}>Listening...</div>
          <div className={m.speak}>Speak clearly</div>
          <Waveform bars={32} className={m.bigWave} height={48} />
          <div className={m.micWrap}>
            <Link
              href="/interview/analyzing"
              className="mic-btn"
              aria-label="Stop recording"
            >
              <Mic size={30} />
            </Link>
          </div>
        </div>

        <div className={m.bottomBar}>
          <Link href="/interview/analyzing" className={m.tapStop}>
            Tap to stop
          </Link>
        </div>
      </div>
    </Phone>
  );
}
