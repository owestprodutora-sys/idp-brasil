import { cn } from "@/lib/utils";
import { STATUS_OPTIONS, type LeadStatus } from "@/lib/crm-config";
import type { Lead } from "@/types/lead";

// Navegação por abas de status — pensada pra escalar quando houver
// centenas/milhares de leads (um card de resumo não dá conta de navegar,
// só de destacar números). Uma aba por status do pipeline + "Todos".
// No desktop as pílulas quebram em 2 linhas e cabem na tela, sem barra de
// rolagem; no mobile (espaço mais apertado) mantém rolagem horizontal.
export function StatusTabs({
  leads,
  value,
  onChange,
}: {
  leads: Lead[];
  value: string;
  onChange: (status: string) => void;
}) {
  const total = leads.length;
  const counts = new Map<LeadStatus, number>();
  for (const lead of leads) {
    const status = lead.status as LeadStatus;
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }

  const tabs: { key: string; label: string; emoji?: string; count: number }[] = [
    { key: "todos", label: "Todos", count: total },
    ...STATUS_OPTIONS.map((option) => ({
      key: option.value,
      label: option.label,
      emoji: option.emoji,
      count: counts.get(option.value) ?? 0,
    })),
  ];

  return (
    <div
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
      role="tablist"
      aria-label="Filtrar por status"
    >
      {tabs.map((tab) => {
        const isActive = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-selo-700 bg-selo-700 text-paper"
                : "border-selo-700/15 bg-white text-selo-900/70 hover:border-selo-700/40 hover:text-selo-900",
            )}
          >
            {tab.emoji && <span aria-hidden="true">{tab.emoji}</span>}
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                isActive ? "bg-white/20 text-paper" : "bg-selo-700/8 text-selo-900/60",
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
