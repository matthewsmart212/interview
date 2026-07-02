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
        <Avatar
          pose="listening"
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

        <div className={m.listenCard}>
          <div className={m.listening}>Listening...</div>
          <div className={m.speak}>Speak clearly</div>
          <div className={m.listenRow}>
            <Waveform bars={13} className={m.sideWave} height={40} />
            <Link
              href="/interview/analyzing"
              className={m.micLight}
              aria-label="Stop recording"
            >
              <Mic size={28} />
            </Link>
            <Waveform bars={13} className={m.sideWave} height={40} />
          </div>
          <Link href="/interview/analyzing" className={m.tapStop}>
            Tap to stop
          </Link>
        </div>
      </div>
    </Phone>
  );
}
