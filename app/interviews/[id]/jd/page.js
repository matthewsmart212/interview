"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Phone from "../../../../components/Phone";
import PageHeader from "../../../../components/PageHeader";
import { Sparkle, FileText } from "../../../../components/Icons";
import { getInterview, saveInterviewJd } from "../../../../lib/db";
import { useAppDb } from "../../../../lib/db/use-app-db";
import s from "../../interviews.module.css";

const SAMPLE_JD =
  "We're looking for a friendly and reliable team member to join us. You'll be talking to customers, solving problems and making sure everyone has a great experience...";

export default function JobDescriptionPage() {
  const { id } = useParams();
  const router = useRouter();
  useAppDb();
  const iv = getInterview(id);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  if (!iv) {
    return (
      <Phone>
        <div className="screen screen-pad has-app-header">
          <PageHeader
            icon="fileText"
            title="Job Description"
            description="View and manage the job listing"
            back
            backHref="/interviews"
          />
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

  /* -------- has a JD: show it + what we extracted -------- */
  if (iv.hasJD) {
    return (
      <Phone>
        <div className="screen screen-pad has-app-header">
          <PageHeader
            icon="fileText"
            title="Job Description"
            description="What your questions and CV tips are based on"
            back
            backHref={`/interviews/${iv.id}`}
          />
          <h1 className="page-h1">
            {iv.role} at {iv.company}
          </h1>
          <p className="page-sub">
            This is what your questions and CV tips are based on.
          </p>

          <p className="section-title" style={{ marginTop: 22 }}>
            What we picked out
          </p>
          <div className="card">
            {iv.jdHighlights.map((h) => (
              <div className={s.jdHighlight} key={h}>
                <span className={s.jdDot} aria-hidden />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <p className="section-title" style={{ marginTop: 24 }}>
            Full description
          </p>
          <div className={s.jdCard}>
            <p className={s.jdText}>{iv.jd}</p>
          </div>

          <button className="btn btn-soft" style={{ marginTop: 20 }}>
            Replace job description
          </button>
        </div>
      </Phone>
    );
  }

  /* -------- no JD yet: paste it in -------- */
  return (
    <Phone>
      <div className="screen screen-pad has-app-header">
        <PageHeader
          icon="fileText"
          title="Add Job Description"
          description="Paste the employer's job listing"
          back
          backHref={`/interviews/${iv.id}`}
        />
        {!saved ? (
          <>
            <h1 className="page-h1">Add the job description</h1>
            <p className="page-sub">
              Paste it below and we&apos;ll tailor your mock questions and CV
              for {iv.company}.
            </p>

            <div className="field" style={{ marginTop: 22 }}>
              <label>Job description</label>
              <textarea
                className="textarea"
                style={{ minHeight: 180 }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the job description here..."
              />
              <button
                className="link-btn"
                style={{ marginTop: 8 }}
                onClick={() => setText(SAMPLE_JD)}
              >
                Use sample job description
              </button>
            </div>

            <button
              className="btn btn-primary"
              style={{ opacity: text.trim() ? 1 : 0.5 }}
              disabled={!text.trim()}
              onClick={() => {
                saveInterviewJd(id, text);
                setSaved(true);
              }}
            >
              Save & analyse <Sparkle size={17} />
            </button>
            <p className={s.skipNote}>
              No job description? Your mock interviews will use strong generic{" "}
              {iv.role} questions instead.
            </p>
          </>
        ) : (
          <div className={`${s.doneWrap} anim-fade-up`}>
            <span className={s.doneIcon}>
              <Sparkle size={34} />
            </span>
            <h1 className="page-h1">Job description analysed!</h1>
            <p className="page-sub" style={{ margin: "10px auto 26px", maxWidth: 280 }}>
              Your questions and CV tips for {iv.company} are now tailored to
              this exact role.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/interviews/${iv.id}`)}
            >
              Back to prep plan
            </button>
          </div>
        )}
      </div>
    </Phone>
  );
}
