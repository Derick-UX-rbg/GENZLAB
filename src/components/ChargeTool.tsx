"use client";

import { useEffect, useState } from "react";
import { Banknote } from "lucide-react";
import { track } from "@/lib/analytics";
import { saveHistoryItem } from "@/lib/history";
import type { ChargeResponse } from "@/lib/types";
import {
  CLIENT_TYPES,
  CURRENCIES,
  EXPERIENCE_LEVELS,
  SCOPES,
} from "@/tools/charge/config";
import { CopyButton } from "./CopyButton";
import { ShareButton } from "./ShareButton";
import { EmptyState, ErrorState, LoadingState } from "./States";
import { HistoryPanel } from "./HistoryPanel";

function fmt(n: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}

export function ChargeTool() {
  const [service, setService] = useState("");
  const [experience, setExperience] = useState(EXPERIENCE_LEVELS[1]);
  const [clientType, setClientType] = useState(CLIENT_TYPES[1]);
  const [projectScope, setProjectScope] = useState(SCOPES[1]);
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("NGN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ChargeResponse | null>(null);

  useEffect(() => {
    track("tool_opened", { tool: "charge" });
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, experience, clientType, projectScope, currency }),
      });
      const data = (await res.json()) as ChargeResponse;
      if (!res.ok && !data.mid) {
        setError(data.error || "Could not estimate.");
        setResult(null);
        return;
      }
      setResult(data);
      if (data.error) setError(data.error);
      track("generation_completed", { tool: "charge", mock: Boolean(data.mock) });
      saveHistoryItem({
        tool: "charge",
        title: `Charge · ${service.slice(0, 40)}`,
        preview: `${fmt(data.low, data.currency)} – ${fmt(data.high, data.currency)}`,
        payload: data,
      });
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-300/70">
          What Should I Charge?
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Stop guessing your rates
        </h1>
        <p className="mt-2 text-sm text-white/45">
          Get a realistic range, negotiation tips, and a ready message. Labeled as an estimate.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-white/50">Service</span>
          <input
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="e.g. Brand identity for a fintech, IG management, logo design…"
            className={field}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">Experience</span>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={field}
            >
              {EXPERIENCE_LEVELS.map((x) => (
                <option key={x} value={x} className="bg-[#111]">
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">Client type</span>
            <select
              value={clientType}
              onChange={(e) => setClientType(e.target.value)}
              className={field}
            >
              {CLIENT_TYPES.map((x) => (
                <option key={x} value={x} className="bg-[#111]">
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">Project scope</span>
            <select
              value={projectScope}
              onChange={(e) => setProjectScope(e.target.value)}
              className={field}
            >
              {SCOPES.map((x) => (
                <option key={x} value={x} className="bg-[#111]">
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-white/50">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as typeof currency)}
              className={field}
            >
              {CURRENCIES.map((x) => (
                <option key={x} value={x} className="bg-[#111]">
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          disabled={loading || !service.trim()}
          onClick={generate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Banknote size={16} />
          {loading ? "Estimating…" : "Get pricing estimate"}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading && <LoadingState label="Checking market sense for your scope…" />}
        {error && <ErrorState message={error} />}
        {!loading && !result && !error && (
          <EmptyState
            title="No estimate yet"
            body="Describe what you’re selling and who you’re selling to."
          />
        )}
        {result && result.mid > 0 && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/70">
                Estimate range
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {fmt(result.low, result.currency)}{" "}
                <span className="text-white/30">–</span>{" "}
                {fmt(result.high, result.currency)}
              </p>
              <p className="mt-1 text-sm text-emerald-100/80">
                Sweet spot: <strong>{fmt(result.mid, result.currency)}</strong>
              </p>
              <p className="mt-3 text-[11px] text-white/35">{result.disclaimer}</p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                Pricing factors
              </h3>
              <ul className="mt-3 space-y-2">
                {result.factors.map((f) => (
                  <li key={f} className="text-sm leading-relaxed text-white/70">
                    · {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                Negotiation strategy
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{result.negotiation}</p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                  Ready message
                </h3>
                <div className="flex gap-1.5">
                  <CopyButton text={result.readyMessage} tool="charge" />
                  <ShareButton
                    title="My rate estimate"
                    text={result.readyMessage}
                    tool="charge"
                    preferWhatsApp
                  />
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                {result.readyMessage}
              </p>
            </div>

            {result.mock && (
              <p className="text-center text-[11px] text-amber-200/50">
                Demo fallback — live AI was busy. Try again in a moment.
              </p>
            )}
          </div>
        )}
      </div>

      <HistoryPanel tool="charge" />
    </div>
  );
}
