import { cn } from "@/lib/utils";
import { resolveStatus } from "@/lib/crm-config";

export function StatusBadge({ status }: { status: string }) {
  const option = resolveStatus(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium",
        option.badgeClass,
      )}
    >
      <span aria-hidden="true">{option.emoji}</span>
      {option.label}
    </span>
  );
}
