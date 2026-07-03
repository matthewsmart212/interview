"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import Avatar from "../../../components/Avatar";
import CircularProgress from "../../../components/CircularProgress";
import {
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Sparkle,
  Star,
} from "../../../components/Icons";
import {
  clearResult,
  clearSession,
  loadResult,
} from "../../../lib/interview-session";
import m from "../interview.module.css";

function scoreTier(score) {
  if (score >= 85) return "high";
  if (score >= 70) return "mid";
  return "low";
}

function encouragement(score) {
  if (score >= 85)
    return { title: "Incredible!", text: "You're ready to impress for real." };
  if (score >= 75)
    return { title: "So close!", text: "A little polish and you'll shine." };
  if (score >= 60)
    return { title: "Nice work!", text: "Your answers are taking shape." };
  return { title: "Keep going!", text: "You're building great habits." };
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

/* Friendly empty state when the user lands here without any answers. */
function FeedbackEmptyState() {
  return (
    <Phone dark>
      <TopBar title="AI Feedback" backHref="/home" overlay />
      <div className={`screen ${m.fbEmpty}`}>
        <div className={m.fbEmptyAvatar}>
          <Avatar pose="welcoming" fallbackPose="idle" round fill alt="AI interviewer" />
        </div>
        <h2 className={m.fbEmptyTitle}>No feedback yet</h2>
        <p className={m.fbEmptySub}>
          Complete a mock interview and your personalised AI feedback will
          appear here.
        </p>
        <Link href="/interview" className="btn btn-primary" style={{ maxWidth: 280 }}>
          Start mock interview
        </Link>
      </div>
    </Phone>
  );
}

function FeedbackSummaryScreen({ result }) {
  const router = useRouter();
  const [showSamples, setShowSamples] = useState(false);
  const samplesRef = useRef(null);

  const displayed = useCountUp(result.overallScore);
  const [ringVal, setRingVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setRingVal(result.overallScore), 250);
    return () => clearTimeout(t);
  }, [result.overallScore]);

  const scores = result.questions.map((q) => q.score);
  const weakestIndex = scores.indexOf(Math.min(...scores));
  const cheer = encouragement(result.overallScore);
  const stats = [
    { label: "Questions", value: result.questions.length },
    { label: "Average", value: result.averageScore },
    { label: "Top answer", value: `Q${result.topAnswerIndex + 1}` },
  ];

  const startAnother = () => {
    clearSession();
    clearResult();
    router.push("/interview");
  };

  const toggleSamples = () => {
    setShowSamples((v) => {
      if (!v) setTimeout(() => samplesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return !v;
    });
  };

  return (
    <Phone dark>
      <TopBar title="AI Feedback" backHref="/home" overlay />
      <div className={`screen ${m.fbScreen}`}>
        <div className={`${m.fbHero} anim-fade-up`}>
          <div className={m.fbScore}>
            <div className={m.lab}>Overall Score</div>
            <CircularProgress
              value={ringVal}
              size={124}
              stroke={12}
              color="#9d86f7"
              track="rgba(255,255,255,0.12)"
              animated
            >
              <span className={m.ringBig}>{displayed}</span>
              <span className={m.ringOutOf}>out of 100</span>
            </CircularProgress>
            <span className={m.headlinePill}>
              <Star size={15} /> {result.headline}
            </span>
          </div>
          <div className={m.fbAvatarSide}>
            <Avatar pose="thumbsup" fill alt="AI interviewer celebrating" />
          </div>
          <div className={m.fbBubble}>
            <b>{cheer.title}</b>
            <span>{cheer.text}</span>
          </div>
          <span className={m.fbSpark1} aria-hidden>
            <Sparkle size={22} />
          </span>
          <span className={m.fbSpark2} aria-hidden>
            <Sparkle size={12} />
          </span>
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
            {result.questions.map((qf, i) => {
              const tier = scoreTier(qf.score);
              return (
                <Link
                  href={`/interview/feedback/detailed?q=${i}`}
                  key={qf.id}
                  className={m.qRow}
                >
                  <span className={`${m.qRowNum} ${m["tier_" + tier]}`}>
                    Q{i + 1}
                  </span>
                  <span className={m.qRowBody}>
                    <span className={m.qRowText}>{qf.question}</span>
                    <span className={m.qRowBar} aria-hidden>
                      <i
                        className={m["tier_" + tier]}
                        style={{
                          "--w": `${qf.score}%`,
                          animationDelay: `${0.35 + i * 0.12}s`,
                        }}
                      />
                    </span>
                  </span>
                  <span className={`${m.qRowScore} ${m["tier_" + tier]}`}>
                    {qf.score}
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
            {result.overallStrengths.map((t) => (
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
            {result.overallImprovements.map((t) => (
              <div className="fb-item fb-bad" key={t}>
                <span className="fb-ico">
                  <AlertCircle size={18} />
                </span>
                <span>{t}</span>
              </div>
            ))}
          </div>

          {showSamples && (
            <div ref={samplesRef} className={`${m.fbBlock} anim-fade-up`}>
              <h3>Stronger sample answers</h3>
              {result.questions.map((qf, i) => (
                <div className={m.sampleAnswer} key={qf.id}>
                  <span className={m.sampleQ}>
                    Q{i + 1} — {qf.category}
                  </span>
                  <p className={m.sampleText}>{qf.betterAnswer}</p>
                </div>
              ))}
            </div>
          )}

          <div
            className={`${m.fbActions} anim-fade-up`}
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href={`/interview?retry=${weakestIndex}`}
              className="btn btn-primary"
            >
              Practise weakest answer again
            </Link>
            <button className={m.ghostCta} onClick={startAnother}>
              Start another mock interview
            </button>
            <button className={m.practiceAgain} onClick={toggleSamples}>
              <Sparkle size={15} style={{ verticalAlign: "-2px", marginRight: 6 }} />
              {showSamples ? "Hide sample answers" : "Generate stronger sample answers"}
            </button>
          </div>
        </div>
      </div>
    </Phone>
  );
}

export default function FeedbackPage() {
  // undefined = still reading localStorage, null = nothing stored
  const [result, setResult] = useState(undefined);
  useEffect(() => {
    setResult(loadResult());
  }, []);

  if (result === undefined)
    return (
      <Phone dark>
        <TopBar title="AI Feedback" backHref="/home" overlay />
      </Phone>
    );
  if (result === null) return <FeedbackEmptyState />;
  return <FeedbackSummaryScreen result={result} />;
}
