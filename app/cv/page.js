import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import Avatar from "../../components/Avatar";
import {
  AppShell,
  PageSection,
  CVScoreCard,
  TailoredCVCard,
  EmptyStateCard,
  PrimaryButton,
  CvHistoryDropdown,
} from "../../components/ui";
import { Sparkle, Download, Upload, Shield, Plus } from "../../components/Icons";
import { MASTER_CV, INTERVIEWS, CV_HISTORY } from "../../lib/app-data";
import s from "./cvhub.module.css";

export default function CvHubPage() {
  const tailored = INTERVIEWS.filter((iv) => iv.tailoredCv.exists);

  return (
    <AppShell navActive="cv">
      <PageHeader
        icon="fileText"
        title="My CV"
        description="Improve, tailor and download your CV"
      />

      <CVScoreCard
        fileName={MASTER_CV.fileName}
        meta={`Original CV · updated ${MASTER_CV.updatedAt}`}
        score={MASTER_CV.score}
        featured
      />

      <div className={s.actionGrid}>
        <div className={s.actionCol}>
          <Link href="/cv/improve" className={s.improveCard}>
            <div className={s.improveVisual} aria-hidden>
              <div className={s.textScrim} />
              <span className={s.improveBadge}>
                <Sparkle size={14} />
              </span>
              <div className={s.avatarStage}>
                <Avatar
                  pose="thinking"
                  alt="AI coach helping improve your CV"
                  className={s.avatar}
                />
              </div>
            </div>
            <div className={s.improveCopy}>
              <span className={s.improveTitle}>Improve my CV</span>
              <span className={s.improveSub}>AI suggestions to lift your score</span>
            </div>
          </Link>
        </div>

        <div className={s.actionCol}>
          <div className={s.actionSide}>
            <Link href="/cv/upload" className={s.sideCard}>
              <span className={s.sideIcon} aria-hidden>
                <Upload size={18} />
              </span>
              <span className={s.sideBody}>
                <span className={s.sideTitle}>Replace my CV</span>
                <span className={s.sideSub}>Upload a newer version</span>
              </span>
            </Link>
            <button type="button" className={s.sideCard}>
              <span className={s.sideIcon} aria-hidden>
                <Download size={18} />
              </span>
              <span className={s.sideBody}>
                <span className={s.sideTitle}>Download my CV</span>
                <span className={s.sideSub}>PDF, ready to send</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <PageSection title="Tailored versions">
        {tailored.length > 0 ? (
          <div className={`stack ${s.tailoredStack}`}>
            {tailored.map((iv) => (
              <TailoredCVCard interview={iv} key={iv.id} />
            ))}
          </div>
        ) : (
          <EmptyStateCard
            title="No tailored versions yet"
            description="Open one of your interviews to create a version tailored to that role."
          >
            <PrimaryButton href="/interviews">
              <Plus size={16} /> Tailor for an interview
            </PrimaryButton>
          </EmptyStateCard>
        )}
      </PageSection>

      <div className={s.note}>
        <Shield size={16} className={s.noteIcon} aria-hidden />
        <span>
          Your original CV never changes — each interview gets its own tailored
          copy.
        </span>
      </div>

      <p className={s.footerNote}>
        Starting fresh?{" "}
        <Link href="/cv/start" className="link-btn">
          Upload or create a new CV
        </Link>
      </p>

      <CvHistoryDropdown items={CV_HISTORY} />
    </AppShell>
  );
}
