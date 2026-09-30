import { NextRequest, NextResponse } from "next/server";
import { generateJson, hasApiKey } from "@/lib/gemini";
import type {
  SituationshipReply,
  SituationshipRequest,
  SituationshipResponse,
} from "@/lib/types";
import {
  SITUATIONSHIP_SYSTEM,
  buildSituationshipUserPrompt,
} from "@/tools/situationship/config";
import { mockSituationship } from "@/tools/situationship/mock";

export const runtime = "nodejs";
export const maxDuration = 60;

function normalize(
  data: Omit<SituationshipResponse, "mock" | "error">
): Omit<SituationshipResponse, "mock" | "error"> {
  const replies = (data.replies || []).slice(0, 3).map((r, i) => {
    const fallbackVibe = (["Soft", "Direct", "Soft-launch"] as const)[i];
    return {
      vibe: r.vibe || fallbackVibe,
      text: r.text || "",
      why: r.why || "",
    } satisfies SituationshipReply;
  });
  return {
    read: data.read || "",
    redFlags: Array.isArray(data.redFlags) ? data.redFlags.slice(0, 4) : [],
    greenFlags: Array.isArray(data.greenFlags) ? data.greenFlags.slice(0, 4) : [],
    replies,
  };
}

export async function POST(req: NextRequest) {
  let body: SituationshipRequest | null = null;
  try {
    body = (await req.json()) as SituationshipRequest;
    const chat = body.chat?.trim();

    if (!chat || chat.length < 8) {
      return NextResponse.json(
        {
          read: "",
          redFlags: [],
          greenFlags: [],
          replies: [],
          mock: false,
          error: "Paste the chat or describe what’s confusing (a bit more detail helps).",
        } satisfies SituationshipResponse,
        { status: 400 }
      );
    }

    if (!hasApiKey()) {
      return NextResponse.json({
        ...mockSituationship(chat),
        mock: true,
      } satisfies SituationshipResponse);
    }

    const data = await generateJson<Omit<SituationshipResponse, "mock" | "error">>({
      system: SITUATIONSHIP_SYSTEM,
      user: buildSituationshipUserPrompt(chat),
      temperature: 0.75,
    });

    const normalized = normalize(data);
    if (!normalized.read || normalized.replies.length < 1) {
      throw new Error("Bad model shape");
    }

    return NextResponse.json({
      ...normalized,
      mock: false,
    } satisfies SituationshipResponse);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/situationship]", msg);
    if (body?.chat?.trim()) {
      return NextResponse.json({
        ...mockSituationship(body.chat),
        mock: true,
        error: "All Gemini models busy — showing demo translation. Try again shortly.",
      } satisfies SituationshipResponse);
    }
    return NextResponse.json(
      {
        read: "",
        redFlags: [],
        greenFlags: [],
        replies: [],
        mock: false,
        error: msg,
      } satisfies SituationshipResponse,
      { status: 500 }
    );
  }
}
