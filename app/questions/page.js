"use client";

import { useState } from "react";
import Phone from "../../components/Phone";
import AppHeader from "../../components/AppHeader";
import PageHeader from "../../components/PageHeader";
import BottomNav from "../../components/BottomNav";
import { Bookmark } from "../../components/Icons";
import s from "./questions.module.css";

const FILTERS = ["All", "Behavioural", "Situational", "Technical"];

const QUESTIONS = [
  { q: "Tell me about a time you dealt with a difficult customer.", cat: "Behavioural" },
  { q: "How do you handle working under pressure?", cat: "Situational" },
  { q: "Give an example of teamwork.", cat: "Behavioural" },
  { q: "How do you prioritise your tasks?", cat: "Situational" },
  { q: "Why do you want to work here?", cat: "Behavioural" },
  { q: "What makes you a good fit for this role?", cat: "Behavioural" },
  { q: "Describe a system you would build to handle refunds.", cat: "Technical" },
];

export default function QuestionsPage() {
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState({});

  const list =
    filter === "All"
      ? QUESTIONS
      : QUESTIONS.filter((x) => x.cat === filter);

  return (
    <Phone>
      <AppHeader />
      <div className="screen screen-pad has-nav has-app-header">
        <PageHeader title="Interview Questions" back backHref="/home" />
        <div className="chips" style={{ marginBottom: 16 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`chip${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="stack">
          {list.map((item) => (
            <div className={s.qcard} key={item.q}>
              <div className={s.qbody}>
                <div className={s.qtext}>{item.q}</div>
                <span className="tag">{item.cat}</span>
              </div>
              <button
                className={`${s.mark}${saved[item.q] ? " " + s.on : ""}`}
                aria-label="Save question"
                onClick={() =>
                  setSaved((p) => ({ ...p, [item.q]: !p[item.q] }))
                }
              >
                <Bookmark size={20} filled={!!saved[item.q]} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="interview" />
    </Phone>
  );
}
