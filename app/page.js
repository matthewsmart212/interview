import Link from "next/link";
import Phone from "../components/Phone";
import CoachStage from "../components/CoachStage";
import { FileText, Mic, Volume, BarChart } from "../components/Icons";
import styles from "./welcome.module.css";

const FEATURES = [
  { Icon: Mic, text: "Realistic AI mock interviews" },
  { Icon: Volume, text: "Practice with voice & get feedback" },
  { Icon: FileText, text: "Personalised questions from your CV" },
  { Icon: BarChart, text: "Track progress & improve" },
];

export default function WelcomePage() {
  return (
    <Phone immersive>
      <div className={`screen ${styles.welcomeScreen}`}>
        <CoachStage
          pose="waving"
          title="I'm your interview coach"
          speech="I'll help you practise, get feedback, and walk into the real thing with confidence."
          noHeader
        >
          <div className={styles.features}>
            {FEATURES.map(({ Icon, text }) => (
              <div className={styles.feature} key={text}>
                <span className={styles.fIcon}>
                  <Icon size={18} />
                </span>
                <span className={styles.fText}>{text}</span>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/onboarding" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/login" className={styles.signin}>
              I already have an account
            </Link>
          </div>
        </CoachStage>
      </div>
    </Phone>
  );
}
