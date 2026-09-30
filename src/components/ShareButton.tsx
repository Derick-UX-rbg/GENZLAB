"use client";

import { Share2 } from "lucide-react";
import { track } from "@/lib/analytics";

export function ShareButton({
  title,
  text,
  tool,
}: {
  title: string;
  text: string;
  tool: string;
}) {
  async function onShare() {
    track("result_shared", { tool });
    try {
      if (navigator.share) {
        await navigator.share({ title, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      alert("Share text copied — paste anywhere.");
    } catch {
      // user cancelled or unsupported
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      <Share2 size={13} />
      Share
    </button>
  );
}
