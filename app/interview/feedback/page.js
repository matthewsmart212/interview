"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import Avatar from "../../../components/Avatar";
import CircularProgress from "../../../components/CircularProgress";
import { CheckCircle, AlertCircle, ChevronRight } from "../../../components/Icons";
import { QUESTIONS, OVERALL, questionScore } from "../../../lib/interview-data";
import m from "../interview.module.css";

function scoreTier(score) {
  if (score >= 85) return "high";
  if (score >= 70) return "mid";
  return "low";
}

function useCountUp(target, duration = 1200, delay = 250) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now() + delay;
    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return value;
}

export default function FeedbackPage() {
  const displayed = useCountUp(OVERALL.score);
  const [ringVal, setRingVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setRingVal(OVERALL.score), 250);
    return () => clearTimeout(t);
  }, []);

  const scores = QUESTIONS.map((q) => questionScore(q));
  const bestIndex = scores.indexOf(Math.max(...scores));
  const stats = [
    { label: "Questions", value: QUESTIONS.length },
    { label: "Average", value: OVERALL.score },
    { label: "Top answer", value: `Q${bestIndex + 1}` },
  ];

  return (
    <Phone dark>
      <TopBar title="AI Feedback" backHref="/home" />
      <div className={`screen ${m.fbScreen}`}>
        <div className={`${m.fbHero} anim-fade-up`}>
          <div className={m.stageBg} />
          <Avatar
            pose="thumbsup"
            fill
            alt="AI interviewer celebrating"
            style={{ objectFit: "cover", objectPosition: "center 26%" }}
          />
          <div className={m.stageShade} />
          <div className={m.fbScoreOverlay}>
            <CircularProgress
              value={ringVal}
              size={88}
              stroke={10}
              color="#9d86f7"
              track="rgba(255,255,255,0.16)"
              animated
            >
              <span className={m.ringScore}>{displayed}</span>
            </CircularProgress>
            <div>
              <div className={m.lab}>Overall Score</div>
              <div className={m.big}>
                {displayed}
                <small>/100</small>
              </div>
              <span className={m.headlinePill}>{OVERALL.headline}</span>
            </div>
          </div>
        </div>

        <div
          className={`${m.fbStats} anim-fade-up`}
          style={{ animationDelay: "0.06s" }}
        >
          {stats.map((s) => (
            <div className={m.fbStat} key={s.label}>
              <div className={m.fbStatValue}>{s.value}</div>
              <div className={m.fbStatLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className={m.fbBody}>
          <div
            className={`${m.fbBlock} anim-fade-up`}
            style={{ animationDelay: "0.1s" }}
          >
            <h3>Question breakdown</h3>
            {QUESTIONS.map((q, i) => {
              const score = scores[i];
              const tier = scoreTier(score);
              return (
                <Link
                  href={`/interview/feedback/detailed?q=${i}`}
                  key={q.id}
                  className={m.qRow}
                >
                  <span className={`${m.qRowNum} ${m["tier_" + tier]}`}>
                    Q{i + 1}
                  </span>
                  <span className={m.qRowBody}>
                    <span className={m.qRowText}>{q.text}</span>
                    <span className={m.qRowBar} aria-hidden>
                      <i
                        className={m["tier_" + tier]}
                        style={{
                          "--w": `${score}%`,
                          animationDelay: `${0.35 + i * 0.12}s`,
                        }}
                      />
                    </span>
                  </span>
                  <span className={`${m.qRowScore} ${m["tier_" + tier]}`}>
                    {score}
                  </span>
                  <ChevronRight size={16} className={m.qRowChev} />
                </Link>
              );
            })}
          </div>

          <div
            className={`${m.fbBlock} anim-fade-up`}
            style={{ animationDelay: "0.2s" }}
          >
            <h3>What you did well</h3>
            {OVERALL.strengths.map((t) => (
              <div className="fb-item fb-good" key={t}>
                <span className="fb-ico">
                  <CheckCircle size={18} />
                </span>
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div
            className={`${m.fbBlock} anim-fade-up`}
            style={{ animationDelay: "0.3s" }}
          >
            <h3>What to improve</h3>
            {OVERALL.improvements.map((t) => (
              <div className="fb-item fb-bad" key={t}>
                <span className="fb-ico">
                  <AlertCircle size={18} />
                </span>
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div
            className={`${m.fbActions} anim-fade-up`}
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/interview/feedback/detailed" className="btn btn-primary">
              View Detailed Feedback
            </Link>
            <Link href="/interview" className={m.practiceAgain}>
              Practice Again
            </Link>
          </div>
        </div>
      </div>
    </Phone>
  );
}
