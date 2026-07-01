import Link from "next/link";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import Placeholder from "../../../components/Placeholder";
import Waveform from "../../../components/Waveform";
import { Mic } from "../../../components/Icons";
import m from "../interview.module.css";

export default function YourTurnPage() {
  return (
    <Phone dark>
      <TopBar
        title="Your Turn"
        backHref="/interview"
        right={
          <Link href="/home" className="pill-end">
            End
          </Link>
        }
      />
      <div className="screen">
        <div className={m.stage}>
          <Placeholder label="AI Avatar" className={m.stageFill} />
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
              <Link href="/interview/analyzing" className={m.tapStop}>
                Tap to stop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}
