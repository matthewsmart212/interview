import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PRODUCT } from "@/lib/config/product";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  try {
    const body = await request.json();
    const answers = Array.isArray(body?.answers) ? body.answers : [];
    const role = body?.roleTitle || "the role";

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        overallScore: 72,
        summary: "Solid practice session. Keep answers concrete and finish with a clear result.",
        strengths: ["Clear structure in places", "Good effort under time pressure"],
        improvements: ["Add more measurable outcomes", "Tighten openings"],
        perAnswer: answers.map((a, i) => ({
          questionId: a.questionId || `q${i + 1}`,
          score: 70,
          note: "Add a stronger result.",
        })),
      });
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: PRODUCT.ai.model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an unnamed interview coach giving concise, actionable feedback.
Return JSON: {
  overallScore: number 0-100,
  summary: string,
  strengths: string[],
  improvements: string[],
  perAnswer: [{ questionId, score, note }]
}`,
        },
        {
          role: "user",
          content: `Role: ${role}\n\nAnswers:\n${JSON.stringify(answers).slice(0, 14000)}`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Feedback failed." },
      { status: 500 }
    );
  }
}
