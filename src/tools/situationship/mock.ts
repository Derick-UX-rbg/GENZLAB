import type { SituationshipResponse } from "@/lib/types";

export function mockSituationship(chat: string): Omit<SituationshipResponse, "mock" | "error"> {
  const snippet = chat.trim().slice(0, 60);
  const soundsHotCold =
    /maybe|we'll see|busy|later|if i can|soon|i'll try|not sure/i.test(chat);
  const soundsWarm =
    /miss you|thinking of you|when can i see|call me|babe|dear/i.test(chat);

  return {
    read: soundsHotCold
      ? `They're keeping you in the maybe zone — warm enough to stay in your head, vague enough to avoid commitment. The “${snippet}${chat.length > 60 ? "…" : ""}” energy is classic soft access without soft responsibility.`
      : soundsWarm
        ? `There's real interest in the words, but the consistency is what will tell. Right now it reads like they like the vibe of you — not necessarily the title. Don't invent a definition they haven't earned.`
        : `Mixed signals. They're engaging, but not clearly choosing you. Treat this as information, not a promise — and reply in a way that protects your peace.`,
    redFlags: soundsHotCold
      ? [
          "Vague timelines (“soon”, “later”, “if I can”)",
          "Keeps conversation open without making plans",
          "You feel more invested than the effort you receive",
        ]
      : [
          "Conversation stays fun but never gets clear",
          "Effort only shows up when it's convenient for them",
        ],
    greenFlags: soundsWarm
      ? [
          "They initiate and sound affectionate",
          "They're open to talking / seeing you",
        ]
      : [
          "They're still responding (not ghosting)",
          "There's enough signal to ask for clarity without drama",
        ],
    replies: [
      {
        vibe: "Soft",
        text: "I’ve been thinking about us a bit… I like talking to you, I just don’t want to keep guessing. What’s this looking like for you?",
        why: "Gentle, opens the door for honesty without accusing.",
      },
      {
        vibe: "Direct",
        text: "I need clarity. Are we just vibing, or are you actually trying something real? I’m good either way — I just don’t do confusion.",
        why: "Clean boundary. Forces a choice without insulting them.",
      },
      {
        vibe: "Soft-launch",
        text: "No pressure at all — just checking. If you’re free this week and actually want to hang, say when. If not, I’ll stop reading into it.",
        why: "Tests effort with a real plan; exits chase mode politely.",
      },
    ],
  };
}
