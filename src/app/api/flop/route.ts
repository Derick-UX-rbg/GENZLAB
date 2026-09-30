import { NextRequest, NextResponse } from "next/server";
import { generateJson, hasApiKey } from "@/lib/gemini";
import type { FlopPlatform, FlopRequest, FlopResponse, FlopRewrite } from "@/lib/types";
import { FLOP_PLATFORMS, FLOP_SYSTEM, buildFlopUserPrompt } from "@/tools/flop/config";
import { mockFlop } from "@/tools/flop/mock";

export const runtime = "nodejs";
export const maxDuration = 60;

function emptyError(msg: string, status = 400) {
  return NextResponse.json(
    {
      diagnosis: "",
      issues: [],
      rewrites: [],
      fixes: [],
      mock: false,
      error: msg,
    } satisfies FlopResponse,
    { status }
  );
}

function normalize(
  data: Omit<FlopResponse, "mock" | "error">
): Omit<FlopResponse, "mock" | "error"> {
  const rewrites: FlopRewrite[] = (data.rewrites || []).slice(0, 3).map((r, i) => ({
    label: r.label || `Option ${i + 1}`,
    text: r.text || "",
    why: r.why || "",
  }));
  return {
    diagnosis: data.diagnosis || "",
    issues: Array.isArray(data.issues) ? data.issues.slice(0, 5) : [],
    rewrites,
    fixes: Array.isArray(data.fixes) ? data.fixes.slice(0, 3) : [],
  };
}

export async function POST(req: NextRequest) {
  let body: FlopRequest | null = null;
  try {
    body = (await req.json()) as FlopRequest;
    const caption = body.caption?.trim();
    const niche = body.niche?.trim();
    const platform = body.platform;

    if (!FLOP_PLATFORMS.includes(platform as FlopPlatform)) {
      return emptyError("Pick a platform.");
    }
    if (!caption || caption.length < 8) {
      return emptyError("Paste the caption / post text (a bit more detail helps).");
    }
    if (!niche || niche.length < 2) {
      return emptyError("Add your niche / topic.");
    }

    const input: FlopRequest = {
      platform,
      caption,
      niche,
      whatPosted: body.whatPosted?.trim() || "",
      timing: body.timing?.trim() || "",
    };

    if (!hasApiKey()) {
      return NextResponse.json({ ...mockFlop(input), mock: true } satisfies FlopResponse);
    }

    const data = await generateJson<Omit<FlopResponse, "mock" | "error">>({
      system: FLOP_SYSTEM,
      user: buildFlopUserPrompt(input),
      temperature: 0.8,
    });

    const normalized = normalize(data);
    if (!normalized.diagnosis || normalized.rewrites.length < 1) {
      throw new Error("Bad model shape");
    }

    return NextResponse.json({ ...normalized, mock: false } satisfies FlopResponse);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/flop]", msg);
    if (body?.caption?.trim() && body?.platform && body?.niche?.trim()) {
      return NextResponse.json({
        ...mockFlop({
          platform: body.platform,
          caption: body.caption,
          niche: body.niche,
          whatPosted: body.whatPosted,
          timing: body.timing,
        }),
        mock: true,
        error: "All Gemini models busy — showing demo autopsy. Try again shortly.",
      } satisfies FlopResponse);
    }
    return emptyError(msg, 500);
  }
}
