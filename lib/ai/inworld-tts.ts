/**
 * Inworld TTS server helper.
 * API key is the Basic (Base64) credential from the Inworld portal.
 */

type TtsOptions = {
  voiceId?: string;
  modelId?: string;
  temperature?: number;
};

export async function synthesizeSpeech(
  text: string,
  options: TtsOptions = {}
): Promise<Buffer> {
  const apiKey = process.env.INWORLD_API_KEY;
  if (!apiKey) throw new Error("Missing INWORLD_API_KEY");

  const voiceId = options.voiceId || process.env.INWORLD_VOICE_ID || "Sarah";
  const modelId = options.modelId || process.env.INWORLD_TTS_MODEL || "inworld-tts-1.5-max";

  const res = await fetch("https://api.inworld.ai/tts/v1/voice", {
    method: "POST",
    headers: {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voiceId,
      modelId,
      audioConfig: {
        audioEncoding: "MP3",
        sampleRateHertz: 24000,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Inworld TTS failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as { audioContent?: string };
  if (!data?.audioContent) throw new Error("Inworld TTS returned no audio");
  return Buffer.from(data.audioContent, "base64");
}
