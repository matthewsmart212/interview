import Link from "next/link";
import Phone from "../../components/Phone";
import PageHeader from "../../components/PageHeader";
import BottomNav from "../../components/BottomNav";
import Avatar from "../../components/Avatar";
import { FileText, Mic, Plus, Calendar } from "../../components/Icons";
import { USER, INTERVIEWS, MASTER_CV, MOCK_HISTORY } from "../../lib/app-data";
import styles from "./home.module.css";

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

        <div className={styles.pathGrid}>
          <Link href="/mock" className={`${styles.pathCard} ${styles.pathInterview}`}>
            <div className={styles.pathText}>
              <span className={styles.pathEyebrow}>I have an interview</span>
              <h2 className={styles.pathTitle}>Prepare for interview</h2>
              <p className={styles.pathSub}>
                {next
                  ? `Mock practice & prep for ${next.company}`
                  : "AI mock interviews & role prep"}
              </p>
            </div>
            <Avatar
              pose="presenting"
              alt="AI coach ready to mock interview"
              className={styles.pathAvatar}
            />
          </Link>

          <Link href="/cv" className={`${styles.pathCard} ${styles.pathApply}`}>
            <div className={styles.pathText}>
              <span className={styles.pathEyebrow}>I&apos;m applying</span>
              <h2 className={styles.pathTitle}>Prepare to apply</h2>
              <p className={styles.pathSub}>
                Improve & tailor your CV for roles
              </p>
            </div>
            <Avatar
              pose="welcoming"
              alt="AI coach helping with your CV"
              className={styles.pathAvatar}
            />
          </Link>
        </div>
      </div>

      <BottomNav active="home" />
    </Phone>
  );
}
