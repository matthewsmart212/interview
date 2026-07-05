"use client";

import { useState } from "react";
import Link from "next/link";
import Phone from "../../../components/Phone";
import AppHeader from "../../../components/AppHeader";
import PageHeader from "../../../components/PageHeader";
import { Calendar, FileText, Sparkle, Check, Plus } from "../../../components/Icons";
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

  const canContinueDetails = role.trim().length > 0;

  return (
    <Phone>
      <AppHeader />
      <div className="screen screen-pad has-app-header">
        <PageHeader
          icon="plus"
          title="Add Interview"
          description="Build your prep plan around it"
          back={step === 0}
          backHref={step === 0 ? "/interviews" : undefined}
          left={
            step > 0 && step < 2 ? (
              <button className="link-btn" onClick={() => setStep(step - 1)}>
                Back
              </button>
            ) : undefined
          }
          right={
            <span className="step-count">
              Step {Math.min(step + 1, 3)} of 3
            </span>
          }
        />
        <div className={s.stepDots} aria-hidden>
          {[0, 1, 2].map((i) => (
            <i key={i} className={i <= step ? "on" : ""} />
          ))}
        </div>

        {step === 0 && (
          <div className="anim-fade-up">
            <h1 className="page-h1">Tell us about the interview</h1>
            <p className="page-sub">
              We&apos;ll build your prep plan around it.
            </p>

            <div className="field" style={{ marginTop: 22 }}>
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
            <h1 className="page-h1">Got the job description?</h1>
            <p className="page-sub">
              With it we can tailor your CV and ask questions this employer
              would actually ask.
            </p>

            <div style={{ marginTop: 22 }}>
              <button
                className={`${s.choiceCard}${jdChoice === "paste" ? " " + s.active : ""}`}
                onClick={() => setJdChoice("paste")}
              >
                <span className={s.choiceIcon}>
                  <FileText size={20} />
                </span>
                <span>
                  <span className={s.choiceTitle}>Yes, paste it in</span>
                  <span className={s.choiceSub}>
                    Tailored questions, CV matching & keyword tips
                  </span>
                </span>
              </button>

              <button
                className={`${s.choiceCard}${jdChoice === "skip" ? " " + s.active : ""}`}
                onClick={() => setJdChoice("skip")}
              >
                <span className={s.choiceIcon}>
                  <Sparkle size={20} />
                </span>
                <span>
                  <span className={s.choiceTitle}>Not right now</span>
                  <span className={s.choiceSub}>
                    No problem — we&apos;ll use great generic questions for this
                    role
                  </span>
                </span>
              </button>
            </div>

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
                  className="link-btn"
                  style={{ marginTop: 8 }}
                  onClick={() => setJd(SAMPLE_JD)}
                >
                  Use sample job description
                </button>
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{
                marginTop: 14,
                opacity:
                  jdChoice === "skip" || (jdChoice === "paste" && jd.trim())
                    ? 1
                    : 0.5,
              }}
              disabled={!(jdChoice === "skip" || (jdChoice === "paste" && jd.trim()))}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
            {jdChoice === "skip" && (
              <p className={s.skipNote}>
                You can add the job description any time from the interview
                page.
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className={`${s.doneWrap} anim-fade-up`}>
            <span className={s.doneIcon}>
              <Check size={38} stroke={3} />
            </span>
            <h1 className="page-h1">
              {role.trim() || "Interview"} added!
            </h1>
            <p className="page-sub" style={{ margin: "10px auto 26px", maxWidth: 280 }}>
              {company.trim() ? `${company} · ` : ""}
              {type}
              {date.trim() ? ` · ${date}` : ""}
              <br />
              Your prep plan is ready — let&apos;s get you confident.
            </p>
            <Link href="/interviews/tesco-csa" className="btn btn-primary">
              Open my prep plan
            </Link>
            <Link
              href="/interviews"
              className="btn btn-ghost"
              style={{ marginTop: 8 }}
            >
              Back to my interviews
            </Link>
          </div>
        )}
      </div>
    </Phone>
  );
}
