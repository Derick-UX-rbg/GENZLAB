"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { track } from "@/lib/analytics";

export function CopyButton({
  text,
  tool,
  label = "Copy",
}: {
  text: string;
  tool: string;
  label?: string;
}) {
  const [done, setDone] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      track("result_copied", { tool });
      setTimeout(() => setDone(false), 1600);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      {done ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
      {done ? "Copied" : label}
    </button>
  );
}
