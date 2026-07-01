import Link from "next/link";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import CircularProgress from "../../../components/CircularProgress";
import { CheckCircle, AlertCircle } from "../../../components/Icons";
import m from "../interview.module.css";

const GOOD = [
  "Good example with a clear situation",
  "Explained your actions clearly",
  "Positive outcome",
];
const IMPROVE = [
  "Could add more about the result",
  "Try to show more impact",
];

export default function FeedbackPage() {
  return (
    <Phone dark>
      <TopBar title="AI Feedback" backHref="/interview" />
      <div className={`screen ${m.fbScreen}`}>
        <div className={m.scoreTop}>
          <CircularProgress
            value={82}
            size={92}
            stroke={10}
            color="#9d86f7"
            track="rgba(255,255,255,0.12)"
          >
            <span className={m.ringScore}>82</span>
          </CircularProgress>
          <div>
            <div className={m.lab}>Overall Score</div>
            <div className={m.big}>
              82<small>/100</small>
            </div>
            <div className={m.good}>Great job!</div>
          </div>
        </div>

        <div className={m.fbBlock}>
          <h3>What you did well</h3>
          {GOOD.map((t) => (
            <div className="fb-item fb-good" key={t}>
              <span className="fb-ico">
                <CheckCircle size={18} />
              </span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        <div className={m.fbBlock}>
          <h3>What to improve</h3>
          {IMPROVE.map((t) => (
            <div className="fb-item fb-bad" key={t}>
              <span className="fb-ico">
                <AlertCircle size={18} />
              </span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        <Link
          href="/interview/feedback/detailed"
          className={m.detailLink}
        >
          View detailed feedback
        </Link>

        <div className="grow" />

        <Link
          href="/interview"
          className="btn btn-primary"
          style={{ marginTop: 12 }}
        >
          Next Question
        </Link>
      </div>
    </Phone>
  );
}
