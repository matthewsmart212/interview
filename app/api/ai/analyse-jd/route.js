import { NextResponse } from "next/server";
import OpenAI from "openai";
import { PRODUCT } from "@/lib/config/product";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  try {
    const { text } = await request.json();
    const jd = String(text || "").trim();
    if (jd.length < 40) {
      return NextResponse.json({ error: "Paste a fuller job description." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        roleTitle: "Role from job description",
        company: "",
        summary: jd.slice(0, 220),
        mustHaves: [],
        niceToHaves: [],
        keywords: [],
      });
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: PRODUCT.ai.model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Extract structured hiring signal from a job description. Return JSON: { roleTitle, company, summary, mustHaves: string[], niceToHaves: string[], keywords: string[] }",
        },
        { role: "user", content: jd.slice(0, 14000) },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return NextResponse.json({
      roleTitle: parsed.roleTitle || "Role from job description",
      company: parsed.company || "",
      summary: parsed.summary || "",
      mustHaves: parsed.mustHaves || [],
      niceToHaves: parsed.niceToHaves || [],
      keywords: parsed.keywords || [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "JD analysis failed." },
      { status: 500 }
    );
  }
}
