"use client";

import { useEffect, useState } from "react";
import { HeartCrack } from "lucide-react";
import { track } from "@/lib/analytics";
import { saveHistoryItem } from "@/lib/history";
import type { SituationshipReply, SituationshipResponse } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { WhatsAppShareButton } from "./ShareButton";
import { EmptyState, ErrorState, LoadingState } from "./States";
import { HistoryPanel } from "./HistoryPanel";

const VIBE_STYLE: Record<SituationshipReply["vibe"], string> = {
  Soft: "bg-violet-500/15 text-violet-200",
  Direct: "bg-rose-500/15 text-rose-200",
  "Soft-launch": "bg-sky-500/15 text-sky-200",
};

export function SituationshipTool() {
  const [chat, setChat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SituationshipResponse | null>(null);

  useEffect(() => {
    track("tool_opened", { tool: "situationship" });
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/situationship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat }),
      });
      const data = (await res.json()) as SituationshipResponse;
      if (!res.ok && !data.read) {
        setError(data.error || "Could not translate that.");
        setResult(null);
        return;
      }
      setResult(data);
      if (data.error) setError(data.error);
      track("generation_completed", {
        tool: "situationship",
        mock: Boolean(data.mock),
      });
      if (data.read) {
        saveHistoryItem({
          tool: "situationship",
          title: "Situationship read",
          preview: data.read,
          payload: data,
        });
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-violet-300/70">
          Situationship Translator
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Decode the mixed signals
        </h1>
        <p className="mt-2 text-sm text-white/45">
          Paste the confusing chat. Get an honest read, flags, and 3 replies you can actually send.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-white/50">
            Chat / situation
          </span>
          <textarea
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            rows={7}
            placeholder={`Them: Sorry I disappeared, work has been crazy\nYou: It’s fine… I just thought we were vibing\nThem: We are. I’ll link you soon, maybe weekend\n\nOr just describe it in your own words…`}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/20"
          />
        </label>

        <button
          type="button"
          disabled={loading || chat.trim().length < 8}
          onClick={generate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <HeartCrack size={16} />
          {loading ? "Translating…" : "Translate this situationship"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading && (
          <LoadingState label="Reading between the lines — no soft lies…" />
        )}
        {error && <ErrorState message={error} />}
        {!loading && !result && !error && (
          <EmptyState
            title="Nothing decoded yet"
            body="Drop the confusing thread (or describe it). We’ll tell you what’s actually happening."
          />
        )}

        {result?.read && (
          <>
            <article className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-200/70">
                  The read
                </h3>
                <div className="flex gap-1.5">
                  <CopyButton text={result.read} tool="situationship" />
                  <WhatsAppShareButton text={result.read} tool="situationship" />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/85">{result.read}</p>
            </article>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-200/70">
                  Red flags
                </h3>
                {result.redFlags.length === 0 ? (
                  <p className="mt-2 text-sm text-white/35">None obvious from this snippet.</p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {result.redFlags.map((f) => (
                      <li key={f} className="text-sm text-white/70">
                        · {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/70">
                  Green flags
                </h3>
                {result.greenFlags.length === 0 ? (
                  <p className="mt-2 text-sm text-white/35">Nothing solid yet — watch actions.</p>
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {result.greenFlags.map((f) => (
                      <li key={f} className="text-sm text-white/70">
                        · {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {result.replies.map((r) => (
              <article
                key={r.vibe}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${VIBE_STYLE[r.vibe]}`}
                  >
                    {r.vibe}
                  </span>
                  <div className="flex gap-1.5">
                    <CopyButton text={r.text} tool="situationship" />
                    <WhatsAppShareButton text={r.text} tool="situationship" />
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">
                  {r.text}
                </p>
                <p className="mt-2 text-[11px] text-white/35">{r.why}</p>
              </article>
            ))}

            {result.mock && (
              <p className="text-center text-[11px] text-amber-200/50">
                Demo fallback — live AI was busy. Try again in a moment.
              </p>
            )}
          </>
        )}
      </div>

      <HistoryPanel tool="situationship" />
    </div>
  );
}
