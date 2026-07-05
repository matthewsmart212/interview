"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Phone from "../../../../components/Phone";
import AppHeader from "../../../../components/AppHeader";
import PageHeader from "../../../../components/PageHeader";
import {
  CheckCircle,
  Sparkle,
  Download,
  Shield,
} from "../../../../components/Icons";
import { getInterview, MASTER_CV } from "../../../../lib/app-data";
import s from "../../interviews.module.css";

export default function TailoredCvPage() {
  const { id } = useParams();
  const iv = getInterview(id);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  if (!iv) {
    return (
      <Phone>
        <AppHeader />
        <div className="screen screen-pad has-app-header">
          <PageHeader title="Tailored CV" back backHref="/interviews" />
          <div className={s.empty}>
            <div className={s.emptyTitle}>Interview not found</div>
            <Link href="/interviews" className="btn btn-primary" style={{ marginTop: 16 }}>
              Back to my interviews
            </Link>
          </div>
        </div>
      </Phone>
    );
  }

  const hasTailored = iv.tailoredCv.exists || generated;
  const tailored = iv.tailoredCv.exists
    ? iv.tailoredCv
    : {
        score: 85,
        updatedAt: "Just now",
        changes: [
          `Summary rewritten around the ${iv.role} role`,
          "Most relevant experience moved to the top",
          "Skills reordered to match what employers ask for",
        ],
      };

  /* -------- no tailored CV yet -------- */
  if (!hasTailored) {
    return (
      <Phone>
        <AppHeader />
        <div className="screen screen-pad has-app-header">
          <PageHeader
            title="Tailor My CV"
            back
            backHref={`/interviews/${iv.id}`}
          />
          <h1 className="page-h1">
            Tailor your CV for {iv.company}
          </h1>
          <p className="page-sub">
            We&apos;ll create a version of your CV aimed at this exact role.
            Your original CV never changes.
          </p>

          <div className={s.cvCompare} style={{ marginTop: 22 }}>
            <div className={s.cvCol}>
              <div className={s.cvColLab}>Original CV</div>
              <div className={s.cvColScore}>{MASTER_CV.score}%</div>
              <div className={s.cvColSub}>match for this role</div>
            </div>
            <div className={`${s.cvCol} ${s.brand}`}>
              <div className={s.cvColLab}>Tailored CV</div>
              <div className={s.cvColScore}>~85%</div>
              <div className={s.cvColSub}>estimated after tailoring</div>
            </div>
          </div>

          {!iv.hasJD && (
            <div className={s.keepNote}>
              <Sparkle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                Tip: add the job description first and tailoring gets much more
                accurate.{" "}
                <Link href={`/interviews/${iv.id}/jd`} style={{ fontWeight: 700 }}>
                  Add it now →
                </Link>
              </span>
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => {
              setGenerating(true);
              setTimeout(() => {
                setGenerating(false);
                setGenerated(true);
              }, 1600);
            }}
          >
            {generating ? "Tailoring your CV..." : "Tailor my CV"}{" "}
            {!generating && <Sparkle size={17} />}
          </button>

          <div className={s.keepNote} style={{ marginTop: 18 }}>
            <Shield size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Your original CV stays untouched — every interview gets its own
              tailored copy.
            </span>
          </div>
        </div>
      </Phone>
    );
  }

  /* -------- tailored CV exists -------- */
  return (
    <Phone>
      <AppHeader />
      <div className="screen screen-pad has-app-header">
        <PageHeader
          title="Tailored CV"
          back
          backHref={`/interviews/${iv.id}`}
        />
        <h1 className="page-h1">
          CV for {iv.role} at {iv.company}
        </h1>
        <p className="page-sub">Updated {tailored.updatedAt}</p>

        <div className={s.cvCompare} style={{ marginTop: 20 }}>
          <div className={s.cvCol}>
            <div className={s.cvColLab}>Original CV</div>
            <div className={s.cvColScore}>{MASTER_CV.score}%</div>
            <div className={s.cvColSub}>match for this role</div>
          </div>
          <div className={`${s.cvCol} ${s.brand}`}>
            <div className={s.cvColLab}>Tailored CV</div>
            <div className={s.cvColScore}>{tailored.score}%</div>
            <div className={s.cvColSub}>match for this role</div>
          </div>
        </div>

        <p className="section-title" style={{ marginTop: 24 }}>
          What we changed
        </p>
        <div className="card">
          {tailored.changes.map((c) => (
            <div className={s.changeRow} key={c}>
              <span className={s.changeIcon}>
                <CheckCircle size={17} />
              </span>
              <span>{c}</span>
            </div>
          ))}
        </div>

        <div className={s.keepNote}>
          <Shield size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Your original CV is safe. This tailored version belongs to this
            interview only.
          </span>
        </div>

        <button className="btn btn-primary" style={{ marginTop: 20 }}>
          <Download size={18} /> Download tailored CV (PDF)
        </button>
        <button className="btn btn-ghost" style={{ marginTop: 6 }}>
          Re-tailor with latest CV
        </button>
      </div>
    </Phone>
  );
}
