"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Phone from "../../../components/Phone";
import PageHeader from "../../../components/PageHeader";
import { Upload, Check, FileText } from "../../../components/Icons";
import { uploadMasterCv } from "../../../lib/db";
import s from "../cvhub.module.css";

export default function CvUploadPage() {
  const [stage, setStage] = useState("idle"); // idle | parsing | done | error
  const [fileName, setFileName] = useState("My-CV.pdf");
  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState("");
  const [findings, setFindings] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  async function parseFile(file) {
    setError("");
    setFileName(file.name || "My-CV.pdf");
    setStage("parsing");

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/cv/parse", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Parse failed");

      setScore(data.score);
      setSummary(data.summary || "");
      const nextFindings = [];
      if (data.strengths?.length) {
        nextFindings.push(...data.strengths.slice(0, 3));
      } else if (data.summary) {
        nextFindings.push(data.summary);
      }
      if (data.gaps?.length) {
        nextFindings.push(`Improve: ${data.gaps[0]}`);
      }
      if (!nextFindings.length) {
        nextFindings.push("Experience & skills captured", "Ready to score and tailor");
      }
      setFindings(nextFindings);
      setStage("done");
    } catch (err) {
      setError(err?.message || "Could not read that file.");
      setStage("error");
    }
  }

  const finishUpload = () => {
    uploadMasterCv({
      fileName,
      score: score ?? 72,
      summary:
        summary ||
        "Uploaded CV ready for scoring, tailoring and mock interview practice.",
    });
    router.push("/cv");
  };

  return (
    <Phone>
      <div className="screen screen-pad has-app-header">
        <PageHeader
          icon="upload"
          title="Upload CV"
          description="PDF or DOCX — we'll read and score it"
          back
          backHref="/cv/start"
        />
        {stage === "idle" && (
          <div className="anim-fade-up">
            <h1 className="page-h1">Upload your CV</h1>
            <p className="page-sub">
              We&apos;ll read it, score it and use it across all your interviews.
            </p>

            <button
              className={s.dropzone}
              style={{ marginTop: 24 }}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (file) parseFile(file);
                };
                input.click();
              }}
            >
              <span className={s.dropIcon}>
                <Upload size={26} />
              </span>
              <div className={s.dropTitle}>Tap to choose a file</div>
              <div className={s.dropSub}>or drag &amp; drop it here</div>
              <div className={s.formats}>
                <span>PDF</span>
                <span>DOCX</span>
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
              Extracting text and scoring with AI.
            </p>
          </div>
        )}

        {stage === "error" && (
          <div className="anim-fade-up">
            <h1 className="page-h1">Couldn&apos;t read that file</h1>
            <p className="page-sub" style={{ marginTop: 10 }}>
              {error || "Try a PDF or DOCX."}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 20 }}
              onClick={() => setStage("idle")}
            >
              Try again
            </button>
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
                {typeof score === "number" ? `Score ${score}/100. ` : ""}
                Here&apos;s what we found:
              </p>
            </div>

            <div className={`card ${s.parsedList}`}>
              {findings.map((p) => (
                <div className="suggest" key={p}>
                  <span className="check">
                    <Check size={15} stroke={3} />
                  </span>
                  <span className="s-text">{p}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 20 }}
              onClick={finishUpload}
            >
              Looks right — continue
            </button>
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
