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

export interface HistoryItem {
  id: string;
  tool: "say" | "charge" | "hustle";
  title: string;
  preview: string;
  createdAt: number;
  payload: unknown;
}

export interface ToolMeta {
  id: "say" | "charge" | "hustle";
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  href: string;
}
