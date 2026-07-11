import { NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/ai/inworld-tts";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request) {
  try {
    const body = await request.json();
    const text = String(body?.text || "").trim();
    if (!text) {
      return NextResponse.json({ error: "Missing text." }, { status: 400 });
    }

    const audio = await synthesizeSpeech(text, {
      voiceId: body?.voiceId,
      modelId: body?.modelId,
      temperature: body?.temperature,
    });

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "TTS failed." },
      { status: 500 }
    );
  }
}
