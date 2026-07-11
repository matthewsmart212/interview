"use client";

import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { AppShell } from "../../components/ui";
import { Bookmark } from "../../components/Icons";
import { toggleSavedQuestion } from "../../lib/db";
import { useAppDb } from "../../lib/db/use-app-db";
import s from "./questions.module.css";

const FILTERS = ["All", "Behavioural", "Situational", "Technical"];

const QUESTIONS = [
  { id: "q-difficult-customer", q: "Tell me about a time you dealt with a difficult customer.", cat: "Behavioural" },
  { id: "q-under-pressure", q: "How do you handle working under pressure?", cat: "Situational" },
  { id: "q-teamwork", q: "Give an example of teamwork.", cat: "Behavioural" },
  { id: "q-prioritise", q: "How do you prioritise your tasks?", cat: "Situational" },
  { id: "q-why-here", q: "Why do you want to work here?", cat: "Behavioural" },
  { id: "q-good-fit", q: "What makes you a good fit for this role?", cat: "Behavioural" },
  { id: "q-refunds", q: "Describe a system you would build to handle refunds.", cat: "Technical" },
];

export default function QuestionsPage() {
  const { savedQuestionIds } = useAppDb();
  const [filter, setFilter] = useState("All");

  const list =
    filter === "All"
      ? QUESTIONS
      : QUESTIONS.filter((x) => x.cat === filter);

  return (
    <AppShell>
      <PageHeader
        icon="messageCircle"
        title="Interview Questions"
        description="Role-specific questions to practise"
        back
        backHref="/home"
      />

      <div className="chips" style={{ marginBottom: 16 }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`chip${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="stack">
        {list.map((item) => {
          const isSaved = savedQuestionIds.includes(item.id);
          return (
            <div className={s.qcard} key={item.id}>
              <div className={s.qbody}>
                <div className={s.qtext}>{item.q}</div>
                <span className="tag">{item.cat}</span>
              </div>
              <button
                type="button"
                className={`${s.mark}${isSaved ? " " + s.on : ""}`}
                aria-label="Save question"
                onClick={() => toggleSavedQuestion(item.id)}
              >
                <Bookmark size={20} filled={isSaved} />
              </button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
