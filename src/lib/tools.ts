import type { ToolMeta } from "./types";

export const TOOLS: ToolMeta[] = [
  {
    id: "say",
    slug: "what-do-i-say",
    name: "What Do I Say?",
    tagline: "Reply like yourself — but better",
    description:
      "Paste their message, pick a vibe, get 3 natural Nigerian Gen-Z replies you can actually send.",
    accent: "from-fuchsia-500/30 via-pink-500/10 to-transparent",
    href: "/tools/what-do-i-say",
  },
  {
    id: "charge",
    slug: "what-should-i-charge",
    name: "What Should I Charge?",
    tagline: "Stop guessing your rates",
    description:
      "Service, experience, client, scope → a realistic pricing range, negotiation tips, and a ready message. Estimate only.",
    accent: "from-emerald-500/30 via-teal-500/10 to-transparent",
    href: "/tools/what-should-i-charge",
  },
  {
    id: "hustle",
    slug: "what-can-i-hustle",
    name: "What Can I Hustle?",
    tagline: "Real income experiments",
    description:
      "Location, money, skills, hours → 5 realistic side-hustle ideas with cost, steps, and first-income targets. No scams.",
    accent: "from-amber-500/30 via-orange-500/10 to-transparent",
    href: "/tools/what-can-i-hustle",
  },
];

export function getTool(id: ToolMeta["id"]): ToolMeta {
  return TOOLS.find((t) => t.id === id)!;
}
