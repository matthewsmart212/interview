import Link from "next/link";
import Phone from "../../components/Phone";
import PageHeader from "../../components/PageHeader";
import BottomNav from "../../components/BottomNav";
import { ChevronRight, Mic } from "../../components/Icons";
import { MOCK_HISTORY } from "../../lib/app-data";
import s from "./history.module.css";
import iv from "../interviews/interviews.module.css";

function scoreCls(score) {
  if (score >= 80) return "good";
  if (score < 65) return "low";
  return "";
}

export default function HistoryPage() {
  return (
    <Phone>
      <div className="screen screen-pad has-nav has-app-header">
        <PageHeader
          icon="mic"
          title="Mock History"
          description="Revisit feedback from practice sessions"
          back
          backHref="/progress"
        />
        {MOCK_HISTORY.length === 0 ? (
          <div className={iv.empty}>
            <span className={iv.emptyIcon}>
              <Mic size={30} />
            </span>
            <div className={iv.emptyTitle}>No mock interviews yet</div>
            <p className={iv.emptySub}>
              Your completed practice sessions will appear here so you can
              revisit them any time.
            </p>
            <Link href="/interview" className="btn btn-primary">
              Start your first mock
            </Link>
          </div>
        ) : (
          <>
            <p className="page-sub" style={{ marginBottom: 16 }}>
              Every mock you&apos;ve completed — tap one to revisit the
              feedback.
            </p>
            <div className="stack">
              {MOCK_HISTORY.map((mk) => (
                <Link href={`/history/${mk.id}`} className={s.row} key={mk.id}>
                  <span
                    className={`${s.score} ${scoreCls(mk.score) ? s[scoreCls(mk.score)] : ""}`}
                  >
                    {mk.score}
                  </span>
                  <span className={s.body}>
                    <span className={s.title}>
                      {mk.role} · {mk.company}
                    </span>
                    <span className={s.sub}>
                      {mk.date} · {mk.time} · {mk.questions} questions
                    </span>
                  </span>
                  <ChevronRight size={18} className="chev" />
                </Link>
              ))}
            </div>

            <Link href="/interview" className="btn btn-primary" style={{ marginTop: 24 }}>
              <Mic size={18} /> Start a new mock interview
            </Link>
          </>
        )}
      </div>
      <BottomNav active="progress" />
    </Phone>
  );
}
