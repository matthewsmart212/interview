import Link from "next/link";
import { Plus } from "../Icons";
import InterviewCard from "../ui/InterviewCard";
import s from "./next-interview-card.module.css";

export default function NextInterviewCard({ interview }) {
  if (interview) {
    return <InterviewCard interview={interview} featured />;
  }

  return (
    <Link href="/interviews/new" className={s.emptyCard}>
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
