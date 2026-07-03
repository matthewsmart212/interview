import type {
  InterviewAnswer,
  InterviewFeedbackResult,
  InterviewQuestion,
  QuestionFeedback,
  StarBreakdown,
} from "./types";

/**
 * Mock AI feedback generator.
 *
 * Everything below derives feedback from the actual transcript text so the
 * result feels answer-specific. To connect a real model later, replace the
 * body of `generateInterviewFeedback` with an API call that returns the same
 * `InterviewFeedbackResult` shape — no UI changes needed.
 */

interface GenerateInput {
  questions: InterviewQuestion[];
  answers: Record<number, InterviewAnswer>;
}

/** Async entry point the UI calls. Swap this for an OpenAI/API call later. */
export async function generateInterviewFeedback(
  input: GenerateInput
): Promise<InterviewFeedbackResult> {
  return generateMockInterviewFeedback(input);
}

export function generateMockInterviewFeedback({
  questions,
  answers,
}: GenerateInput): InterviewFeedbackResult {
  const perQuestion = questions.map((q) =>
    analyzeAnswer(q, answers[q.id]?.transcript ?? "")
  );

  const scores = perQuestion.map((f) => f.score);
  const averageScore = Math.round(
    scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)
  );
  const topAnswerIndex = scores.indexOf(Math.max(...scores));

  return {
    overallScore: averageScore,
    averageScore,
    topAnswerIndex,
    headline: headlineFor(averageScore),
    questions: perQuestion,
    overallStrengths: aggregate(perQuestion.map((f) => f.strengths)),
    overallImprovements: aggregate(perQuestion.map((f) => f.improvements)),
    generatedAt: Date.now(),
  };
}

/* ---------------- transcript analysis ---------------- */

const SIGNALS = {
  situation:
    /\b(when|while|during|at the time|last (year|month|week)|one (day|time)|there was|we had|i was working|in my (last|previous|current) (job|role))\b/i,
  task: /\b(my (task|job|goal|responsibility)|i (needed|had) to|we (needed|had) to|the goal was|i was asked)\b/i,
  action:
    /\b(i (decided|organised|organized|listened|helped|created|suggested|spoke|asked|made|took|checked|offered|called|arranged|prioritised|prioritized|explained|apologised|apologized|stayed|kept|served|flagged|covered))\b/i,
  result:
    /\b(in the end|as a result|the (result|outcome) was|eventually|so we|which (meant|led)|they (were|was) happy|it worked|we (managed|achieved|finished|completed)|feedback|praised|thanked)\b/i,
  numbers: /\b\d+(\.\d+)?\s*(%|percent|minutes?|hours?|days?|weeks?|customers?|people|x)?\b/i,
  teamwork: /\b(team|colleague|we |together|helped each other|manager)\b/i,
  customer: /\b(customer|client|guest|shopper)\b/i,
  calm: /\b(calm|patient|patiently|composed|step by step|one at a time)\b/i,
  ownership: /\b(i took|i decided|i suggested|i volunteered|my idea|i led)\b/i,
};

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function firstSentence(text: string): string {
  const match = text.trim().match(/^[^.!?]{10,160}[.!?]?/);
  return match ? match[0].trim().replace(/[.!?]$/, "") : text.trim().slice(0, 120);
}

/** Small deterministic offset so identical answers to different questions vary a little. */
function seedOffset(qid: number, text: string): number {
  let h = qid * 7;
  for (let i = 0; i < Math.min(text.length, 60); i++) h = (h * 31 + text.charCodeAt(i)) % 997;
  return (h % 5) - 2; // -2..2
}

function analyzeAnswer(q: InterviewQuestion, rawTranscript: string): QuestionFeedback {
  const transcript = rawTranscript.trim();
  const words = wordCount(transcript);
  const has = {
    situation: SIGNALS.situation.test(transcript),
    task: SIGNALS.task.test(transcript),
    action: SIGNALS.action.test(transcript),
    result: SIGNALS.result.test(transcript),
    numbers: SIGNALS.numbers.test(transcript),
    teamwork: SIGNALS.teamwork.test(transcript),
    customer: SIGNALS.customer.test(transcript),
    calm: SIGNALS.calm.test(transcript),
    ownership: SIGNALS.ownership.test(transcript),
  };

  /* -------- score -------- */
  let score = 52;
  score += Math.min(15, Math.round(words / 6)); // depth
  if (has.situation) score += 5;
  if (has.task) score += 4;
  if (has.action) score += 7;
  if (has.result) score += 7;
  if (has.numbers) score += 5;
  if (has.ownership) score += 3;
  if (words > 0 && words < 20) score -= 10; // too short to assess well
  score += seedOffset(q.id, transcript);
  score = Math.max(35, Math.min(96, score));
  if (!transcript) score = 0;

  /* -------- summary -------- */
  const summary = transcript
    ? `You answered in about ${words} words, opening with “${firstSentence(transcript)}.” ${
        has.result
          ? "You closed with a clear outcome, which makes the answer land well."
          : "The answer ends without a clear outcome, so it feels unfinished."
      }`
    : "No answer was recorded for this question.";

  /* -------- strengths -------- */
  const strengths: string[] = [];
  if (has.situation) strengths.push("You set the scene with a real, specific situation");
  if (has.action) strengths.push("You clearly described the actions you personally took");
  if (has.result) strengths.push("You finished with the outcome, which interviewers listen for");
  if (has.numbers) strengths.push("You backed your answer up with concrete numbers");
  if (has.teamwork) strengths.push("You showed you can work with and involve other people");
  if (has.calm) strengths.push("You came across as calm and methodical under pressure");
  if (has.ownership) strengths.push("You took clear personal ownership rather than hiding behind “we”");
  if (words >= 60) strengths.push("Good level of detail — enough substance for the interviewer to score");
  if (strengths.length === 0 && transcript)
    strengths.push("You attempted the question directly without going off topic");

  /* -------- improvements -------- */
  const improvements: string[] = [];
  if (!has.situation) improvements.push("Open with a quick, concrete situation so the answer has context");
  if (!has.task) improvements.push("Say what *your* task or responsibility was before the actions");
  if (!has.action) improvements.push("Spell out the specific steps you took — use “I” statements");
  if (!has.result) improvements.push("End with the result: what changed, improved, or was achieved");
  if (!has.numbers) improvements.push("Add a number if you can (time saved, customers served, % improvement)");
  if (words > 0 && words < 35) improvements.push("The answer is quite short — aim for 45–90 seconds of speaking");
  if (words > 160) improvements.push("Trim the answer down — long answers lose the interviewer's attention");
  if (!transcript) improvements.push("Record or type an answer so we can score this question");

  /* -------- STAR breakdown -------- */
  const starBreakdown: StarBreakdown = {
    Situation: {
      covered: has.situation,
      note: has.situation
        ? "You anchored the answer in a real moment, which builds credibility."
        : "We couldn't hear a clear setting. Start with when and where this happened.",
    },
    Task: {
      covered: has.task,
      note: has.task
        ? "You explained what you were responsible for."
        : "Add one line on what you specifically needed to achieve.",
    },
    Action: {
      covered: has.action,
      note: has.action
        ? "Your personal actions came through clearly."
        : "Describe the concrete steps you took, in order.",
    },
    Result: {
      covered: has.result,
      note: has.result
        ? "You closed the loop with an outcome — well done."
        : "Finish with what happened because of your actions.",
    },
  };

  /* -------- better answer + quick tip -------- */
  const betterAnswer = [
    q.better.Situation,
    q.better.Task,
    q.better.Action,
    q.better.Result,
  ].join(" ");

  return {
    id: q.id,
    question: q.text,
    category: q.category,
    transcript,
    score,
    summary,
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 3),
    starBreakdown,
    betterAnswer,
    quickTip: quickTipFor(q.category, has),
  };
}

function quickTipFor(
  category: string,
  has: { result: boolean; numbers: boolean; situation: boolean }
): string {
  if (!has.result)
    return "Before you finish an answer, ask yourself: “…and what was the result?” Say that sentence out loud.";
  if (!has.numbers)
    return "One number makes an answer twice as memorable. Even a rough one — “about 20 customers an hour” — works.";
  if (!has.situation)
    return "Start answers with a time and place: “Last December, during the holiday rush…” instantly adds credibility.";
  return category.toLowerCase().includes("situational")
    ? "For situational questions, describe your thinking process step by step — interviewers score the *how*."
    : "Keep using real stories. One specific example always beats three vague ones.";
}

function headlineFor(score: number): string {
  if (score >= 85) return "Outstanding!";
  if (score >= 75) return "Great job!";
  if (score >= 60) return "Solid effort!";
  if (score > 0) return "Good start!";
  return "Let's practise!";
}

/** Keep the most frequently recurring items across questions, max 3. */
function aggregate(lists: string[][]): string[] {
  const counts = new Map<string, number>();
  for (const list of lists)
    for (const item of list) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([item]) => item);
}
