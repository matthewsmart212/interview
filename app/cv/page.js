import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import {
  AppShell,
  PageSection,
  CVScoreCard,
  ActionRow,
  TailoredCVCard,
  EmptyStateCard,
  PrimaryButton,
} from "../../components/ui";
import { Sparkle, Download, Upload, Shield, Plus } from "../../components/Icons";
import { MASTER_CV, INTERVIEWS } from "../../lib/app-data";
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

      <div className={`stack ${s.actionStack}`}>
        <ActionRow
          href="/cv/improve"
          icon={Sparkle}
          title="Improve my CV"
          subtitle="AI suggestions to lift your score"
          className={s.primaryAction}
        />
        <ActionRow
          href="/cv/upload"
          icon={Upload}
          title="Replace my CV"
          subtitle="Upload a newer version"
        />
        <ActionRow
          icon={Download}
          title="Download my CV"
          subtitle="PDF, ready to send"
        />
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
    </AppShell>
  );
}
