import Phone from "../../components/Phone";
import TopBar from "../../components/TopBar";
import BottomNav from "../../components/BottomNav";
import CircularProgress from "../../components/CircularProgress";
import { Check, ChevronRight, Sparkle, Download } from "../../components/Icons";
import styles from "./cv.module.css";

const SUGGESTIONS = [
  { text: "Add more impact to your work experience", done: true },
  { text: "Highlight customer service skills", done: true },
  { text: "Include metrics and achievements", done: true },
  { text: "Add a strong personal summary", done: false },
];

export default function CvPage() {
  return (
    <Phone>
      <TopBar title="Improve My CV" backHref="/home" />
      <div className="screen screen-pad has-nav">
        <div className={`card ${styles.scoreCard}`}>
          <CircularProgress value={78} size={96} stroke={11}>
            <span className={styles.ringNum}>78%</span>
          </CircularProgress>
          <div className={styles.scoreBody}>
            <div className={styles.scoreLabel}>Your CV Match Score</div>
            <div className={styles.scoreSub}>
              Great start! Let&apos;s make it even better.
            </div>
            <button className={styles.viewBtn}>
              View Breakdown <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <p className="section-title" style={{ marginTop: 24 }}>
          Suggestions to improve your CV
        </p>

        <div className="card">
          {SUGGESTIONS.map((s) => (
            <div className="suggest" key={s.text}>
              <span className={`check${s.done ? "" : " todo"}`}>
                {s.done ? (
                  <Check size={15} stroke={3} />
                ) : (
                  <ChevronRight size={15} stroke={3} />
                )}
              </span>
              <span className="s-text">{s.text}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ marginTop: 22 }}>
          Optimise My CV <Sparkle size={18} />
        </button>
        <button className={styles.download}>
          <Download size={18} /> Download My CV (PDF)
        </button>
      </div>
      <BottomNav active="cv" />
    </Phone>
  );
}
