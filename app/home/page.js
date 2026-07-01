import Link from "next/link";
import Phone from "../../components/Phone";
import BottomNav from "../../components/BottomNav";
import {
  Menu,
  FileText,
  Mic,
  MessageCircle,
  BarChart,
  ChevronRight,
} from "../../components/Icons";
import styles from "./home.module.css";

const ACTIONS = [
  {
    href: "/cv",
    Icon: FileText,
    title: "Improve My CV",
    sub: "Tailor your CV to this role",
  },
  {
    href: "/interview",
    Icon: Mic,
    title: "AI Mock Interview",
    sub: "Practice with AI interviewer",
  },
  {
    href: "/questions",
    Icon: MessageCircle,
    title: "Interview Questions",
    sub: "See role-specific questions",
  },
  {
    href: "/progress",
    Icon: BarChart,
    title: "My Progress",
    sub: "See your stats & history",
  },
];

export default function HomePage() {
  return (
    <Phone>
      <div className="topbar">
        <div className="tb-side">
          <button className="icon-btn" aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
        <div className="tb-title" />
        <div className="tb-side right">
          <span className="streak">
            <span aria-hidden>🔥</span> 7
          </span>
        </div>
      </div>

      <div className="screen screen-pad has-nav">
        <h1 className={styles.greeting}>
          Hi Alex <span aria-hidden>👋</span>
        </h1>
        <p className={styles.greetSub}>You&apos;ve got an interview coming up!</p>

        <div className={styles.upcoming}>
          <div>
            <div className={styles.upLabel}>Interview for</div>
            <div className={styles.upTitle}>
              Customer Service Advisor at Tesco
            </div>
            <div className={styles.upDays}>in 6 days</div>
          </div>
          <div className={styles.dateChip}>
            <span className="d">24</span>
            <span className="m">MAY</span>
          </div>
        </div>

        <p className="section-title" style={{ marginTop: 24 }}>
          What would you like to do?
        </p>

        <div className="stack">
          {ACTIONS.map(({ href, Icon, title, sub }) => (
            <Link key={href} href={href} className="action-row">
              <span className="ar-icon">
                <Icon size={22} />
              </span>
              <span className="ar-body">
                <span className="ar-title">{title}</span>
                <span className="ar-sub">{sub}</span>
              </span>
              <ChevronRight size={20} className="chev" />
            </Link>
          ))}
        </div>
      </div>

      <BottomNav active="home" />
    </Phone>
  );
}
