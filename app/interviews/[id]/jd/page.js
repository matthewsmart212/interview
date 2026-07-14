"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell, SheetBack, PrimaryButton } from "../../../../components/ui";
import { Sparkle } from "../../../../components/Icons";
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
      <AppShell
        navActive="interviews"
        noNav
        coachPose="idle"
        coachTitle="Hmm…"
        coachSpeech="I can't find that interview."
      >
        <SheetBack href="/interviews">Interviews</SheetBack>
        <div className={s.empty}>
          <div className={s.emptyTitle}>Interview not found</div>
          <PrimaryButton href="/interviews" style={{ marginTop: 16 }}>
            Back to my interviews
          </PrimaryButton>
        </div>
      </AppShell>
    );
  }

  if (iv.hasJD) {
    return (
      <AppShell
        navActive="interviews"
        noNav
        coachPose="presenting"
        coachTitle="Job description"
        coachSpeech={`This is what I'll base your ${iv.company} mock questions on.`}
      >
        <SheetBack href={`/interviews/${iv.id}`}>Prep plan</SheetBack>
        <p className={s.sheetTitle}>
          {iv.role} at {iv.company}
        </p>

        <p className="section-title" style={{ marginTop: 18 }}>
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

        <p className="section-title" style={{ marginTop: 22 }}>
          Full description
        </p>
        <div className={s.jdCard}>
          <p className={s.jdText}>{iv.jd}</p>
        </div>

        <button type="button" className="btn btn-soft" style={{ marginTop: 18 }}>
          Replace job description
        </button>
      </AppShell>
    );
  }

  return (
    <AppShell
      navActive="interviews"
      noNav
      coachPose={saved ? "thumbsup" : "idle"}
      coachTitle={saved ? "Got it" : "Add the JD"}
      coachSpeech={
        saved
          ? `Your mock questions for ${iv.company} are now personalised.`
          : `Paste the listing and I'll shape the questions for ${iv.company}.`
      }
    >
      <SheetBack href={`/interviews/${iv.id}`}>Prep plan</SheetBack>

      {!saved ? (
        <>
          <div className="field">
            <label>Job description</label>
            <textarea
              className="textarea"
              style={{ minHeight: 160 }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the job description here..."
            />
            <button
              type="button"
              className="link-btn"
              style={{ marginTop: 8 }}
              onClick={() => setText(SAMPLE_JD)}
            >
              Use sample job description
            </button>
          </div>

          <button
            type="button"
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
          <p className={s.sheetTitle} style={{ textAlign: "center" }}>
            Job description analysed
          </p>
          <p className="page-sub" style={{ margin: "10px auto 26px", maxWidth: 280 }}>
            Your mock questions for {iv.company} are now personalised to this
            exact role.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.push(`/interviews/${iv.id}`)}
          >
            Back to prep plan
          </button>
        </div>
      )}
    </AppShell>
  );
}
