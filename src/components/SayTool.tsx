"use client";

import { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { saveHistoryItem } from "@/lib/history";
import type { SayReply, SayResponse, Vibe } from "@/lib/types";
import { VIBES } from "@/tools/say/config";
import { CopyButton } from "./CopyButton";
import { ShareButton } from "./ShareButton";
import { EmptyState, ErrorState, LoadingState } from "./States";
import { HistoryPanel } from "./HistoryPanel";

export function SayTool() {
  const [message, setMessage] = useState("");
  const [vibe, setVibe] = useState<Vibe>("Flirty");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replies, setReplies] = useState<SayReply[]>([]);
  const [mock, setMock] = useState(false);

  useEffect(() => {
    track("tool_opened", { tool: "say" });
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/say", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, vibe }),
      });
      const data = (await res.json()) as SayResponse;
      if (!res.ok && !data.replies?.length) {
        setError(data.error || "Could not generate replies.");
        setReplies([]);
        return;
      }
      setReplies(data.replies || []);
      setMock(Boolean(data.mock));
      if (data.error) setError(data.error);
      track("generation_completed", { tool: "say", mock: Boolean(data.mock) });
      if (data.replies?.length) {
        saveHistoryItem({
          tool: "say",
          title: `${vibe} reply`,
          preview: data.replies[0].text,
          payload: { message, vibe, replies: data.replies },
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
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-fuchsia-300/70">
          What Do I Say?
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Reply like yourself — but better
        </h1>
        <p className="mt-2 text-sm text-white/45">
          Paste their message, pick a vibe, get 3 natural Nigerian Gen-Z options.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-white/50">Their message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Paste the WhatsApp / IG / DM text here…"
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-fuchsia-500/40 focus:ring-2 focus:ring-fuchsia-500/20"
          />
        </label>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-white/50">Vibe</span>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVibe(v)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  vibe === v
                    ? "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={loading || message.trim().length < 2}
          onClick={generate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Wand2 size={16} />
          {loading ? "Cooking replies…" : "Generate 3 replies"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading && <LoadingState label="Writing replies that don’t sound like ChatGPT…" />}
        {error && <ErrorState message={error} />}
        {!loading && !error && replies.length === 0 && (
          <EmptyState
            title="No replies yet"
            body="Drop a message and pick a vibe. We’ll give you three sendable options."
          />
        )}
        {replies.map((r, idx) => (
          <article
            key={`${r.label}-${idx}`}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/12"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-fuchsia-200">
                Option {idx + 1} · {r.label}
              </span>
              <div className="flex gap-1.5">
                <CopyButton text={r.text} tool="say" />
                <ShareButton title="GENZLAB reply" text={r.text} tool="say" />
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">{r.text}</p>
            <p className="mt-2 text-[11px] text-white/35">{r.why}</p>
          </article>
        ))}
        {mock && replies.length > 0 && (
          <p className="text-center text-[11px] text-amber-200/50">
            Demo mode sample — connect GEMINI_API_KEY for live AI.
          </p>
        )}
      </div>

      <HistoryPanel tool="say" />
    </div>
  );
}
