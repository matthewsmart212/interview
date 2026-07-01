import Link from "next/link";
import Phone from "../components/Phone";
import Avatar from "../components/Avatar";
import { Sparkle, FileText, Mic, Volume, BarChart } from "../components/Icons";
import styles from "./welcome.module.css";

const FEATURES = [
  { Icon: FileText, text: "AI CV builder & optimiser" },
  { Icon: Mic, text: "Realistic AI mock interviews" },
  { Icon: Volume, text: "Practice with voice & get feedback" },
  { Icon: BarChart, text: "Track progress & improve" },
];

export default function WelcomePage() {
  return (
    <Phone>
      <div className="screen">
        <div className={styles.wrap}>
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <h1 className={styles.title}>
                Interview Coach AI
                <span className={styles.spark}>
                  <Sparkle size={22} />
                </span>
              </h1>
              <p className={styles.sub}>
                Your AI interview coach that prepares you to get the job.
              </p>
            </div>
            <Avatar
              pose="waving"
              alt="AI coach waving"
              className={styles.avatar}
            />
          </div>

          <div className={`card ${styles.features}`}>
            {FEATURES.map(({ Icon, text }) => (
              <div className={styles.feature} key={text}>
                <span className={styles.fIcon}>
                  <Icon size={20} />
                </span>
                <span className={styles.fText}>{text}</span>
              </div>
            ))}
          </div>

          <div className="grow" />

          <div className={styles.actions}>
            <Link href="/setup" className="btn btn-primary">
              Get Started
            </Link>
            <Link href="/home" className={styles.signin}>
              I already have an account
            </Link>
          </div>
        </div>
      </div>
    </Phone>
  );
}
