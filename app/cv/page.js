import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import {
  AppShell,
  PageSection,
  CVScoreCard,
  ActionRow,
} from "../../components/ui";
import {
  Sparkle,
  Download,
  Upload,
  ChevronRight,
  Shield,
  Plus,
} from "../../components/Icons";
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
      />

      <div className="stack" style={{ marginTop: 14 }}>
        <ActionRow
          href="/cv/improve"
          icon={Sparkle}
          title="Improve my CV"
          subtitle="AI suggestions to lift your score"
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
          <div className="card">
            {tailored.map((iv) => (
              <Link href={`/interviews/${iv.id}/cv`} className={s.tRow} key={iv.id}>
                <span className={s.tLogo}>{iv.initials}</span>
                <span className={s.tBody}>
                  <span className={s.tTitle}>
                    {iv.role} · {iv.company}
                  </span>
                  <span className={s.tSub}>
                    Updated {iv.tailoredCv.updatedAt}
                  </span>
                </span>
                <span className={s.tScore}>{iv.tailoredCv.score}%</span>
                <ChevronRight size={17} className="chev" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-sub" style={{ marginBottom: 14 }}>
              No tailored versions yet. Open one of your interviews to create
              one.
            </p>
            <Link href="/interviews" className="btn btn-secondary btn-pill">
              <Plus size={16} /> Tailor for an interview
            </Link>
          </div>
        )}
      </PageSection>

      <div className={s.note} style={{ marginTop: 18 }}>
        <Shield size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          Your original CV never changes — each interview gets its own tailored
          copy.
        </span>
      </div>

      <p className="page-sub" style={{ textAlign: "center", marginTop: 20 }}>
        Starting fresh?{" "}
        <Link href="/cv/start" className="link-btn">
          Upload or create a new CV
        </Link>
      </p>
    </AppShell>
  );
}
