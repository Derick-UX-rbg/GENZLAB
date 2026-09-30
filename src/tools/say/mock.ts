import type { SayReply, Vibe } from "@/lib/types";

const BANKS: Record<Vibe, SayReply[]> = {
  Flirty: [
    {
      label: "Soft tease",
      text: "Hmm you always know how to make my phone light up 😌 What’s the plan though?",
      why: "Warm, invites them to lead without chasing.",
    },
    {
      label: "Playful",
      text: "See you o… saying things like this at this time? You dey try something 👀",
      why: "Light Nigerian tease — flirty without overcommitting.",
    },
    {
      label: "Direct cute",
      text: "Okay wait, I actually like how you talk to me. Don’t stop.",
      why: "Clear interest. Clean and confident.",
    },
  ],
  Funny: [
    {
      label: "Dry humor",
      text: "Bro this message just clocked in late to work. Explain yourself 😂",
      why: "Funny + light call-out without being mean.",
    },
    {
      label: "Relatable",
      text: "I laughed, then I remembered my data. Still funny though 😭",
      why: "Nigerian Gen-Z humor — data + vibe.",
    },
    {
      label: "Banter",
      text: "You too much. If comedy was a hustle you’d be paid already.",
      why: "Compliment wrapped as a joke.",
    },
  ],
  Nonchalant: [
    {
      label: "Cool",
      text: "Noted. What’s good?",
      why: "Short, calm, no over-investing.",
    },
    {
      label: "Lowkey",
      text: "Hmm alright. I’m around if anything.",
      why: "Available but not eager.",
    },
    {
      label: "Chill",
      text: "Say less. We’ll see.",
      why: "Classic nonchalant close.",
    },
  ],
  Professional: [
    {
      label: "Clear",
      text: "Thanks for reaching out. Happy to discuss — what’s the timeline and scope?",
      why: "Professional and moves the convo forward.",
    },
    {
      label: "Polished",
      text: "Got it. I can take a look and share availability + rates by EOD.",
      why: "Confident, sets next step.",
    },
    {
      label: "Warm pro",
      text: "Appreciate the message. Let’s align on goals and deliverables so I can quote properly.",
      why: "Friendly but still business.",
    },
  ],
  Savage: [
    {
      label: "Clean cut",
      text: "Interesting. The energy doesn’t match though.",
      why: "Savage without insults.",
    },
    {
      label: "Dismissive",
      text: "You’re funny. Just not in the way you think.",
      why: "Sharp and memorable.",
    },
    {
      label: "Boundary",
      text: "I’m good actually. Find someone else for that script.",
      why: "Firm boundary, no drama essay.",
    },
  ],
  Apologetic: [
    {
      label: "Sincere",
      text: "You’re right — I fumbled that. I’m sorry. How can I make it better?",
      why: "Owns it + offers repair.",
    },
    {
      label: "Soft",
      text: "My bad, truly. I should’ve handled it better. No excuses.",
      why: "Short and accountable.",
    },
    {
      label: "Warm repair",
      text: "I’ve been thinking about it. I’m sorry I hurt you. Can we talk properly?",
      why: "Emotional ownership without over-explaining.",
    },
  ],
  Romantic: [
    {
      label: "Soft",
      text: "You make ordinary days feel intentional. I hope you know that.",
      why: "Romantic without being cheesy.",
    },
    {
      label: "Intimate",
      text: "I miss your energy. Not the loud stuff — just you.",
      why: "Specific and intimate.",
    },
    {
      label: "Poetic light",
      text: "If comfort had a name, it would sound like you.",
      why: "Romantic and sendable.",
    },
  ],
};

export function mockSay(vibe: Vibe, message: string): SayReply[] {
  const base = BANKS[vibe] || BANKS.Nonchalant;
  // lightly personalize first reply with a snippet if message is short
  const snippet = message.trim().slice(0, 40);
  return base.map((r, i) =>
    i === 0 && snippet.length > 8
      ? {
          ...r,
          text: r.text,
          why: `${r.why} Tuned to: “${snippet}${message.length > 40 ? "…" : ""}”.`,
        }
      : r
  );
}
