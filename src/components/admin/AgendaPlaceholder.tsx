import { CalendarDays } from "lucide-react";

// FASE 4B — FEATURE 017. Apenas estrutura visual, reservando espaço pra
// evolução futura — sem integração com Google Calendar, sem tabela nova,
// conforme o spec pede explicitamente.
export function AgendaPlaceholder() {
  return (
    <div className="rounded-2xl border border-dashed border-selo-700/20 bg-white px-5 py-5">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-ink/40" />
        <h2 className="font-display text-base font-semibold text-selo-900">Agenda</h2>
        <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-medium text-ink/45">
          Em breve
        </span>
      </div>
      <p className="mt-1 text-xs text-ink/50">Nenhuma integração configurada.</p>
    </div>
  );
}
