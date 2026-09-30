"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { TOOLS } from "@/lib/tools";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-amber-400 text-sm font-bold text-black shadow-lg shadow-fuchsia-500/20 transition group-hover:scale-105">
            G
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            GENZLAB <span className="text-white/40">🇳🇬</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {TOOLS.map((t) => {
            const active = pathname?.startsWith(t.href);
            return (
              <Link
                key={t.id}
                href={t.href}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {t.shortName || t.name}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-white/70 hover:bg-white/5 md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-[#0a0a0c] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5"
            >
              <Sparkles size={16} /> Home
            </Link>
            {TOOLS.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm ${
                  pathname?.startsWith(t.href)
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                {t.shortName || t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
