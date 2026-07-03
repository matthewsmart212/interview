"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Thin wrapper around the browser SpeechRecognition API.
 *
 * status: "idle" | "listening" | "stopped"
 * error:  null | "unsupported" | "permission" | "no-speech" | "error"
 *
 * The hook never throws — when speech recognition is unavailable the caller
 * should fall back to manual typing (`supported` will be false).
 */
export default function useSpeechRecognition() {
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const recRef = useRef(null);
  // Refs so recognition callbacks always see current values without rebinding.
  const listeningRef = useRef(false);
  const finalRef = useRef("");

  useEffect(() => {
    const SR =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setSupported(false);
      setError("unsupported");
      return undefined;
    }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = navigator.language || "en-GB";

    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalRef.current = `${finalRef.current} ${chunk}`.trim();
        } else {
          interim += chunk;
        }
      }
      setFinalTranscript(finalRef.current);
      setInterimTranscript(interim.trim());
    };

    rec.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("permission");
        listeningRef.current = false;
        setStatus("stopped");
      } else if (event.error === "no-speech") {
        // Harmless — onend will restart while we're still listening.
        setError((prev) => prev ?? "no-speech");
      } else if (event.error !== "aborted") {
        setError("error");
      }
    };

    rec.onend = () => {
      // Chrome stops recognition after silence; restart while still listening.
      if (listeningRef.current) {
        try {
          rec.start();
        } catch {
          /* already started */
        }
      } else {
        setStatus("stopped");
      }
    };

    recRef.current = rec;
    return () => {
      listeningRef.current = false;
      try {
        rec.abort();
      } catch {
        /* noop */
      }
    };
  }, []);

  const start = useCallback(() => {
    finalRef.current = "";
    setFinalTranscript("");
    setInterimTranscript("");
    setError(null);
    if (!recRef.current) {
      setSupported(false);
      setError("unsupported");
      return;
    }
    listeningRef.current = true;
    setStatus("listening");
    try {
      recRef.current.start();
    } catch {
      /* start() throws if already running — safe to ignore */
    }
  }, []);

  const stop = useCallback(() => {
    listeningRef.current = false;
    setStatus("stopped");
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
  }, []);

  const reset = useCallback(() => {
    finalRef.current = "";
    setFinalTranscript("");
    setInterimTranscript("");
    setError(null);
    setStatus("idle");
  }, []);

  return {
    supported,
    status,
    error,
    finalTranscript,
    interimTranscript,
    start,
    stop,
    reset,
  };
}
