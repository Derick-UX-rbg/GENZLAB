import type { ChargeRequest, ChargeResponse } from "@/lib/types";

function baseForCurrency(currency: string) {
  if (currency === "USD") return { low: 80, mid: 180, high: 350 };
  if (currency === "GBP") return { low: 60, mid: 140, high: 280 };
  return { low: 45000, mid: 120000, high: 280000 };
}

const EXP_MULT: Record<string, number> = {
  "Beginner (0–1 yr)": 0.55,
  "Intermediate (1–3 yrs)": 1,
  "Pro (3–5 yrs)": 1.45,
  "Expert (5+ yrs)": 2.1,
};

const CLIENT_MULT: Record<string, number> = {
  "Student / personal": 0.55,
  "Small business (Nigeria)": 0.9,
  Startup: 1.15,
  "Agency / mid-size": 1.4,
  "Corporate / international": 1.85,
};

const SCOPE_MULT: Record<string, number> = {
  "One-off / small": 0.7,
  "Standard project": 1,
  "Large / multi-week": 1.7,
  "Ongoing retainer": 2.2,
};

function roundNice(n: number, currency: string) {
  if (currency === "NGN") return Math.round(n / 1000) * 1000;
  return Math.round(n / 5) * 5;
}

export function mockCharge(input: ChargeRequest): Omit<ChargeResponse, "mock"> {
  const base = baseForCurrency(input.currency);
  const m =
    (EXP_MULT[input.experience] ?? 1) *
    (CLIENT_MULT[input.clientType] ?? 1) *
    (SCOPE_MULT[input.projectScope] ?? 1);

  const low = roundNice(base.low * m, input.currency);
  const mid = roundNice(base.mid * m, input.currency);
  const high = roundNice(base.high * m, input.currency);
  const symbol =
    input.currency === "NGN" ? "₦" : input.currency === "GBP" ? "£" : "$";

  return {
    low,
    mid,
    high,
    currency: input.currency,
    factors: [
      `${input.experience} experience sets your floor.`,
      `${input.clientType} clients typically budget differently.`,
      `${input.projectScope} changes delivery hours and risk.`,
      `Market for “${input.service}” in NG + remote is competitive — value your revisions and turnaround.`,
    ],
    negotiation:
      "Lead with value and scope, not desperation. Quote the mid rate, explain what’s included (revisions, timeline, deliverables), and offer a lighter package at low if they push. Never drop below low without cutting scope.",
    readyMessage: `Hi! Thanks for reaching out about ${input.service}. Based on the scope you described (${input.projectScope.toLowerCase()}), my estimate is ${symbol}${mid.toLocaleString()} (${input.currency}). This covers delivery, ${input.projectScope.includes("retainer") ? "ongoing support," : "standard revisions,"} and a clear timeline. Happy to adjust a lighter package if needed — want me to send a quick breakdown?`,
    disclaimer:
      "Estimate only — not a quote guarantee. Local market, portfolio strength, and urgency can shift rates.",
  };
}
