import Link from "next/link";
import Phone from "../../../components/Phone";
import AppHeader from "../../../components/AppHeader";
import PageHeader from "../../../components/PageHeader";
import { Upload, Edit, ChevronRight } from "../../../components/Icons";
import s from "../cvhub.module.css";

export default function CvStartPage() {
  return (
    <Phone>
      <AppHeader />
      <div className={`screen screen-pad has-app-header ${s.startWrap}`}>
        <PageHeader title="Your CV" back backHref="/cv" />
        <h1 className="page-h1">Do you have a CV?</h1>
        <p className="page-sub">
          Your CV powers everything — tailored questions, match scores and
          role-specific tips.
        </p>

        <div style={{ marginTop: 24 }}>
          <Link href="/cv/upload" className={s.bigChoice}>
            <span className={s.bigChoiceIcon}>
              <Upload size={25} />
            </span>
            <span style={{ flex: 1 }}>
              <span className={s.bigChoiceTitle}>Yes — upload it</span>
              <span className={s.bigChoiceSub}>
                PDF or Word. We&apos;ll read it and score it in seconds.
              </span>
            </span>
            <ChevronRight size={20} className="chev" />
          </Link>

          <Link href="/cv/create" className={s.bigChoice}>
            <span className={s.bigChoiceIcon}>
              <Edit size={24} />
            </span>
            <span style={{ flex: 1 }}>
              <span className={s.bigChoiceTitle}>No — create one</span>
              <span className={s.bigChoiceSub}>
                Answer a few questions and we&apos;ll build it for you.
              </span>
            </span>
            <ChevronRight size={20} className="chev" />
          </Link>
        </div>

        <p className="page-sub" style={{ textAlign: "center", marginTop: 14 }}>
          You can always replace or rebuild it later.
        </p>
      </div>
    </Phone>
  );
}
