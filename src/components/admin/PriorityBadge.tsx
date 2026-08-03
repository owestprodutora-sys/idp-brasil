import { cn } from "@/lib/utils";
import { resolvePriority } from "@/lib/crm-config";

export function PriorityBadge({ prioridade }: { prioridade: string | null }) {
  const option = resolvePriority(prioridade);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium",
        option.badgeClass,
      )}
    >
      {option.emoji && <span aria-hidden="true">{option.emoji}</span>}
      {option.label}
    </span>
  );
}
