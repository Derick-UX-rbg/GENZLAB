import { NextRequest, NextResponse } from "next/server";
import { generateJson, hasApiKey } from "@/lib/gemini";
import type { ChargeRequest, ChargeResponse } from "@/lib/types";
import { CHARGE_SYSTEM, buildChargeUserPrompt } from "@/tools/charge/config";
import { mockCharge } from "@/tools/charge/mock";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: ChargeRequest | null = null;
  try {
    body = (await req.json()) as ChargeRequest;
    if (!body.service?.trim()) {
      return NextResponse.json(
        {
          low: 0,
          mid: 0,
          high: 0,
          currency: body.currency || "NGN",
          factors: [],
          negotiation: "",
          readyMessage: "",
          disclaimer: "",
          mock: false,
          error: "Describe the service.",
        } satisfies ChargeResponse,
        { status: 400 }
      );
    }

    if (!hasApiKey()) {
      return NextResponse.json({ ...mockCharge(body), mock: true } satisfies ChargeResponse);
    }

    const data = await generateJson<Omit<ChargeResponse, "mock" | "error">>({
      system: CHARGE_SYSTEM,
      user: buildChargeUserPrompt(body),
      temperature: 0.6,
    });

    return NextResponse.json({
      ...data,
      currency: data.currency || body.currency,
      mock: false,
    } satisfies ChargeResponse);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/charge]", msg);
    if (body?.service) {
      return NextResponse.json({
        ...mockCharge(body),
        mock: true,
        error: "Live AI hiccuped — showing estimate demo.",
      } satisfies ChargeResponse);
    }
    return NextResponse.json(
      {
        low: 0,
        mid: 0,
        high: 0,
        currency: "NGN",
        factors: [],
        negotiation: "",
        readyMessage: "",
        disclaimer: "",
        mock: false,
        error: msg,
      } satisfies ChargeResponse,
      { status: 500 }
    );
  }
}
