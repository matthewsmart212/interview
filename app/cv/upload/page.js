"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, SheetBack } from "../../../components/ui";
import { Upload, Check, FileText } from "../../../components/Icons";
import { uploadMasterCv } from "../../../lib/db";
import s from "../cvhub.module.css";

export default function CvUploadPage() {
  const [stage, setStage] = useState("idle");
  const [fileName, setFileName] = useState("My-CV.pdf");
  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState("");
  const [text, setText] = useState("");
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
      setText(data.text || "");
      const nextFindings = [];
      if (data.strengths?.length) {
        nextFindings.push(...data.strengths.slice(0, 3));
      } else if (data.summary) {
        nextFindings.push(data.summary);
      }
      if (!nextFindings.length) {
        nextFindings.push("Experience & skills captured", "Ready for mock interviews");
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
        "Your CV — used to personalise mock questions and feedback.",
      text,
    });
    router.push("/profile");
  };

  const coach =
    stage === "parsing"
      ? {
          pose: "idle",
          title: "Reading your CV…",
          speech: "Hang on — I'm pulling out the experience I'll use in mocks.",
        }
      : stage === "error"
        ? {
            pose: "idle",
            title: "Couldn't read that",
            speech: "Try a PDF or DOCX and we'll go again.",
          }
        : stage === "done"
          ? {
              pose: "thumbsup",
              title: "CV ready",
              speech: "I'll use this in every mock — replace it anytime from Profile.",
            }
          : {
              pose: "presenting",
              title: "Your CV",
              speech:
                "Upload one file. I'll use it to ask better questions and give feedback on your real experience.",
            };

  return (
    <AppShell
      noNav
      coachPose={coach.pose}
      coachTitle={coach.title}
      coachSpeech={coach.speech}
    >
      <SheetBack href="/profile">Profile</SheetBack>

      {stage === "idle" && (
        <div className="anim-fade-up">
          <button
            type="button"
            className={s.dropzone}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept =
                ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
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
            <div className={s.dropSub}>PDF or DOCX</div>
            <div className={s.formats}>
              <span>PDF</span>
              <span>DOCX</span>
            </div>
          </button>
        </div>
      )}

      {stage === "parsing" && (
        <div className={`${s.parseWrap} anim-fade-up`}>
          <div className={s.spinner} aria-hidden />
          <p className="page-sub" style={{ marginTop: 10 }}>
            Extracting experience for your mocks.
          </p>
        </div>
      )}

      {stage === "error" && (
        <div className="anim-fade-up">
          <p className="page-sub">{error || "Try a PDF or DOCX."}</p>
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
          <div className={s.parseWrap} style={{ paddingTop: 4 }}>
            <span
              className={s.dropIcon}
              style={{ background: "var(--green-050)", color: "var(--green)" }}
            >
              <FileText size={26} />
            </span>
            <p className="page-sub" style={{ marginTop: 8 }}>
              Here&apos;s what we&apos;ll use in your mocks:
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
            style={{ marginTop: 18 }}
            onClick={finishUpload}
          >
            Save and continue
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: 6 }}
            onClick={() => setStage("idle")}
          >
            Upload a different file
          </button>
        </div>
      )}
    </AppShell>
  );
}
