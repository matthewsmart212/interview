import Link from "next/link";
import Phone from "../../components/Phone";
import PageHeader from "../../components/PageHeader";
import BottomNav from "../../components/BottomNav";
import HomeChoiceCard from "../../components/home/HomeChoiceCard";
import StatPill from "../../components/home/StatPill";
import QuickActionRow from "../../components/home/QuickActionRow";
import { FileText, Mic, MessageCircle, Plus, Calendar } from "../../components/Icons";
import { USER, INTERVIEWS, MASTER_CV, MOCK_HISTORY } from "../../lib/app-data";
import styles from "./home.module.css";

const QUICK_ACTIONS = [
  {
    href: "/mock",
    icon: Mic,
    title: "Mock interview",
    subtitle: "Practice with your AI interviewer",
  },
  {
    href: "/cv",
    icon: FileText,
    title: "My CV",
    subtitle: "Improve, tailor and download",
  },
  {
    href: "/questions",
    icon: MessageCircle,
    title: "Interview questions",
    subtitle: "See role-specific questions",
  },
];

export default function HomePage() {
  const next = INTERVIEWS.find((i) => i.status === "upcoming");
  const upcomingCount = INTERVIEWS.filter((i) => i.status === "upcoming").length;
  const lastMock = MOCK_HISTORY[0];

  return (
    <Phone>
      <div className="screen screen-pad has-nav has-app-header">
        <PageHeader
          icon="home"
          title={`Hi ${USER.name} 👋`}
          description={
            next
              ? `Your ${next.company} interview is in ${next.daysAway} days.`
              : "What would you like to prepare for?"
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
          <StatPill href="/interviews" icon={Calendar}>
            {upcomingCount} upcoming
          </StatPill>
          <StatPill href="/cv" icon={FileText}>
            CV score {MASTER_CV.score}
          </StatPill>
          {lastMock && (
            <StatPill href={`/history/${lastMock.id}`} icon={Mic}>
              Last mock {lastMock.score}
            </StatPill>
          )}
        </div>

        <div className={styles.choiceGrid}>
          <HomeChoiceCard
            href="/mock"
            variant="interview"
            eyebrow="I have an interview"
            title="Prepare for interview"
            subtitle={
              next
                ? `Mock practice & prep for ${next.company}`
                : "AI mock interviews & role prep"
            }
            cta="Start practice"
            avatarPose="presenting"
            avatarAlt="AI coach ready to mock interview"
          />
          <HomeChoiceCard
            href="/cv"
            variant="apply"
            eyebrow="I'm applying"
            title="Get ready to apply"
            subtitle="Improve & tailor your CV for roles"
            cta="Improve CV"
            avatarPose="thinking"
            avatarAlt="AI coach helping with your CV"
          />
        </div>

        <section className={styles.quickSection}>
          <h2 className={styles.quickTitle}>Quick actions</h2>
          <div className={styles.quickStack}>
            {QUICK_ACTIONS.map((action) => (
              <QuickActionRow key={action.href} {...action} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav active="home" />
    </Phone>
  );
}
