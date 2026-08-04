import { formatDateTime } from "@/lib/format";
import type { TimelineItem } from "@/lib/lead-timeline";

// FASE 4A — FEATURE 010. Responsabilidade exclusiva: renderização. Toda
// regra (unir fontes, ordenar) já vem pronta em `items`, montada por
// src/lib/lead-timeline.ts.
export function LeadTimeline({
  items,
  isLoading,
}: {
  items: TimelineItem[];
  isLoading: boolean;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">Timeline</h3>

      {isLoading ? (
        <p className="text-sm text-ink/45">Carregando timeline...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-ink/45">Nenhum evento registrado ainda.</p>
      ) : (
        <ul className="space-y-3 border-l border-selo-700/10 pl-4">
          {items.map((item) => (
            <li key={item.id} className="relative text-sm">
              <span
                aria-hidden="true"
                className="absolute -left-[22px] flex h-5 w-5 items-center justify-center rounded-full bg-paper text-xs"
              >
                {item.icone}
              </span>
              <p className="font-medium text-selo-900">{item.titulo}</p>
              {item.descricao && <p className="mt-0.5 text-ink/60">{item.descricao}</p>}
              <p className="mt-0.5 text-xs text-ink/45">
                {formatDateTime(item.data)}
                {item.usuarioNome ? ` · ${item.usuarioNome}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
