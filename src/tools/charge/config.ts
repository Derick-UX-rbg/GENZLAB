export const EXPERIENCE_LEVELS = [
  "Beginner (0–1 yr)",
  "Intermediate (1–3 yrs)",
  "Pro (3–5 yrs)",
  "Expert (5+ yrs)",
];

export const CLIENT_TYPES = [
  "Student / personal",
  "Small business (Nigeria)",
  "Startup",
  "Agency / mid-size",
  "Corporate / international",
];

export const SCOPES = [
  "One-off / small",
  "Standard project",
  "Large / multi-week",
  "Ongoing retainer",
];

export const CURRENCIES = ["NGN", "USD", "GBP"] as const;

export const CHARGE_SYSTEM = `You are GENZLAB's "What Should I Charge?" — a pricing coach for Nigerian creatives and freelancers (Gen Z).
Give realistic market-aware estimates for Nigeria + remote clients. Be practical, not hype.
Always label clearly as an ESTIMATE. Never invent fake certifications.
Return STRICT JSON only:
{
  "low": number,
  "mid": number,
  "high": number,
  "currency": "NGN"|"USD"|"GBP",
  "factors": ["short factor 1", "factor 2", "factor 3", "factor 4"],
  "negotiation": "2-4 sentence negotiation strategy",
  "readyMessage": "a polished WhatsApp/email message the user can send to quote the mid rate",
  "disclaimer": "short estimate disclaimer"
}
Use whole numbers. For NGN use typical Nigerian freelance ranges. Include 3–5 factors.`;

export function buildChargeUserPrompt(input: {
  service: string;
  experience: string;
  clientType: string;
  projectScope: string;
  currency: string;
}): string {
  return `Service: ${input.service}
Experience: ${input.experience}
Client type: ${input.clientType}
Project scope: ${input.projectScope}
Currency: ${input.currency}

Provide a pricing estimate with range, factors, negotiation strategy, and a ready-to-send quote message.`;
}
