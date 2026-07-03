"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "../Avatar";
import m from "../../app/interview/interview.module.css";

/**
 * "Review Your Answer" phase. Shows the transcript we heard (or a textarea
 * fallback when nothing was captured / speech is unavailable) and lets the
 * user confirm, retry, or edit before moving on.
 */
export default function TranscriptReviewScreen({
  index,
  total,
  question,
  transcript,
  micFallback,
  onChangeTranscript,
  onUse,
  onRetry,
}) {
  // Start directly in edit mode when we have nothing usable to show.
  const [editing, setEditing] = useState(() => !transcript.trim());
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const empty = !transcript.trim();

  return (
    <>
      <div className={m.reviewScroll}>
        <div className={`${m.reviewHead} anim-fade-up`}>
          <div className={m.reviewAvatar}>
            <Avatar
              pose="welcoming"
              fallbackPose="idle"
              round
              fill
              alt="AI interviewer"
            />
          </div>
          <p className={m.reviewSub}>Make sure we heard you correctly.</p>
        </div>

        <div className={`${m.qcard} ${m.reviewCard} anim-fade-up`}>
          <span className={m.reviewQLabel}>
            Question {index + 1} of {total}
          </span>
          <p className={m.reviewQText}>{question.text}</p>

          <div className={m.reviewDivider} aria-hidden />

          {micFallback && empty ? (
            <p className={m.micNote}>
              {micFallback === "permission"
                ? "We couldn't use your microphone, so type your answer below."
                : micFallback === "unsupported"
                ? "Voice input isn't available in this browser, so type your answer below."
                : "We didn't catch that — type your answer below, or retry."}
            </p>
          ) : null}

          {editing ? (
            <textarea
              ref={textareaRef}
              className={m.transcriptTextarea}
              value={transcript}
              onChange={(e) => onChangeTranscript(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
            />
          ) : (
            <p className={m.transcriptBox}>“{transcript}”</p>
          )}
        </div>
      </div>

      <div className={m.bottomBar}>
        {editing ? (
          <button
            className={m.answerBtn}
            disabled={empty}
            onClick={() => setEditing(false)}
          >
            Save changes
          </button>
        ) : (
          <button className={m.answerBtn} disabled={empty} onClick={onUse}>
            Use this answer
          </button>
        )}
        <div className={m.secondaryRow}>
          <button className={m.ghostBtn} onClick={onRetry}>
            Retry answer
          </button>
          {!editing && (
            <button className={m.textBtn} onClick={() => setEditing(true)}>
              Edit transcript
            </button>
          )}
        </div>
      </div>
    </>
  );
}
