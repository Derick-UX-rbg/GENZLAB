import type { FlopRequest, FlopResponse } from "@/lib/types";

export function mockFlop(input: FlopRequest): Omit<FlopResponse, "mock" | "error"> {
  const platform = input.platform;
  const niche = input.niche || "your niche";
  const caption = input.caption.trim();
  const short = caption.length > 90 ? caption.slice(0, 87) + "…" : caption;
  const timingNote = input.timing?.trim()
    ? ` Timing (“${input.timing.trim()}”) may also have hurt reach.`
    : "";

  const linkedin = platform === "LinkedIn";

  return {
    diagnosis: `The post is readable but soft on the scroll-stop. Hook is late or vague, the value for ${niche} isn’t obvious in the first line, and there’s little reason for someone to reply or save.${timingNote} On ${platform}, clarity + first-line punch beats long warm-ups.`,
    issues: [
      "Weak or delayed hook in the first line",
      "Unclear who it’s for / what outcome they get",
      "Soft or missing CTA (comment, save, share, try)",
      input.whatPosted?.trim()
        ? "Format/visual may not match how people consume this niche"
        : "Format/visual context unclear — hard to match platform norms",
    ],
    rewrites: linkedin
      ? [
          {
            label: "Outcome-first",
            text: `${short}\n\nIf you work in ${niche}, here’s the practical takeaway:\n• Start with the problem your audience already feels\n• Show one concrete example\n• End with a question that invites experience, not fluff\n\nWhat’s worked for you lately?`,
            why: "LinkedIn rewards clear value + discussion prompts.",
          },
          {
            label: "Story beat",
            text: `I posted about ${niche} and it barely moved — so I rewrote the opener.\n\nBefore: soft context.\nAfter: one specific tension + one lesson.\n\n${caption.slice(0, 140)}\n\nIf this is useful, comment “framework” and I’ll share the checklist I use.`,
            why: "Credibility through specificity; CTA is easy to answer.",
          },
          {
            label: "Contrarian clean",
            text: `Unpopular opinion in ${niche}: more content isn’t the fix — clearer hooks are.\n\nMost posts flop because line 1 doesn’t earn line 2.\n\nTry this: problem → proof → ask.\n\nAgree or disagree?`,
            why: "Opinion hooks stop the feed without being spammy.",
          },
        ]
      : [
          {
            label: "Hook punch",
            text:
              platform === "TikTok"
                ? `POV: your ${niche} post flopped because the first 1 second was soft 😭\n\nFix: say the pain out loud first, then the tip.\n\n${short}\n\nComment “HOOK” if you want the 3 openers I reuse.`
                : `Nobody told you this about ${niche}:\n\n${short}\n\nSave this before you post again — your first line is doing too much work for free.\n\nWhich part hit you?`,
            why: "Leads with tension + easy engagement CTA.",
          },
          {
            label: "Relatable NG",
            text: `The way ${niche} content be looking good in drafts then flopping in public… I felt that.\n\nHere’s the cleaner version:\n${short}\n\nIf this is you, drop a 🔥 and tell me your niche — I’ll suggest a stronger opener.`,
            why: "Nigerian Gen-Z voice + conversation bait.",
          },
          {
            label: "Value stack",
            text: `3 reasons your last ${platform} post in ${niche} slept:\n1) Hook was polite\n2) Point was buried\n3) No clear “do this next”\n\nRewrite attempt:\n${short}\n\nTry one change tomorrow: first line = the real problem.`,
            why: "List format is skimmable and actionable.",
          },
        ],
    fixes: [
      "Rewrite the first line as a specific problem or bold claim — no warm-up paragraph.",
      `Make the audience obvious in 1 phrase (who in ${niche} should care).`,
      "Add one easy CTA: ask a yes/no, “comment X”, or “save for later” — not “link in bio” only.",
    ],
  };
}
