export type Vibe =
  | "Flirty"
  | "Funny"
  | "Nonchalant"
  | "Professional"
  | "Savage"
  | "Apologetic"
  | "Romantic";

export interface SayRequest {
  message: string;
  vibe: Vibe;
}

export interface SayReply {
  label: string;
  text: string;
  why: string;
}

export interface SayResponse {
  replies: SayReply[];
  mock: boolean;
  error?: string;
}

export interface ChargeRequest {
  service: string;
  experience: string;
  clientType: string;
  projectScope: string;
  currency: "NGN" | "USD" | "GBP";
}

export interface ChargeResponse {
  low: number;
  mid: number;
  high: number;
  currency: string;
  factors: string[];
  negotiation: string;
  readyMessage: string;
  disclaimer: string;
  mock: boolean;
  error?: string;
}

export interface HustleRequest {
  location: string;
  moneyAvailable: string;
  equipment: string;
  skills: string;
  hoursPerWeek: string;
}

export interface HustleIdea {
  title: string;
  idea: string;
  cost: string;
  timeToFirstSale: string;
  difficulty: "Easy" | "Medium" | "Hard";
  firstCustomer: string;
  firstIncomeTarget: string;
  first3Steps: string[];
}

export interface HustleResponse {
  ideas: HustleIdea[];
  mock: boolean;
  error?: string;
}

export type SituationshipReplyVibe = "Soft" | "Direct" | "Soft-launch";

export interface SituationshipRequest {
  chat: string;
}

export interface SituationshipReply {
  vibe: SituationshipReplyVibe;
  text: string;
  why: string;
}

export interface SituationshipResponse {
  read: string;
  redFlags: string[];
  greenFlags: string[];
  replies: SituationshipReply[];
  mock: boolean;
  error?: string;
}

export type FlopPlatform = "Instagram" | "TikTok" | "Twitter/X" | "LinkedIn";

export interface FlopRequest {
  platform: FlopPlatform;
  caption: string;
  niche: string;
  whatPosted?: string;
  timing?: string;
}

export interface FlopRewrite {
  label: string;
  text: string;
  why: string;
}

export interface FlopResponse {
  diagnosis: string;
  issues: string[];
  rewrites: FlopRewrite[];
  fixes: string[];
  mock: boolean;
  error?: string;
}

export type ToolId = "say" | "charge" | "hustle" | "situationship" | "flop";

export interface HistoryItem {
  id: string;
  tool: ToolId;
  title: string;
  preview: string;
  createdAt: number;
  payload: unknown;
}

export interface ToolMeta {
  id: ToolId;
  slug: string;
  name: string;
  shortName?: string;
  tagline: string;
  description: string;
  accent: string;
  href: string;
}
