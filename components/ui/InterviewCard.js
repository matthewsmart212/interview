import Link from "next/link";
import { ChevronRight } from "../Icons";
import s from "./interview-card.module.css";

function cardDate(date) {
  return date.replace(/\s+\d{4}$/, "");
}

function statusFor(iv) {
  if (iv.status === "past") return null;
  if (iv.readiness >= 70) return { label: "Ready", cls: "ready" };
  if (iv.readiness < 50) return { label: "Needs prep", cls: "prep" };
  return { label: "Upcoming", cls: "upcoming" };
}

function countdown(iv) {
  if (iv.status === "past") return { text: iv.outcome ?? "Completed", cls: "done" };
  if (iv.daysAway <= 7) return { text: `in ${iv.daysAway} days`, cls: "soon" };
  return { text: `in ${iv.daysAway} days`, cls: "" };
}

export default function InterviewCard({ interview: iv }) {
  const cd = countdown(iv);
  const status = statusFor(iv);

  return (
    <Link href={`/interviews/${iv.id}`} className={s.card}>
      <span className={s.logo}>{iv.initials}</span>
      <span className={s.body}>
        {status ? (
          <span className={`status-pill ${status.cls}`}>{status.label}</span>
        ) : null}
        <span className={s.role}>{iv.role}</span>
        <span className={s.meta}>
          {iv.company} · {iv.type} · {cardDate(iv.date)}
        </span>
        <span className={`${s.countdown} ${cd.cls ? s[cd.cls] : ""}`}>
          {cd.text}
        </span>
      </span>
      <span className={s.side}>
        {iv.status === "upcoming" && (
          <span className={s.readyMini}>
            <b>{iv.readiness}%</b> ready
          </span>
        )}
        <ChevronRight size={18} className="chev" />
      </span>
    </Link>
  );
}
