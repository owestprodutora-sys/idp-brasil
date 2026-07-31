import { cn } from "@/lib/utils";

export function LegalBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-selo-700/20 bg-selo-50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-selo-700",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-ouro-500" />
      Lei nº 7.713/88 · Art. 6º, XIV
    </span>
  );
}
