import Link from "next/link";
import { Plus } from "../Icons";
import s from "./next-interview-card.module.css";

export default function NextInterviewCard({ interview }) {
  if (interview) {
    return (
      <Link href={`/interviews/${interview.id}`} className={s.card}>
        <div className={s.body}>
          <span className={s.label}>Next interview</span>
          <h2 className={s.title}>
            {interview.role} at {interview.company}
          </h2>
          <p className={s.meta}>
            in {interview.daysAway} days · {interview.readiness}% ready
          </p>
        </div>
        <div className={s.dateChip} aria-hidden>
          <span className={s.day}>{interview.dateChip.d}</span>
          <span className={s.month}>{interview.dateChip.m}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/interviews/new" className={s.card}>
      <div className={s.body}>
        <span className={s.label}>No interviews yet</span>
        <h2 className={s.title}>Add your first interview</h2>
        <p className={s.meta}>We&apos;ll build a prep plan around it</p>
      </div>
      <div className={s.dateChip} aria-hidden>
        <Plus size={24} />
      </div>
    </Link>
  );
}
