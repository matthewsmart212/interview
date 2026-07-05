import Link from "next/link";
import Phone from "../../components/Phone";
import AppHeader from "../../components/AppHeader";
import PageHeader from "../../components/PageHeader";
import BottomNav from "../../components/BottomNav";
import { Plus, Calendar, ChevronRight } from "../../components/Icons";
import { INTERVIEWS } from "../../lib/app-data";
import s from "./interviews.module.css";

function cardDate(date) {
  return date.replace(/\s+\d{4}$/, "");
}

function countdown(iv) {
  if (iv.status === "past") return { text: iv.outcome ?? "Completed", cls: "done" };
  if (iv.daysAway <= 7) return { text: `in ${iv.daysAway} days`, cls: "soon" };
  return { text: `in ${iv.daysAway} days`, cls: "" };
}

function InterviewCard({ iv }) {
  const cd = countdown(iv);
  return (
    <Link href={`/interviews/${iv.id}`} className={s.card}>
      <span className={s.logo}>{iv.initials}</span>
      <span className={s.body}>
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

export default function InterviewsPage() {
  const upcoming = INTERVIEWS.filter((i) => i.status === "upcoming");
  const past = INTERVIEWS.filter((i) => i.status === "past");

  return (
    <Phone>
      <AppHeader />
      <div className="screen screen-pad has-nav has-app-header">
        <PageHeader
          icon="calendar"
          title="My Interviews"
          description="Track your upcoming and past interviews"
          right={
            <Link href="/interviews/new" className={s.addBtn}>
              <Plus size={15} stroke={2.6} /> Add
            </Link>
          }
        />
        {INTERVIEWS.length === 0 ? (
          <div className={s.empty}>
            <span className={s.emptyIcon}>
              <Calendar size={30} />
            </span>
            <div className={s.emptyTitle}>No interviews yet</div>
            <p className={s.emptySub}>
              Add your first interview and we&apos;ll build a prep plan around
              it.
            </p>
            <Link href="/interviews/new" className="btn btn-primary">
              Add an interview
            </Link>
          </div>
        ) : (
          <>
            <p className="section-title">Upcoming</p>
            <div className="stack">
              {upcoming.map((iv) => (
                <InterviewCard iv={iv} key={iv.id} />
              ))}
            </div>

            {past.length > 0 && (
              <>
                <p className="section-title" style={{ marginTop: 24 }}>
                  Past interviews
                </p>
                <div className="stack">
                  {past.map((iv) => (
                    <InterviewCard iv={iv} key={iv.id} />
                  ))}
                </div>
              </>
            )}

            <p className={s.skipNote}>
              Preparing without a set date?{" "}
              <Link href="/interview" className="link-btn">
                Start a practice mock →
              </Link>
            </p>
          </>
        )}
      </div>
      <BottomNav active="interviews" />
    </Phone>
  );
}
