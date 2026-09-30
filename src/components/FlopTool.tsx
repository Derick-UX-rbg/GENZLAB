"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { track } from "@/lib/analytics";
import { saveHistoryItem } from "@/lib/history";
import type { FlopPlatform, FlopResponse } from "@/lib/types";
import { FLOP_PLATFORMS } from "@/tools/flop/config";
import { CopyButton } from "./CopyButton";
import { WhatsAppShareButton } from "./ShareButton";
import { EmptyState, ErrorState, LoadingState } from "./States";
import { HistoryPanel } from "./HistoryPanel";

export function FlopTool() {
  const [platform, setPlatform] = useState<FlopPlatform>("Instagram");
  const [caption, setCaption] = useState("");
  const [niche, setNiche] = useState("");
  const [whatPosted, setWhatPosted] = useState("");
  const [timing, setTiming] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FlopResponse | null>(null);

  useEffect(() => {
    track("tool_opened", { tool: "flop" });
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/flop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, caption, niche, whatPosted, timing }),
      });
      const data = (await res.json()) as FlopResponse;
      if (!res.ok && !data.diagnosis) {
        setError(data.error || "Could not diagnose that post.");
        setResult(null);
        return;
      }
      setResult(data);
      if (data.error) setError(data.error);
      track("generation_completed", { tool: "flop", mock: Boolean(data.mock) });
      if (data.diagnosis) {
        saveHistoryItem({
          tool: "flop",
          title: `Flop · ${platform}`,
          preview: data.diagnosis,
          payload: data,
        });
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/20";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-300/70">
          Why Is My Post Flopping? 📱
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Honest post autopsy
        </h1>
        <p className="mt-2 text-sm text-white/45">
          Diagnosis, 3 stronger captions, and 3 fixes for the next post — no fake “guaranteed viral”.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
        <div>
          <span className="mb-1.5 block text-xs font-medium text-white/50">Platform</span>
          <div className="flex flex-wrap gap-2">
            {FLOP_PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  platform === p
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-white/50">
            Caption / post text
          </span>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={5}
            placeholder="Paste the caption or post text that flopped…"
            className={`${field} resize-none`}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-medium text-white/50">
              Niche / topic
            </span>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. skincare, campus life, freelancing, faith, football…"
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">
              What you posted (optional)
            </span>
            <input
              value={whatPosted}
              onChange={(e) => setWhatPosted(e.target.value)}
              placeholder="Reel, carousel, selfie, thread…"
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">
              Timing (optional)
            </span>
            <input
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              placeholder="e.g. Tuesday 11pm WAT"
              className={field}
            />
          </label>
        </div>

        <button
          type="button"
          disabled={loading || caption.trim().length < 8 || niche.trim().length < 2}
          onClick={generate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Smartphone size={16} />
          {loading ? "Autopsying…" : "Tell me why it flopped"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading && <LoadingState label="Checking hooks, clarity, CTA, timing…" />}
        {error && <ErrorState message={error} />}
        {!loading && !result && !error && (
          <EmptyState
            title="No autopsy yet"
            body="Drop the caption, platform, and niche. We’ll be honest — then give you better options."
          />
        )}

        {result?.diagnosis && (
          <>
            <article className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/70">
                  Diagnosis
                </h3>
                <div className="flex gap-1.5">
                  <CopyButton text={result.diagnosis} tool="flop" />
                  <WhatsAppShareButton text={result.diagnosis} tool="flop" />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/85">{result.diagnosis}</p>
              {result.issues.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {result.issues.map((issue) => (
                    <li key={issue} className="text-sm text-white/55">
                      · {issue}
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <div>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                3 rewritten captions
              </h3>
              <div className="space-y-3">
                {result.rewrites.map((r, idx) => (
                  <article
                    key={`${r.label}-${idx}`}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">
                        {idx + 1}. {r.label}
                      </span>
                      <div className="flex gap-1.5">
                        <CopyButton text={r.text} tool="flop" />
                        <WhatsAppShareButton text={r.text} tool="flop" />
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                      {r.text}
                    </p>
                    <p className="mt-2 text-[11px] text-white/35">{r.why}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                3 fixes for next post
              </h3>
              <ol className="mt-3 space-y-2">
                {result.fixes.map((fix, i) => (
                  <li key={fix} className="flex gap-2 text-sm text-white/75">
                    <span className="font-semibold text-cyan-300/80">{i + 1}.</span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-3 flex gap-1.5">
                <CopyButton
                  text={result.fixes.map((f, i) => `${i + 1}. ${f}`).join("\n")}
                  tool="flop"
                  label="Copy fixes"
                />
                <WhatsAppShareButton
                  text={`Next-post fixes:\n${result.fixes.map((f, i) => `${i + 1}. ${f}`).join("\n")}`}
                  tool="flop"
                />
              </div>
            </div>

            {result.mock && (
              <p className="text-center text-[11px] text-amber-200/50">
                Demo fallback — live AI was busy. Try again in a moment.
              </p>
            )}
          </>
        )}
      </div>

      <HistoryPanel tool="flop" />
    </div>
  );
}
