import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-3.8-flash";

export function hasApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export async function generateJson<T>(opts: {
  system: string;
  user: string;
  temperature?: number;
}): Promise<T> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("MISSING_API_KEY");

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: opts.system,
    generationConfig: {
      temperature: opts.temperature ?? 0.85,
      responseMimeType: "application/json",
    },
  });

  let lastErr: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const result = await model.generateContent(opts.user);
      const text = result.response.text();
      return JSON.parse(text) as T;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const retryable = /503|high demand|temporarily|unavailable|429/i.test(msg);
      if (!retryable || attempt === 2) break;
      await sleep(1200 * (attempt + 1));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export function extractJson<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1]?.trim() || text.trim();
  return JSON.parse(raw) as T;
}
