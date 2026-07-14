"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell, SheetBack, PrimaryButton } from "../../../components/ui";
import { Calendar, FileText, Sparkle, Check } from "../../../components/Icons";
import { createInterview } from "../../../lib/db";
import s from "../interviews.module.css";

const SAMPLE_JD =
  "We're looking for a friendly and reliable Customer Service Advisor to join our team. You'll be talking to customers, solving problems and making sure every customer has a great experience...";

export default function NewInterviewPage() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("In-person");
  const [date, setDate] = useState("");
  const [jdChoice, setJdChoice] = useState(null); // "paste" | "skip"
  const [jd, setJd] = useState("");
  const [createdId, setCreatedId] = useState(null);

  const canContinueDetails = role.trim().length > 0;

  const finishCreate = () => {
    const iv = createInterview({
      role,
      company: company.trim() || undefined,
      type,
      date: date.trim() || undefined,
      jd: jdChoice === "paste" ? jd : undefined,
    });
    setCreatedId(iv.id);
    setStep(2);
  };

  const coach =
    step === 0
      ? {
          pose: "presenting",
          title: "Add an interview",
          speech: "Tell me the role — I'll build your prep plan around it.",
        }
      : step === 1
        ? {
            pose: "idle",
            title: "Job description?",
            speech:
              "With the JD I can ask questions this employer would actually ask. Skip if you don't have it yet.",
          }
        : {
            pose: "thumbsup",
            title: "You're on the list",
            speech: "Your prep plan is ready. Let's get you confident.",
          };

  return (
    <AppShell
      navActive="interviews"
      noNav
      coachPose={coach.pose}
      coachTitle={coach.title}
      coachSpeech={coach.speech}
    >
      {step < 2 ? (
        <SheetBack
          href={step === 0 ? "/interviews" : undefined}
          onClick={step > 0 ? () => setStep(step - 1) : undefined}
        >
          {step === 0 ? "Interviews" : "Back"}
        </SheetBack>
      ) : null}

      <div className={s.stepDots} aria-hidden>
        {[0, 1, 2].map((i) => (
          <i key={i} className={i <= step ? "on" : ""} />
        ))}
      </div>

      {step === 0 && (
        <div className="anim-fade-up">
          <div className="field">
            <label>Job role</label>
            <input
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Customer Service Advisor"
            />
          </div>

          <div className="field">
            <label>
              Company <span className="opt">(optional)</span>
            </label>
            <input
              className="input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Tesco"
            />
          </div>

          <div className="field">
            <label>Interview type</label>
            <div className="segmented">
              {["In-person", "Phone", "Video"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={type === t ? "active" : ""}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>
              Interview date <span className="opt">(optional)</span>
            </label>
            <div className="input-icon">
              <input
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Select a date"
              />
              <span className="i">
                <Calendar size={20} />
              </span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 8, opacity: canContinueDetails ? 1 : 0.5 }}
            disabled={!canContinueDetails}
            onClick={() => setStep(1)}
          >
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="anim-fade-up">
          <button
            type="button"
            className={`${s.choiceCard}${jdChoice === "paste" ? " " + s.active : ""}`}
            onClick={() => setJdChoice("paste")}
          >
            <span className={s.choiceIcon}>
              <FileText size={20} />
            </span>
            <span>
              <span className={s.choiceTitle}>Yes, paste it in</span>
              <span className={s.choiceSub}>
                Personalised mock questions for this role
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${s.choiceCard}${jdChoice === "skip" ? " " + s.active : ""}`}
            onClick={() => setJdChoice("skip")}
          >
            <span className={s.choiceIcon}>
              <Sparkle size={20} />
            </span>
            <span>
              <span className={s.choiceTitle}>Not right now</span>
              <span className={s.choiceSub}>
                No problem — we&apos;ll use great generic questions for this role
              </span>
            </span>
          </button>

          {jdChoice === "paste" && (
            <div className="field anim-fade-up" style={{ marginTop: 6 }}>
              <label>Paste the job description</label>
              <textarea
                className="textarea"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
              />
              <button
                type="button"
                className="link-btn"
                style={{ marginTop: 8 }}
                onClick={() => setJd(SAMPLE_JD)}
              >
                Use sample job description
              </button>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            style={{
              marginTop: 14,
              opacity:
                jdChoice === "skip" || (jdChoice === "paste" && jd.trim())
                  ? 1
                  : 0.5,
            }}
            disabled={
              !(jdChoice === "skip" || (jdChoice === "paste" && jd.trim()))
            }
            onClick={finishCreate}
          >
            Continue
          </button>
          {jdChoice === "skip" && (
            <p className={s.skipNote}>
              You can add the job description any time from the interview page.
            </p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className={`${s.doneWrap} anim-fade-up`}>
          <span className={s.doneIcon}>
            <Check size={38} stroke={3} />
          </span>
          <p className={s.sheetTitle} style={{ textAlign: "center" }}>
            {role.trim() || "Interview"} added
          </p>
          <p className="page-sub" style={{ margin: "10px auto 26px", maxWidth: 280 }}>
            {company.trim() ? `${company} · ` : ""}
            {type}
            {date.trim() ? ` · ${date}` : ""}
          </p>
          <PrimaryButton
            href={createdId ? `/interviews/${createdId}` : "/interviews"}
          >
            Open my prep plan
          </PrimaryButton>
          <Link
            href="/interviews"
            className="btn btn-ghost"
            style={{ marginTop: 8 }}
          >
            Back to my interviews
          </Link>
        </div>
      )}
    </AppShell>
  );
}
