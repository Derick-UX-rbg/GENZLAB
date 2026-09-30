"use client";

import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import { track } from "@/lib/analytics";
import { saveHistoryItem } from "@/lib/history";
import type { HustleIdea, HustleResponse } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { ShareButton } from "./ShareButton";
import { EmptyState, ErrorState, LoadingState } from "./States";
import { HistoryPanel } from "./HistoryPanel";

const DIFF_COLOR = {
  Easy: "text-emerald-300 bg-emerald-500/15",
  Medium: "text-amber-300 bg-amber-500/15",
  Hard: "text-rose-300 bg-rose-500/15",
} as const;

export function HustleTool() {
  const [location, setLocation] = useState("");
  const [moneyAvailable, setMoneyAvailable] = useState("");
  const [equipment, setEquipment] = useState("");
  const [skills, setSkills] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<HustleIdea[]>([]);
  const [mock, setMock] = useState(false);

  useEffect(() => {
    track("tool_opened", { tool: "hustle" });
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hustle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          moneyAvailable,
          equipment,
          skills,
          hoursPerWeek,
        }),
      });
      const data = (await res.json()) as HustleResponse;
      if (!res.ok && !data.ideas?.length) {
        setError(data.error || "Could not generate ideas.");
        setIdeas([]);
        return;
      }
      setIdeas(data.ideas || []);
      setMock(Boolean(data.mock));
      if (data.error) setError(data.error);
      track("generation_completed", { tool: "hustle", mock: Boolean(data.mock) });
      if (data.ideas?.length) {
        saveHistoryItem({
          tool: "hustle",
          title: `Hustle · ${location}`,
          preview: data.ideas.map((i) => i.title).join(" · "),
          payload: data.ideas,
        });
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-amber-300/70">
          What Can I Hustle?
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Real income experiments
        </h1>
        <p className="mt-2 text-sm text-white/45">
          5 realistic ideas with cost, steps, and first-income targets. No scams. No gambling.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-medium text-white/50">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Yaba, Lagos · Gwarinpa, Abuja · remote NG"
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">
              Money to start
            </span>
            <input
              value={moneyAvailable}
              onChange={(e) => setMoneyAvailable(e.target.value)}
              placeholder="e.g. ₦10k · almost nothing"
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">
              Hours / week
            </span>
            <input
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              placeholder="e.g. 8–12 hours"
              className={field}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-medium text-white/50">
              Equipment / assets
            </span>
            <input
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="e.g. Android phone, laptop, bike, sewing machine…"
              className={field}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-medium text-white/50">Skills</span>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              rows={3}
              placeholder="e.g. Canva, writing, hair, tutoring maths, video editing…"
              className={`${field} resize-none`}
            />
          </label>
        </div>

        <button
          type="button"
          disabled={loading || !location.trim() || !skills.trim()}
          onClick={generate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-amber-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Rocket size={16} />
          {loading ? "Finding experiments…" : "Show 5 hustles"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading && <LoadingState label="Filtering for legal, realistic Nigerian plays…" />}
        {error && <ErrorState message={error} />}
        {!loading && !error && ideas.length === 0 && (
          <EmptyState
            title="No hustles yet"
            body="Tell us where you are and what you can do. We’ll suggest experiments — not fantasies."
          />
        )}
        {ideas.map((idea, idx) => {
          const shareText = `${idea.title}\n\n${idea.idea}\n\nCost: ${idea.cost}\nFirst income: ${idea.firstIncomeTarget}\n\nSteps:\n${idea.first3Steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
          return (
            <article
              key={`${idea.title}-${idx}`}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-white/35">#{idx + 1}</span>
                  <h3 className="text-base font-semibold text-white">{idea.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${DIFF_COLOR[idea.difficulty]}`}
                  >
                    {idea.difficulty}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <CopyButton text={shareText} tool="hustle" />
                  <ShareButton title={idea.title} text={shareText} tool="hustle" preferWhatsApp />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/70">{idea.idea}</p>
              <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                <div className="rounded-lg bg-black/30 px-3 py-2">
                  <dt className="text-white/35">Cost</dt>
                  <dd className="mt-0.5 font-medium text-white/80">{idea.cost}</dd>
                </div>
                <div className="rounded-lg bg-black/30 px-3 py-2">
                  <dt className="text-white/35">Time to first sale</dt>
                  <dd className="mt-0.5 font-medium text-white/80">{idea.timeToFirstSale}</dd>
                </div>
                <div className="rounded-lg bg-black/30 px-3 py-2">
                  <dt className="text-white/35">First customer</dt>
                  <dd className="mt-0.5 font-medium text-white/80">{idea.firstCustomer}</dd>
                </div>
                <div className="rounded-lg bg-black/30 px-3 py-2">
                  <dt className="text-white/35">First-income target</dt>
                  <dd className="mt-0.5 font-medium text-white/80">{idea.firstIncomeTarget}</dd>
                </div>
              </dl>
              <ol className="mt-3 space-y-1.5">
                {idea.first3Steps.map((step, i) => (
                  <li key={step} className="flex gap-2 text-sm text-white/65">
                    <span className="font-semibold text-amber-300/80">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
        {mock && ideas.length > 0 && (
          <p className="text-center text-[11px] text-amber-200/50">
            Demo fallback — live AI was busy. Try again in a moment.
          </p>
        )}
      </div>

      <HistoryPanel tool="hustle" />
    </div>
  );
}
