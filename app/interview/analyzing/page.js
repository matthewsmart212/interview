"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import Avatar from "../../../components/Avatar";
import m from "../interview.module.css";

const METRICS = [
  { label: "Relevance", on: 4, color: "green" },
  { label: "Structure (STAR)", on: 3, color: "green" },
  { label: "Clarity", on: 4, color: "brand" },
  { label: "Confidence", on: 3, color: "blue" },
];

function Dots({ on, color }) {
  return (
    <span className="dots">
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={i < on ? `on ${color}` : ""} />
      ))}
    </span>
  );
}

export default function AnalyzingPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/interview/feedback"), 2800);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <Phone dark>
      <TopBar title="Analyzing..." back={false} />
      <div className="screen">
        <div className={m.stage}>
          <div className={m.stageBg} />
          <Avatar pose="thinking" fill alt="AI interviewer thinking" />
          <div className={m.stageBottom}>
            <div className={m.analyzeCard}>
              <div className={m.analyzeTitle}>Analyzing your answer</div>
              {METRICS.map((mt) => (
                <div className={m.metricRow} key={mt.label}>
                  <span>{mt.label}</span>
                  <Dots on={mt.on} color={mt.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}
