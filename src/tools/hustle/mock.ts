import type { HustleIdea, HustleRequest } from "@/lib/types";

export function mockHustle(input: HustleRequest): HustleIdea[] {
  const loc = input.location || "your city";
  const money = input.moneyAvailable || "low budget";
  const skills = input.skills || "general skills";

  return [
    {
      title: "Campus / estate phone photography",
      idea: `Offer clean portrait + birthday shoots around ${loc} using a phone. Sell 10–20 edited photos + 2 Reels. Position as affordable and fast.`,
      cost: "₦0–₦8k (transport + light props)",
      timeToFirstSale: "2–5 days",
      difficulty: "Easy",
      firstCustomer: `Post in ${loc} WhatsApp groups, campus/estate communities, and ask 3 friends for referrals.`,
      firstIncomeTarget: "₦25k–₦40k in first 2 weeks",
      first3Steps: [
        "Shoot a free mini portfolio of 8 strong photos tonight",
        "Set 2 packages (Quick ₦8k / Full ₦18k) and payment via transfer",
        "DM 20 people in local groups with samples + weekend availability",
      ],
    },
    {
      title: "WhatsApp resume + LinkedIn fix",
      idea: `Use your writing/design sense to rewrite CVs and tidy LinkedIn for job seekers. High demand among Nigerian grads.`,
      cost: "₦0–₦3k",
      timeToFirstSale: "1–3 days",
      difficulty: "Easy",
      firstCustomer: "Friends job-hunting + Twitter/TikTok 'CV review' posts + alumni groups.",
      firstIncomeTarget: "₦30k in first 10 days (10 clients × ₦3k)",
      first3Steps: [
        "Make 1 before/after sample CV",
        "Price Basic ₦3k / Premium ₦7k",
        "Post offer + turnaround time in 5 groups today",
      ],
    },
    {
      title: "Micro content for small businesses",
      idea: `Create 8–12 short product/service clips weekly for shops near ${loc}. Many SMEs want Instagram presence but hate filming.`,
      cost: `₦5k–₦20k depending on ${money}`,
      timeToFirstSale: "4–10 days",
      difficulty: "Medium",
      firstCustomer: "Walk into 10 shops, show sample Reel, offer first week discounted.",
      firstIncomeTarget: "₦50k–₦80k / month from 2 retainers",
      first3Steps: [
        "Film 3 sample Reels for a local shop (even if free once)",
        "Package: 8 clips/week for ₦40k",
        "Pitch 10 businesses with phone samples in person",
      ],
    },
    {
      title: "Skill-based micro freelance",
      idea: `Package one sharp offer from your skills (${skills}) — e.g. Canva flyers, Notion setup, tutoring, voiceover, basic web edits — and sell on WhatsApp + Jiji + Twitter.`,
      cost: "₦0–₦10k",
      timeToFirstSale: "3–7 days",
      difficulty: "Medium",
      firstCustomer: "Post daily in niche communities; ask for one paid testimonial fast.",
      firstIncomeTarget: "₦40k in first 3 weeks",
      first3Steps: [
        "Pick ONE offer and write a 1-paragraph pitch",
        "Make 3 portfolio samples this weekend",
        "Send 15 personalized DMs/day for 5 days",
      ],
    },
    {
      title: "Weekend bulk snack / drink run",
      idea: `If you have a bit of capital (${money}), run a focused weekend food/drink mini-hustle near hostels, churches, or offices in ${loc}. Keep SKUs few and margins clear.`,
      cost: "₦15k–₦50k stock",
      timeToFirstSale: "This weekend",
      difficulty: "Medium",
      firstCustomer: "Pre-take orders in 2 WhatsApp groups before buying stock.",
      firstIncomeTarget: "₦20k–₦45k profit over 2 weekends",
      first3Steps: [
        "Pick 2 bestsellers only and calculate profit per unit",
        "Collect 15 pre-orders before stocking",
        "Sell + reinvest once, then expand SKUs carefully",
      ],
    },
  ];
}
