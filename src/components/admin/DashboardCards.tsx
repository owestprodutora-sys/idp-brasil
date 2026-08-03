import { cn } from "@/lib/utils";
import { CLOSED_STATUSES, isSemContatoRecente } from "@/lib/crm-config";
import type { Lead } from "@/types/lead";

export function DashboardCards({ leads }: { leads: Lead[] }) {
  const novosLeads = leads.filter((lead) => lead.status === "novo").length;
  const emAnalise = leads.filter((lead) => lead.status === "em_analise").length;
  const aguardandoDocumentos = leads.filter(
    (lead) => lead.status === "aguardando_documento",
  ).length;
  const concluidos = leads.filter((lead) =>
    CLOSED_STATUSES.includes(lead.status as (typeof CLOSED_STATUSES)[number]),
  ).length;
  const semContatoRecente = leads.filter((lead) =>
    isSemContatoRecente(lead.status, lead.ultimo_contato),
  ).length;

  const cards = [
    { label: "Novos leads", value: novosLeads },
    { label: "Em análise", value: emAnalise },
    { label: "Aguardando documentos", value: aguardandoDocumentos },
    { label: "Concluídos", value: concluidos },
    { label: "Sem contato recente", value: semContatoRecente, alert: semContatoRecente > 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "rounded-xl border bg-white px-4 py-3",
            card.alert ? "border-ouro-500/40 bg-ouro-50" : "border-selo-700/10",
          )}
        >
          <p
            className={cn(
              "font-display text-2xl font-semibold",
              card.alert ? "text-ouro-600" : "text-selo-900",
            )}
          >
            {card.value}
          </p>
          <p className="mt-0.5 text-xs text-ink/50">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
