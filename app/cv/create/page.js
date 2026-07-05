"use client";

import { useState } from "react";
import Link from "next/link";
import Phone from "../../../components/Phone";
import AppHeader from "../../../components/AppHeader";
import PageHeader from "../../../components/PageHeader";
import { Plus, Check, Sparkle } from "../../../components/Icons";
import s from "../cvhub.module.css";
import i from "../../interviews/interviews.module.css";

const SKILL_OPTIONS = [
  "Customer service",
  "Teamwork",
  "Communication",
  "Working under pressure",
  "Cash handling",
  "Problem solving",
  "Time management",
  "Leadership",
];

export default function CvCreatePage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [about, setAbout] = useState("");
  const [jobs, setJobs] = useState([
    { role: "Sales Assistant", company: "H&M", period: "2023 — Present" },
  ]);
  const [skills, setSkills] = useState(["Customer service", "Teamwork"]);

  const toggleSkill = (sk) =>
    setSkills((prev) =>
      prev.includes(sk) ? prev.filter((x) => x !== sk) : [...prev, sk]
    );

  return (
    <Phone>
      <AppHeader />
      <div className="screen screen-pad has-app-header">
        <PageHeader
          title="Create CV"
          back={step === 0}
          backHref={step === 0 ? "/cv/start" : undefined}
          left={
            step > 0 && step < 3 ? (
              <button className="link-btn" onClick={() => setStep(step - 1)}>
                Back
              </button>
            ) : undefined
          }
          right={
            <span className="step-count">
              Step {Math.min(step + 1, 4)} of 4
            </span>
          }
        />
        <div className={i.stepDots} aria-hidden>
          {[0, 1, 2, 3].map((n) => (
            <i key={n} className={n <= step ? "on" : ""} />
          ))}
        </div>

        {step === 0 && (
          <div className="anim-fade-up">
            <h1 className="page-h1">About you</h1>
            <p className="page-sub">The basics that go at the top of your CV.</p>

            <div className="field" style={{ marginTop: 22 }}>
              <label>Full name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div className="field">
              <label>What kind of work are you looking for?</label>
              <input
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Customer service roles"
              />
            </div>
            <div className="field">
              <label>
                A line about you <span className="opt">(we&apos;ll polish it)</span>
              </label>
              <textarea
                className="textarea"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="e.g. Friendly and reliable, great with people..."
              />
            </div>

            <button
              className="btn btn-primary"
              style={{ opacity: name.trim() ? 1 : 0.5 }}
              disabled={!name.trim()}
              onClick={() => setStep(1)}
            >
              Continue
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="anim-fade-up">
            <h1 className="page-h1">Work experience</h1>
            <p className="page-sub">
              Any jobs, volunteering or work placements count.
            </p>

            <div style={{ marginTop: 22 }}>
              {jobs.map((j, idx) => (
                <div className={s.expCard} key={idx}>
                  <div className={s.expTitle}>
                    {j.role} · {j.company}
                  </div>
                  <div className={s.expMeta}>{j.period}</div>
                </div>
              ))}
            </div>

            <button
              className="btn btn-soft"
              onClick={() =>
                setJobs((prev) => [
                  ...prev,
                  { role: "Team Member", company: "Greggs", period: "2021 — 2023" },
                ])
              }
            >
              <Plus size={17} /> Add another job
            </button>

            <button
              className="btn btn-primary"
              style={{ marginTop: 12 }}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 4 }}
              onClick={() => setStep(2)}
            >
              I don&apos;t have work experience yet
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="anim-fade-up">
            <h1 className="page-h1">Your skills</h1>
            <p className="page-sub">Pick everything that sounds like you.</p>

            <div className={s.chipsWrap} style={{ marginTop: 22 }}>
              {SKILL_OPTIONS.map((sk) => (
                <button
                  key={sk}
                  className={`${s.skillChip}${skills.includes(sk) ? " " + s.on : ""}`}
                  onClick={() => toggleSkill(sk)}
                >
                  {sk}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary"
              style={{ marginTop: 24, opacity: skills.length ? 1 : 0.5 }}
              disabled={!skills.length}
              onClick={() => setStep(3)}
            >
              Build my CV <Sparkle size={17} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className={`${i.doneWrap} anim-fade-up`}>
            <span className={i.doneIcon}>
              <Check size={38} stroke={3} />
            </span>
            <h1 className="page-h1">Your CV is ready!</h1>
            <p className="page-sub" style={{ margin: "10px auto 26px", maxWidth: 280 }}>
              We&apos;ve turned your answers into a clean, professional CV.
              You can improve it any time.
            </p>
            <Link href="/cv" className="btn btn-primary">
              See my CV
            </Link>
            <Link href="/cv/improve" className="btn btn-ghost" style={{ marginTop: 8 }}>
              Get improvement tips
            </Link>
          </div>
        )}
      </div>
    </Phone>
  );
}
