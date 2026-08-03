import { cn } from "@/lib/utils";
import { CLOSED_STATUSES, isSemContatoRecente, type LeadStatus } from "@/lib/crm-config";
import type { Lead } from "@/types/lead";

// Card de status ou card especial ("sem contato recente"). Clicar aplica
// o mesmo filtro que já existia no menu de seleção — clicar de novo no
// card ativo remove o filtro. Objetivo: evitar ter que abrir o menu pra
// cada troca de visão (pedido do usuário).
type CardFilter = { kind: "status"; status: LeadStatus } | { kind: "sem_contato_recente" };

export function DashboardCards({
  leads,
  activeStatus,
  semContatoRecenteAtivo,
  onSelectStatus,
  onToggleSemContatoRecente,
}: {
  leads: Lead[];
  activeStatus: string;
  semContatoRecenteAtivo: boolean;
  onSelectStatus: (status: LeadStatus) => void;
  onToggleSemContatoRecente: () => void;
}) {
  const novosLeads = leads.filter((lead) => lead.status === "NOVO_LEAD").length;
  const emAnalise = leads.filter((lead) => lead.status === "PRE_ANALISE").length;
  const aguardandoDocumentos = leads.filter(
    (lead) => lead.status === "DOCUMENTOS_SOLICITADOS",
  ).length;
  const concluidos = leads.filter((lead) =>
    CLOSED_STATUSES.includes(lead.status as (typeof CLOSED_STATUSES)[number]),
  ).length;
  const semContatoRecente = leads.filter((lead) =>
    isSemContatoRecente(lead.status, lead.ultimo_contato),
  ).length;

  const cards: {
    label: string;
    value: number;
    alert?: boolean;
    filter: CardFilter;
    isActive: boolean;
  }[] = [
    {
      label: "Novos leads",
      value: novosLeads,
      filter: { kind: "status", status: "NOVO_LEAD" },
      isActive: activeStatus === "NOVO_LEAD",
    },
    {
      label: "Em análise",
      value: emAnalise,
      filter: { kind: "status", status: "PRE_ANALISE" },
      isActive: activeStatus === "PRE_ANALISE",
    },
    {
      label: "Aguardando documentos",
      value: aguardandoDocumentos,
      filter: { kind: "status", status: "DOCUMENTOS_SOLICITADOS" },
      isActive: activeStatus === "DOCUMENTOS_SOLICITADOS",
    },
    {
      label: "Concluídos",
      value: concluidos,
      filter: { kind: "status", status: "FINALIZADO" },
      isActive: activeStatus === "FINALIZADO",
    },
    {
      label: "Sem contato recente",
      value: semContatoRecente,
      alert: semContatoRecente > 0,
      filter: { kind: "sem_contato_recente" },
      isActive: semContatoRecenteAtivo,
    },
  ];

  function handleClick(card: (typeof cards)[number]) {
    if (card.filter.kind === "status") {
      onSelectStatus(card.filter.status);
    } else {
      onToggleSemContatoRecente();
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <button
          key={card.label}
          type="button"
          onClick={() => handleClick(card)}
          aria-pressed={card.isActive}
          className={cn(
            "rounded-xl border bg-white px-4 py-3 text-left transition-colors hover:border-selo-700/30",
            card.alert ? "border-ouro-500/40 bg-ouro-50" : "border-selo-700/10",
            card.isActive && "border-selo-700 ring-1 ring-selo-700",
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
        </button>
      ))}
    </div>
  );
}
