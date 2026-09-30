import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ToolMeta } from "@/lib/types";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={tool.href}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-white/15 hover:bg-white/[0.05]"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-60 transition group-hover:opacity-90`}
      />
      <div className="relative">
        <div className="mb-8 flex items-start justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            Utility
          </p>
          <ArrowUpRight
            size={18}
            className="text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70"
          />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-white">{tool.name}</h3>
        <p className="mt-1 text-sm text-white/50">{tool.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/40">{tool.description}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-white/80 transition group-hover:text-white">
          Open tool
          <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}
