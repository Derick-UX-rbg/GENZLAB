import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Cascade order: prefer fast flash, then aliases, then pro.
 * Skip models that return 404 / "no longer available".
 * Retry briefly on 503 / 429 / high demand before moving on.
 */
export const GEMINI_MODEL_CASCADE = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-pro-latest",
] as const;

export function hasApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function isGone(msg: string): boolean {
  return /404|not found|no longer available|is not found|unsupported/i.test(msg);
}

function isBusy(msg: string): boolean {
  return /503|429|high demand|temporarily|unavailable|resource.?exhausted|quota|rate.?limit/i.test(
    msg
  );
}

export async function generateJson<T>(opts: {
  system: string;
  user: string;
  temperature?: number;
}): Promise<T> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("MISSING_API_KEY");

  const genAI = new GoogleGenerativeAI(key);
  const errors: string[] = [];

  for (const modelId of GEMINI_MODEL_CASCADE) {
    const model = genAI.getGenerativeModel({
      model: modelId,
      systemInstruction: opts.system,
      generationConfig: {
        temperature: opts.temperature ?? 0.85,
        responseMimeType: "application/json",
      },
    });

    // Up to 2 attempts per model on busy/rate-limit; skip immediately if gone.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await model.generateContent(opts.user);
        const text = result.response.text();
        const parsed = JSON.parse(text) as T;
        console.info(`[gemini] ok model=${modelId} attempt=${attempt + 1}`);
        return parsed;
      } catch (err) {
        const msg = errMessage(err);
        errors.push(`${modelId}: ${msg.slice(0, 180)}`);

        if (isGone(msg)) {
          console.warn(`[gemini] skip gone model=${modelId}`);
          break; // next model
        }

        if (isBusy(msg) && attempt === 0) {
          console.warn(`[gemini] busy model=${modelId}, retry once`);
          await sleep(900);
          continue;
        }

        // Non-retryable or second busy failure → try next model
        console.warn(`[gemini] fail model=${modelId} attempt=${attempt + 1}`);
        break;
      }
    }
  }

  throw new Error(
    `ALL_MODELS_FAILED: ${errors.slice(0, 4).join(" | ") || "no models tried"}`
  );
}

export function extractJson<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1]?.trim() || text.trim();
  return JSON.parse(raw) as T;
}
