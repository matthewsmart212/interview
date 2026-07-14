"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Phone from "../../components/Phone";
import CoachStage from "../../components/CoachStage";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/home";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(urlError || "");

  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  async function sendMagicLink(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!supabase) {
      setError("Supabase is not configured. Add keys to .env.local.");
      return;
    }
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email address.");
      return;
    }
    setBusy(true);
    setMode("magic");
    try {
      const origin = window.location.origin;
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (authError) throw authError;
      setMessage(`Check ${trimmed} for your magic link.`);
      setMode("sent");
    } catch (err) {
      setError(err?.message || "Could not send magic link.");
      setMode("idle");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setError("");
    setMessage("");
    if (!supabase) {
      setError("Supabase is not configured. Add keys to .env.local.");
      return;
    }
    setBusy(true);
    setMode("google");
    try {
      const origin = window.location.origin;
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (authError) throw authError;
    } catch (err) {
      setError(err?.message || "Google sign-in failed.");
      setBusy(false);
      setMode("idle");
    }
  }

  function continueLocal() {
    router.push(next.startsWith("/") ? next : "/home");
  }

  const coachSpeech =
    mode === "sent"
      ? "I've sent the link — open your email and you'll be back here with me."
      : "Sign in and I'll keep your CV, interviews, and progress with your account.";

  return (
    <Phone immersive>
      <div className={`screen ${styles.coachScreen}`}>
        <CoachStage
          pose={mode === "sent" ? "thumbsup" : "welcoming"}
          title={mode === "sent" ? "Check your inbox" : "Welcome back"}
          speech={coachSpeech}
          noHeader
        >
          {error ? <p className={styles.error}>{error}</p> : null}
          {message ? <p className={styles.success}>{message}</p> : null}

          {mode !== "sent" ? (
            <>
              <form className={styles.form} onSubmit={sendMagicLink}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                />
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.primary}`}
                  disabled={busy}
                >
                  {busy && mode === "magic" ? "Sending…" : "Email me a magic link"}
                </button>
              </form>

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <button
                type="button"
                className={styles.google}
                onClick={signInWithGoogle}
                disabled={busy}
              >
                {busy && mode === "google" ? "Redirecting…" : "Continue with Google"}
              </button>
            </>
          ) : (
            <button
              type="button"
              className={`btn btn-primary ${styles.primary}`}
              onClick={() => {
                setMode("idle");
                setMessage("");
              }}
            >
              Use a different email
            </button>
          )}

          <div className={styles.footer}>
            <button type="button" className={styles.linkish} onClick={continueLocal}>
              Continue without account (local only)
            </button>
            <div>
              New here?{" "}
              <Link href="/">Get started</Link>
            </div>
          </div>
        </CoachStage>
      </div>
    </Phone>
  );
}
