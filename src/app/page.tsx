import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:pt-16">
      <section className="animate-fade-up text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/55">
          <Zap size={12} className="text-amber-300" />
          Lightweight AI utilities · MVP
        </div>
        <h1 className="mx-auto max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.08]">
          Tiny AI tools for real-life Nigerian problems.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-white/50 sm:text-lg">
          Money. Hustle. Dating. Content. Life. One problem at a time.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={TOOLS[0].href}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Try What Do I Say? <ArrowRight size={16} />
          </Link>
          <Link
            href={TOOLS[2].href}
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
          >
            Find a hustle
          </Link>
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool, i) => (
          <div key={tool.id} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <ToolCard tool={tool} />
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-center sm:p-8">
        <p className="text-sm text-white/45">
          Built for Nigerian Gen Z who need answers now — not another 40-feature app.
          More tiny tools coming. Keep it useful.
        </p>
      </section>
    </div>
  );
}
