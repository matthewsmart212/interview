"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Phone from "../../components/Phone";
import PageHeader from "../../components/PageHeader";
import { Calendar, Sparkle } from "../../components/Icons";

const SAMPLE_JD =
  "We're looking for a friendly and reliable Customer Service Advisor to join our team. You'll be talking to customers, solving problems and making sure every customer has a great experience...";

export default function SetupPage() {
  const router = useRouter();
  const [type, setType] = useState("In-person");
  const [jobRole, setJobRole] = useState("Customer Service Advisor");
  const [company, setCompany] = useState("Tesco");
  const [date, setDate] = useState("24 May 2025");
  const [jd, setJd] = useState(SAMPLE_JD);

  return (
    <Phone>
      <div className="screen screen-pad has-app-header">
        <PageHeader
          icon="sparkle"
          title="Get started"
          description="Tell us what you're preparing for"
          back
          backHref="/"
          right={<span className="step-count">Step 1 of 4</span>}
        />
        <h1 className="page-h1">Let&apos;s get you ready!</h1>

        <p className="form-h" style={{ marginTop: 22 }}>
          What are you preparing for?
        </p>

        <div className="field">
          <label>Job role</label>
          <input
            className="input"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
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

        <div className="field">
          <label>Paste the job description</label>
          <textarea
            className="textarea"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the job description here..."
          />
          <button
            className="link-btn"
            style={{ marginTop: 8 }}
            onClick={() => setJd(SAMPLE_JD)}
          >
            Use sample job description
          </button>
        </div>

        <button
          className="btn btn-primary"
          style={{ marginTop: 8 }}
          onClick={() => router.push("/home")}
        >
          Continue
        </button>
      </div>
    </Phone>
  );
}
