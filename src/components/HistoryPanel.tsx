"use client";

import { useEffect, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { clearHistory, loadHistory } from "@/lib/history";
import type { HistoryItem } from "@/lib/types";

export function HistoryPanel({ tool }: { tool?: HistoryItem["tool"] }) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const all = loadHistory();
    setItems(tool ? all.filter((i) => i.tool === tool) : all);
  }, [tool]);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
          <Clock size={12} /> Recent
        </h3>
        <button
          type="button"
          onClick={() => {
            clearHistory();
            setItems([]);
          }}
          className="inline-flex items-center gap-1 text-[11px] text-white/35 hover:text-white/60"
        >
          <Trash2 size={11} /> Clear
        </button>
      </div>
      <ul className="space-y-2">
        {items.slice(0, 6).map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2.5"
          >
            <p className="text-xs font-medium text-white/70">{item.title}</p>
            <p className="mt-0.5 line-clamp-2 text-[11px] text-white/35">{item.preview}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
