"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Phone from "../../components/Phone";
import TopBar from "../../components/TopBar";
import Avatar from "../../components/Avatar";
import Waveform from "../../components/Waveform";
import { Volume } from "../../components/Icons";
import { QUESTIONS, TOTAL_QUESTIONS } from "../../lib/interview-data";
import m from "./interview.module.css";

export default function InterviewPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("question"); // "question" | "listening"

  const q = QUESTIONS[index];
  const isLast = index === TOTAL_QUESTIONS - 1;
  const listening = phase === "listening";

  const handlePrimary = () => {
    if (!listening) {
      setPhase("listening");
    } else if (isLast) {
      router.push("/interview/analyzing");
    } else {
      setIndex((i) => i + 1);
      setPhase("question");
    }
  };

  return (
    <Phone dark immersive>
      <div className={`${m.immersive} ${m.questionScreen}`}>
        <div className={m.stageBg} />
        <Avatar
          pose={listening ? "welcoming" : "presenting"}
          fallbackPose="idle"
          fill
          alt={listening ? "AI interviewer listening" : "AI interviewer"}
        />
        <div className={m.immersiveShade} />

        <TopBar
          title={listening ? "Your Turn" : "AI Mock Interview"}
          backHref="/home"
          overlay
          right={
            <Link href="/home" className="pill-end">
              End
            </Link>
          }
        />

        <div className={m.topArea}>
          <div className={m.progressWrap}>
            <span className={m.qbadge}>
              Question {index + 1} of {TOTAL_QUESTIONS}
            </span>
            <div className={m.progressTrack} aria-hidden>
              {QUESTIONS.map((_, i) => (
                <i
                  key={i}
                  className={`${m.progressSeg}${
                    i < index || (i === index && listening) ? " " + m.segDone : ""
                  }${i === index ? " " + m.segActive : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={m.bottomArea}>
          {listening ? (
            <div
              key={`listen-${index}`}
              className={`${m.qcard} ${m.darkCard} anim-fade-up`}
            >
              <div className={m.listening}>
                <span className={m.recDot} aria-hidden />
                Listening...
              </div>
              <div className={m.speak}>Speak clearly</div>
              <div className={m.qfooter}>
                <Waveform bars={28} className={m.qwave} height={30} />
              </div>
            </div>
          ) : (
            <div key={`q-${index}`} className={`${m.qcard} anim-fade-up`}>
              <span className={m.qcat}>{q.category}</span>
              <p className={m.qtext}>{q.text}</p>
              <div className={m.qfooter}>
                <Waveform bars={28} className={m.qwave} height={30} />
                <button className={m.qvolume} aria-label="Replay question audio">
                  <Volume size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={m.bottomBar}>
          <button onClick={handlePrimary} className={m.answerBtn}>
            {!listening
              ? "Tap to answer"
              : isLast
              ? "Finish & Get Feedback"
              : "Done — Next Question"}
          </button>
        </div>
      </div>
    </Phone>
  );
}
