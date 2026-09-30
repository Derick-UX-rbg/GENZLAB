import { GoogleGenerativeAI } from "@google/generative-ai";

export function hasApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
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
    model: "gemini-2.0-flash",
    systemInstruction: opts.system,
    generationConfig: {
      temperature: opts.temperature ?? 0.85,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(opts.user);
  const text = result.response.text();
  return JSON.parse(text) as T;
}

export function extractJson<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1]?.trim() || text.trim();
  return JSON.parse(raw) as T;
}
