import { NextResponse } from "next/server";
import mammoth from "mammoth";
import OpenAI from "openai";
import { PRODUCT } from "@/lib/config/product";

export const runtime = "nodejs";
export const maxDuration = 60;

async function extractText(file) {
  const name = (file.name || "").toLowerCase();
  const type = file.type || "";
  const buffer = Buffer.from(await file.arrayBuffer());

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const parsed = await parser.getText();
      return (parsed.text || "").trim();
    } finally {
      await parser.destroy().catch(() => {});
    }
  }

  if (
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return (result.value || "").trim();
  }

  if (type.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".md")) {
    return buffer.toString("utf8").trim();
  }

  throw new Error("Unsupported file type. Upload a PDF or DOCX.");
}

function fallbackScore(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const hasEmail = /@/.test(text);
  const hasExperience = /experience|worked|role|job/i.test(text);
  let score = 55;
  if (words > 200) score += 10;
  if (words > 400) score += 8;
  if (hasEmail) score += 5;
  if (hasExperience) score += 7;
  return Math.min(92, score);
}

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const text = await extractText(file);
    if (!text || text.length < 40) {
      return NextResponse.json(
        { error: "Could not extract enough text from that file." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    let score = fallbackScore(text);
    let summary = text.slice(0, 280).replace(/\s+/g, " ").trim();
    let strengths = [];
    let gaps = [];

    if (apiKey) {
      try {
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
          model: PRODUCT.ai.model,
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You score CVs for interview readiness. Return JSON: { score: number 0-100, summary: string, strengths: string[], gaps: string[] }. Be practical and concise.",
            },
            {
              role: "user",
              content: `Score this CV:\n\n${text.slice(0, 12000)}`,
            },
          ],
        });
        const raw = completion.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(raw);
        if (typeof parsed.score === "number") score = Math.round(parsed.score);
        if (parsed.summary) summary = String(parsed.summary);
        if (Array.isArray(parsed.strengths)) strengths = parsed.strengths.slice(0, 5);
        if (Array.isArray(parsed.gaps)) gaps = parsed.gaps.slice(0, 5);
      } catch {
        // keep fallback score
      }
    }

    return NextResponse.json({
      text,
      score,
      summary,
      strengths,
      gaps,
      fileName: file.name,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Failed to parse CV." },
      { status: 500 }
    );
  }
}
