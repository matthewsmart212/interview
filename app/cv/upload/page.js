"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import { Upload, Check, FileText } from "../../../components/Icons";
import s from "../cvhub.module.css";

const PARSED = [
  "2 jobs found — H&M and Greggs",
  "6 skills detected",
  "Education added",
  "Contact details captured",
];

export default function CvUploadPage() {
  // idle -> parsing -> done
  const [stage, setStage] = useState("idle");

  useEffect(() => {
    if (stage !== "parsing") return undefined;
    const t = setTimeout(() => setStage("done"), 2200);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <Phone>
      <TopBar title="Upload CV" backHref="/cv/start" />
      <div className="screen screen-pad">
        {stage === "idle" && (
          <div className="anim-fade-up">
            <h1 className="page-h1">Upload your CV</h1>
            <p className="page-sub">
              We&apos;ll read it, score it and use it across all your
              interviews.
            </p>

            <button
              className={s.dropzone}
              style={{ marginTop: 24 }}
              onClick={() => setStage("parsing")}
            >
              <span className={s.dropIcon}>
                <Upload size={26} />
              </span>
              <div className={s.dropTitle}>Tap to choose a file</div>
              <div className={s.dropSub}>or drag &amp; drop it here</div>
              <div className={s.formats}>
                <span>PDF</span>
                <span>DOCX</span>
                <span>TXT</span>
              </div>
            </button>

            <p className="page-sub" style={{ textAlign: "center", marginTop: 18 }}>
              Don&apos;t have one?{" "}
              <Link href="/cv/create" className="link-btn">
                Create a CV instead
              </Link>
            </p>
          </div>
        )}

        {stage === "parsing" && (
          <div className={`${s.parseWrap} anim-fade-up`}>
            <div className={s.spinner} aria-hidden />
            <h1 className="page-h1">Reading your CV...</h1>
            <p className="page-sub" style={{ marginTop: 10 }}>
              Picking out your experience, skills and achievements.
            </p>
          </div>
        )}

        {stage === "done" && (
          <div className="anim-fade-up">
            <div className={s.parseWrap} style={{ paddingTop: 18 }}>
              <span
                className={s.dropIcon}
                style={{ background: "var(--green-050)", color: "var(--green)" }}
              >
                <FileText size={26} />
              </span>
              <h1 className="page-h1">CV uploaded!</h1>
              <p className="page-sub" style={{ marginTop: 8 }}>
                Here&apos;s what we found:
              </p>
            </div>

            <div className={`card ${s.parsedList}`}>
              {PARSED.map((p) => (
                <div className="suggest" key={p}>
                  <span className="check">
                    <Check size={15} stroke={3} />
                  </span>
                  <span className="s-text">{p}</span>
                </div>
              ))}
            </div>

            <Link href="/cv" className="btn btn-primary" style={{ marginTop: 20 }}>
              Looks right — continue
            </Link>
            <button
              className="btn btn-ghost"
              style={{ marginTop: 6 }}
              onClick={() => setStage("idle")}
            >
              Upload a different file
            </button>
          </div>
        )}
      </div>
    </Phone>
  );
}
