import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export function LoadingState({ label = "Thinking…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-6 py-14 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-fuchsia-400" />
      <p className="text-sm text-white/60">{label}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
      <Inbox className="h-6 w-6 text-white/25" />
      <p className="text-sm font-medium text-white/70">{title}</p>
      <p className="max-w-sm text-xs leading-relaxed text-white/40">{body}</p>
    </div>
  );
}
