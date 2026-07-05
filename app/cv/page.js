import Link from "next/link";
import Phone from "../../components/Phone";
import AppHeader from "../../components/AppHeader";
import PageHeader from "../../components/PageHeader";
import BottomNav from "../../components/BottomNav";
import {
  FileText,
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
    <Phone>
      <AppHeader />
      <div className="screen screen-pad has-nav has-app-header">
        <PageHeader
          icon="fileText"
          title="My CV"
          description="Improve, tailor and download your CV"
        />
        {/* master CV card */}
        <div className={`card ${s.fileCard}`}>
          <span className={s.fileIcon}>
            <FileText size={24} />
          </span>
          <span className={s.fileBody}>
            <span className={s.fileName}>{MASTER_CV.fileName}</span>
            <span className={s.fileMeta}>
              Original CV · updated {MASTER_CV.updatedAt}
            </span>
          </span>
          <span className={s.scorePill}>
            <b>{MASTER_CV.score}</b>
            <span>SCORE</span>
          </span>
        </div>

        <div className="stack" style={{ marginTop: 14 }}>
          <Link href="/cv/improve" className="action-row">
            <span className="ar-icon">
              <Sparkle size={22} />
            </span>
            <span className="ar-body">
              <span className="ar-title">Improve my CV</span>
              <span className="ar-sub">
                AI suggestions to lift your score
              </span>
            </span>
            <ChevronRight size={20} className="chev" />
          </Link>
          <Link href="/cv/upload" className="action-row">
            <span className="ar-icon">
              <Upload size={22} />
            </span>
            <span className="ar-body">
              <span className="ar-title">Replace my CV</span>
              <span className="ar-sub">Upload a newer version</span>
            </span>
            <ChevronRight size={20} className="chev" />
          </Link>
          <button className="action-row" style={{ border: "none", textAlign: "left" }}>
            <span className="ar-icon">
              <Download size={22} />
            </span>
            <span className="ar-body">
              <span className="ar-title">Download my CV</span>
              <span className="ar-sub">PDF, ready to send</span>
            </span>
            <ChevronRight size={20} className="chev" />
          </button>
        </div>

        {/* tailored versions */}
        <p className="section-title" style={{ marginTop: 26 }}>
          Tailored versions
        </p>
        {tailored.length > 0 ? (
          <div className="card">
            {tailored.map((iv) => (
              <Link
                href={`/interviews/${iv.id}/cv`}
                className={s.tRow}
                key={iv.id}
              >
                <span className={s.tLogo} style={{ background: iv.accent }}>
                  {iv.initials}
                </span>
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
          <div className="card" style={{ textAlign: "center", padding: 22 }}>
            <p className="page-sub" style={{ marginBottom: 14 }}>
              No tailored versions yet. Open one of your interviews to create
              one.
            </p>
            <Link href="/interviews" className="btn btn-soft">
              <Plus size={16} /> Tailor for an interview
            </Link>
          </div>
        )}

        <div className={s.note} style={{ marginTop: 18 }}>
          <Shield size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Your original CV never changes — each interview gets its own
            tailored copy.
          </span>
        </div>

        <p className="page-sub" style={{ textAlign: "center", marginTop: 20 }}>
          Starting fresh?{" "}
          <Link href="/cv/start" className="link-btn">
            Upload or create a new CV
          </Link>
        </p>
      </div>
      <BottomNav active="cv" />
    </Phone>
  );
}
