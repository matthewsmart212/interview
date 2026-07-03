"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Phone from "../../../../components/Phone";
import TopBar from "../../../../components/TopBar";
import Avatar from "../../../../components/Avatar";
import CircularProgress from "../../../../components/CircularProgress";
import {
  CheckCircle,
  AlertCircle,
  Refresh,
  Sparkle,
} from "../../../../components/Icons";
import { loadResult } from "../../../../lib/interview-session";
import m from "../../interview.module.css";
import s from "./detailed.module.css";

const STAR_ORDER = ["Situation", "Task", "Action", "Result"];

function QuestionFeedbackDetail({ result }) {
  const params = useSearchParams();
  const initial = Math.min(
    result.questions.length - 1,
    Math.max(0, parseInt(params.get("q") || "0", 10) || 0)
  );
  const [qi, setQi] = useState(initial);
  const qf = result.questions[qi];

  return (
    <div className={`screen ${s.detailScreen}`}>
      <div className="chips" style={{ padding: "0 20px", marginBottom: 14 }}>
        {result.questions.map((question, i) => (
          <button
            key={question.id}
            className={`chip ${s.darkChip}${qi === i ? " active" : ""}`}
            onClick={() => setQi(i)}
          >
            Q{i + 1}
          </button>
        ))}
      </div>

      <div key={qi} className={s.detailBody}>
        {/* header: question number + score */}
        <div className={`${s.headRow} anim-fade-up`}>
          <div>
            <div className={s.headLabel}>
              Question {qi + 1} of {result.questions.length}
            </div>
            <span className={s.headCat}>{qf.category}</span>
          </div>
          <CircularProgress
            value={qf.score}
            size={64}
            stroke={7}
            color="#9d86f7"
            track="rgba(255,255,255,0.14)"
          >
            <span className={s.headScore}>{qf.score}</span>
          </CircularProgress>
        </div>

        <p className={`${s.questionText} anim-fade-up`}>{qf.question}</p>

        {/* summary */}
        <div className={`${m.fbBlock} anim-fade-up`} style={{ animationDelay: "0.05s" }}>
          <h3>Summary</h3>
          <p className={s.bodyText}>{qf.summary}</p>
        </div>

        {/* transcript */}
        <div className={`${m.fbBlock} anim-fade-up`} style={{ animationDelay: "0.1s" }}>
          <h3>Your answer</h3>
          <p className={s.transcript}>
            {qf.transcript ? `“${qf.transcript}”` : "No answer was recorded."}
          </p>
        </div>

        {/* STAR breakdown */}
        <div className={`${m.fbBlock} anim-fade-up`} style={{ animationDelay: "0.15s" }}>
          <h3>STAR breakdown</h3>
          {STAR_ORDER.map((part) => {
            const item = qf.starBreakdown[part];
            return (
              <div className={s.starRow} key={part}>
                <span
                  className={`${s.starIcon} ${item.covered ? s.starOk : s.starMiss}`}
                >
                  {item.covered ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                </span>
                <span className={s.starBody}>
                  <span className={s.starName}>{part}</span>
                  <span className={s.starNote}>{item.note}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* strengths */}
        <div className={`${m.fbBlock} anim-fade-up`} style={{ animationDelay: "0.2s" }}>
          <h3>What went well</h3>
          {qf.strengths.map((t) => (
            <div className="fb-item fb-good" key={t}>
              <span className="fb-ico">
                <CheckCircle size={18} />
              </span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        {/* improvements */}
        <div className={`${m.fbBlock} anim-fade-up`} style={{ animationDelay: "0.25s" }}>
          <h3>What to improve</h3>
          {qf.improvements.map((t) => (
            <div className="fb-item fb-bad" key={t}>
              <span className="fb-ico">
                <AlertCircle size={18} />
              </span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        {/* better answer */}
        <div className={`${m.fbBlock} anim-fade-up`} style={{ animationDelay: "0.3s" }}>
          <h3>Better answer example</h3>
          <p className={s.bodyText}>{qf.betterAnswer}</p>
        </div>

        {/* quick tip */}
        <div className={`${s.tipCard} anim-fade-up`} style={{ animationDelay: "0.35s" }}>
          <span className={s.tipIcon}>
            <Sparkle size={18} />
          </span>
          <div>
            <div className={s.tipLabel}>Quick tip</div>
            <p className={s.tipText}>{qf.quickTip}</p>
          </div>
        </div>

        <div className={`${s.detailActions} anim-fade-up`} style={{ animationDelay: "0.4s" }}>
          <Link href={`/interview?retry=${qi}`} className="btn btn-primary">
            <Refresh size={18} />
            Retry this question
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailEmptyState() {
  return (
    <div className={`screen ${m.fbEmpty}`}>
      <div className={m.fbEmptyAvatar}>
        <Avatar pose="welcoming" fallbackPose="idle" round fill alt="AI interviewer" />
      </div>
      <h2 className={m.fbEmptyTitle}>No feedback yet</h2>
      <p className={m.fbEmptySub}>
        Complete a mock interview to see detailed feedback for every answer.
      </p>
      <Link href="/interview" className="btn btn-primary" style={{ maxWidth: 280 }}>
        Start mock interview
      </Link>
    </div>
  );
}

export default function QuestionFeedbackDetailPage() {
  // undefined = still reading localStorage, null = nothing stored
  const [result, setResult] = useState(undefined);
  useEffect(() => {
    setResult(loadResult());
  }, []);

  return (
    <Phone dark>
      <TopBar title="Question Feedback" backHref="/interview/feedback" />
      {result === undefined ? null : result === null ? (
        <DetailEmptyState />
      ) : (
        <Suspense fallback={null}>
          <QuestionFeedbackDetail result={result} />
        </Suspense>
      )}
    </Phone>
  );
}
