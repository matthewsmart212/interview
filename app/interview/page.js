import Link from "next/link";
import Phone from "../../components/Phone";
import TopBar from "../../components/TopBar";
import Placeholder from "../../components/Placeholder";
import Waveform from "../../components/Waveform";
import { Volume } from "../../components/Icons";
import m from "./interview.module.css";

export default function InterviewPage() {
  return (
    <Phone dark>
      <TopBar
        title="AI Mock Interview"
        backHref="/home"
        right={
          <Link href="/home" className="pill-end">
            End
          </Link>
        }
      />
      <div className="screen">
        <div className={m.stage}>
          <Placeholder label="AI Avatar" className={m.stageFill} />
          <div className={m.stageTop}>
            <span className={m.qbadge}>Question 2 of 8</span>
          </div>
          <div className={m.stageBottom}>
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
          </div>
        </div>
        <Link href="/interview/your-turn" className={m.hint}>
          Tap to answer
        </Link>
      </div>
    </Phone>
  );
}
