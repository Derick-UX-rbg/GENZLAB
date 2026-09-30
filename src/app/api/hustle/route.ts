import { NextRequest, NextResponse } from "next/server";
import { generateJson, hasApiKey } from "@/lib/gemini";
import type { HustleIdea, HustleRequest, HustleResponse } from "@/lib/types";
import { HUSTLE_SYSTEM, buildHustleUserPrompt } from "@/tools/hustle/config";
import { mockHustle } from "@/tools/hustle/mock";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: HustleRequest | null = null;
  try {
    body = (await req.json()) as HustleRequest;
    if (!body.location?.trim() || !body.skills?.trim()) {
      return NextResponse.json(
        {
          ideas: [],
          mock: false,
          error: "Add at least your location and skills.",
        } satisfies HustleResponse,
        { status: 400 }
      );
    }

    if (!hasApiKey()) {
      return NextResponse.json({
        ideas: mockHustle(body),
        mock: true,
      } satisfies HustleResponse);
    }

    const data = await generateJson<{ ideas: HustleIdea[] }>({
      system: HUSTLE_SYSTEM,
      user: buildHustleUserPrompt(body),
      temperature: 0.8,
    });

    return NextResponse.json({
      ideas: (data.ideas || []).slice(0, 5),
      mock: false,
    } satisfies HustleResponse);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/hustle]", msg);
    if (body?.location) {
      return NextResponse.json({
        ideas: mockHustle(body),
        mock: true,
        error: "All Gemini models busy — showing demo ideas. Try again shortly.",
      } satisfies HustleResponse);
    }
    return NextResponse.json(
      { ideas: [], mock: false, error: msg } satisfies HustleResponse,
      { status: 500 }
    );
  }
}
