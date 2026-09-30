import { NextResponse } from "next/server";
import { GEMINI_MODEL_CASCADE, hasApiKey } from "@/lib/gemini";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    geminiConfigured: hasApiKey(),
    product: "GENZLAB",
    modelCascade: GEMINI_MODEL_CASCADE,
  });
}
