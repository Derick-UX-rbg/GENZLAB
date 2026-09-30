import { NextRequest, NextResponse } from "next/server";
import { generateJson, hasApiKey } from "@/lib/gemini";
import type { SayReply, SayRequest, SayResponse, Vibe } from "@/lib/types";
import { SAY_SYSTEM, VIBES, buildSayUserPrompt } from "@/tools/say/config";
import { mockSay } from "@/tools/say/mock";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: SayRequest | null = null;
  try {
    body = (await req.json()) as SayRequest;
    const message = body.message?.trim();
    const vibe = body.vibe;

    if (!message || message.length < 2) {
      return NextResponse.json(
        { replies: [], mock: false, error: "Paste a message first." } satisfies SayResponse,
        { status: 400 }
      );
    }
    if (!VIBES.includes(vibe as Vibe)) {
      return NextResponse.json(
        { replies: [], mock: false, error: "Pick a valid vibe." } satisfies SayResponse,
        { status: 400 }
      );
    }

    if (!hasApiKey()) {
      return NextResponse.json({
        replies: mockSay(vibe as Vibe, message),
        mock: true,
      } satisfies SayResponse);
    }

    const data = await generateJson<{ replies: SayReply[] }>({
      system: SAY_SYSTEM,
      user: buildSayUserPrompt(message, vibe),
    });

    if (!Array.isArray(data.replies) || data.replies.length < 1) {
      throw new Error("Bad model shape");
    }

    return NextResponse.json({
      replies: data.replies.slice(0, 3),
      mock: false,
    } satisfies SayResponse);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/say]", msg);
    if (body?.message && body?.vibe) {
      return NextResponse.json({
        replies: mockSay(body.vibe as Vibe, body.message),
        mock: true,
        error: "All Gemini models busy — showing demo replies. Try again shortly.",
      } satisfies SayResponse);
    }
    return NextResponse.json(
      { replies: [], mock: false, error: msg } satisfies SayResponse,
      { status: 500 }
    );
  }
}
