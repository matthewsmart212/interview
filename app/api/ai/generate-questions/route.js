import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PRODUCT } from "@/lib/config/product";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  try {
    const body = await request.json();
    const count = Math.min(
      8,
      Math.max(3, Number(body?.count) || PRODUCT.mock.questionCount)
    );
    const focus = Array.isArray(body?.focus) ? body.focus : ["behavioural"];
    const role = body?.roleTitle || "the role";
    const company = body?.company || "the company";
    const jd = String(body?.jdText || "").slice(0, 8000);
    const cv = String(body?.cvText || "").slice(0, 6000);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        questions: Array.from({ length: count }, (_, i) => ({
          id: `q${i + 1}`,
          text: `Tell me about a time you showed strong ${focus[0] || "teamwork"} for ${role}.`,
          tip: "Use STAR: Situation, Task, Action, Result.",
          type: focus[0] || "behavioural",
        })),
      });
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: PRODUCT.ai.model,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an unnamed interview coach writing realistic interview questions.
Return JSON: { questions: [{ id, text, tip, type }] }
Create exactly ${count} questions. Mix focus areas: ${focus.join(", ")}.
Keep questions conversational and spoken-friendly for TTS.`,
        },
        {
          role: "user",
          content: `Role: ${role}\nCompany: ${company}\nFocus: ${focus.join(", ")}\n\nJD:\n${jd || "(generic)"}\n\nCandidate CV excerpt:\n${cv || "(none)"}`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    const questions = Array.isArray(parsed.questions)
      ? parsed.questions.slice(0, count)
      : [];

    return NextResponse.json({ questions });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Question generation failed." },
      { status: 500 }
    );
  }
}
