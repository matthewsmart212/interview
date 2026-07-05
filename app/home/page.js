import Link from "next/link";
import Phone from "../../components/Phone";
import AppHeader from "../../components/AppHeader";
import PageHeader from "../../components/PageHeader";
import BottomNav from "../../components/BottomNav";
import {
  FileText,
  Mic,
  MessageCircle,
  BarChart,
  ChevronRight,
  Plus,
  Calendar,
} from "../../components/Icons";
import { USER, INTERVIEWS, MASTER_CV, MOCK_HISTORY } from "../../lib/app-data";
import styles from "./home.module.css";

const ACTIONS = [
  {
    href: "/interview",
    Icon: Mic,
    title: "AI Mock Interview",
    sub: "Practice with your AI interviewer",
  },
  {
    href: "/cv",
    Icon: FileText,
    title: "My CV",
    sub: "Improve, tailor and download",
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
    sub: "Stats, streaks & mock history",
  },
];

export default function HomePage() {
  const next = INTERVIEWS.find((i) => i.status === "upcoming");
  const upcomingCount = INTERVIEWS.filter((i) => i.status === "upcoming").length;
  const lastMock = MOCK_HISTORY[0];

  return (
    <Phone>
      <AppHeader />
      <div className="screen screen-pad has-nav has-app-header">
        <PageHeader
          icon="home"
          title={`Hi ${USER.name} 👋`}
          description={
            next
              ? `Your ${next.company} interview is in ${next.daysAway} days.`
              : "Let's get you interview-ready."
          }
        />

        {next ? (
          <Link href={`/interviews/${next.id}`} className={styles.upcoming}>
            <div>
              <div className={styles.upLabel}>Next interview</div>
              <div className={styles.upTitle}>
                {next.role} at {next.company}
              </div>
              <div className={styles.upDays}>
                in {next.daysAway} days · {next.readiness}% ready — keep going
              </div>
            </div>
            <div className={styles.dateChip}>
              <span className="d">{next.dateChip.d}</span>
              <span className="m">{next.dateChip.m}</span>
            </div>
          </Link>
        ) : (
          <Link href="/interviews/new" className={styles.upcoming}>
            <div>
              <div className={styles.upLabel}>No interviews yet</div>
              <div className={styles.upTitle}>Add your first interview</div>
              <div className={styles.upDays}>
                We&apos;ll build a prep plan around it
              </div>
            </div>
            <div className={styles.dateChip}>
              <Plus size={26} />
            </div>
          </Link>
        )}

        <div className={styles.pillRow}>
          <Link href="/interviews" className={styles.pill}>
            <Calendar size={16} />
            {upcomingCount} upcoming
          </Link>
          <Link href="/cv" className={styles.pill}>
            <FileText size={16} />
            CV score {MASTER_CV.score}
          </Link>
          {lastMock && (
            <Link href={`/history/${lastMock.id}`} className={styles.pill}>
              <Mic size={16} />
              Last mock {lastMock.score}
            </Link>
          )}
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
