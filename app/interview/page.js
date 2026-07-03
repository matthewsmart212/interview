"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Phone from "../../components/Phone";
import TopBar from "../../components/TopBar";
import Avatar from "../../components/Avatar";
import ProgressSteps from "../../components/interview/ProgressSteps";
import InterviewQuestionScreen from "../../components/interview/InterviewQuestionScreen";
import ListeningScreen from "../../components/interview/ListeningScreen";
import TranscriptReviewScreen from "../../components/interview/TranscriptReviewScreen";
import useSpeechRecognition from "../../lib/useSpeechRecognition";
import { QUESTIONS, TOTAL_QUESTIONS } from "../../lib/interview-data";
import {
  clearResult,
  loadResult,
  loadSession,
  newSession,
  saveAnswer,
  saveSession,
} from "../../lib/interview-session";
import m from "./interview.module.css";

const TITLES = {
  question: "AI Mock Interview",
  listening: "Your Turn",
  reviewTranscript: "Review Your Answer",
};

function InterviewFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const retryParam = params.get("retry");
  const retryIndex =
    retryParam !== null ? Math.min(TOTAL_QUESTIONS - 1, Math.max(0, +retryParam || 0)) : null;

  const [index, setIndex] = useState(retryIndex ?? 0);
  const [phase, setPhase] = useState("question");
  const [transcript, setTranscript] = useState("");
  const sessionRef = useRef(null);
  const speech = useSpeechRecognition();

  /* ---- restore / initialise the session on mount ---- */
  useEffect(() => {
    let session = loadSession() ?? newSession();

    if (retryIndex !== null) {
      // Retrying one question after feedback: keep previous answers so the
      // result can be recalculated. Seed them from the stored result if the
      // session was cleared.
      if (Object.keys(session.answers).length === 0) {
        const result = loadResult();
        if (result) {
          for (const qf of result.questions) {
            if (qf.transcript)
              session.answers[qf.id] = {
                questionId: qf.id,
                transcript: qf.transcript,
              };
          }
        }
      }
      session = { ...session, currentIndex: retryIndex, phase: "question", draft: null };
    } else if (session.phase === "reviewTranscript" && session.draft) {
      // Refresh-safe: restore an unconfirmed transcript on the review screen.
      setIndex(session.currentIndex);
      setTranscript(session.draft.transcript);
      setPhase("reviewTranscript");
    } else {
      // A live mic session can't survive a refresh — resume at the question.
      session = { ...session, phase: "question", draft: null };
      setIndex(session.currentIndex);
    }

    saveSession(session);
    sessionRef.current = session;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (patch) => {
    const next = { ...(sessionRef.current ?? newSession()), ...patch };
    sessionRef.current = next;
    saveSession(next);
  };

  const q = QUESTIONS[index];
  const isRetry = retryIndex !== null;
  const isLast = index === TOTAL_QUESTIONS - 1;

  /* ---- phase transitions ---- */

  const startAnswer = () => {
    setTranscript("");
    speech.start(); // no-ops safely when unsupported
    setPhase("listening");
    persist({ currentIndex: index, phase: "listening", draft: null });
  };

  const finishAnswer = () => {
    speech.stop();
    const heard = `${speech.finalTranscript} ${speech.interimTranscript}`.trim();
    setTranscript(heard);
    setPhase("reviewTranscript");
    persist({
      phase: "reviewTranscript",
      draft: { questionId: q.id, transcript: heard },
    });
  };

  const retryAnswer = () => {
    setTranscript("");
    speech.reset();
    speech.start();
    setPhase("listening");
    persist({ phase: "listening", draft: null });
  };

  const changeTranscript = (value) => {
    setTranscript(value);
    persist({ draft: { questionId: q.id, transcript: value } });
  };

  const useAnswer = () => {
    const session = saveAnswer(sessionRef.current ?? newSession(), {
      questionId: q.id,
      transcript: transcript.trim(),
      edited: transcript.trim() !== speech.finalTranscript.trim(),
      typed: !speech.supported || !!speech.error,
      recordedAt: Date.now(),
    });
    sessionRef.current = session;

    if (isRetry || isLast) {
      clearResult(); // force the analyzing screen to regenerate feedback
      persist({ phase: "analyzing", draft: null });
      router.push("/interview/analyzing");
    } else {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setTranscript("");
      speech.reset();
      setPhase("question");
      persist({ currentIndex: nextIndex, phase: "question", draft: null });
    }
  };

  /* ---- render ---- */

  const listening = phase === "listening";
  const reviewing = phase === "reviewTranscript";

  const liveText = listening
    ? `${speech.finalTranscript} ${speech.interimTranscript}`.trim().slice(-110)
    : "";

  return (
    <Phone dark immersive>
      <div
        className={`${m.immersive} ${m.questionScreen}${
          reviewing ? " " + m.reviewScreen : ""
        }`}
      >
        <div className={m.stageBg} />
        {!reviewing && (
          <Avatar
            pose={listening ? "welcoming" : "presenting"}
            fallbackPose="idle"
            fill
            alt={listening ? "AI interviewer listening" : "AI interviewer"}
          />
        )}
        <div className={m.immersiveShade} />

        <TopBar
          title={TITLES[phase]}
          backHref="/home"
          overlay
          right={
            <Link href="/home" className="pill-end">
              End
            </Link>
          }
        />

        {!reviewing && (
          <div className={m.topArea}>
            <ProgressSteps
              index={index}
              total={TOTAL_QUESTIONS}
              fillCurrent={listening}
            />
          </div>
        )}

        {phase === "question" && (
          <InterviewQuestionScreen question={q} onAnswer={startAnswer} />
        )}

        {listening && (
          <ListeningScreen
            questionId={q.id}
            liveText={liveText}
            micError={speech.error === "no-speech" ? null : speech.error}
            onFinish={finishAnswer}
          />
        )}

        {reviewing && (
          <TranscriptReviewScreen
            key={`review-${q.id}`}
            index={index}
            total={TOTAL_QUESTIONS}
            question={q}
            transcript={transcript}
            micFallback={speech.error}
            onChangeTranscript={changeTranscript}
            onUse={useAnswer}
            onRetry={retryAnswer}
          />
        )}
      </div>
    </Phone>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={null}>
      <InterviewFlow />
    </Suspense>
  );
}
