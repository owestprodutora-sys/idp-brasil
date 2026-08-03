import type { Lead } from "@/types/lead";

// MVP 1.1 — "Em atendimento" agrupa tudo que já saiu de NOVO_LEAD mas não
// chegou em DOCUMENTOS_SOLICITADOS nem em FINALIZADO (esse último tem card
// próprio, quebrado por motivo_finalizacao).
const EM_ATENDIMENTO_STATUSES = [
  "PRE_ANALISE",
  "DOCUMENTACAO_COMPLETA",
  "CONSULTA_AGENDADA",
  "CONTRATO",
  "EXECUCAO",
];

export function GestorMetricsCards({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const novos = leads.filter((lead) => lead.status === "NOVO_LEAD").length;
  const emAtendimento = leads.filter((lead) =>
    EM_ATENDIMENTO_STATUSES.includes(lead.status),
  ).length;
  const aguardandoDocumento = leads.filter(
    (lead) => lead.status === "DOCUMENTOS_SOLICITADOS",
  ).length;
  const convertidos = leads.filter(
    (lead) => lead.status === "FINALIZADO" && lead.motivo_finalizacao === "CONTRATADO_CONCLUIDO",
  ).length;
  const naoElegiveis = leads.filter(
    (lead) => lead.status === "FINALIZADO" && lead.motivo_finalizacao === "NAO_ELEGIVEL",
  ).length;
  const taxaConversao = total > 0 ? `${((convertidos / total) * 100).toFixed(1)}%` : "—";

  const cards = [
    { label: "Total de leads", value: String(total) },
    { label: "Leads novos", value: String(novos) },
    { label: "Em atendimento", value: String(emAtendimento) },
    { label: "Aguardando documentos", value: String(aguardandoDocumento) },
    { label: "Convertidos", value: String(convertidos) },
    { label: "Não elegíveis", value: String(naoElegiveis) },
    { label: "Taxa de conversão", value: taxaConversao },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-selo-700/10 bg-white px-4 py-3">
          <p className="font-display text-2xl font-semibold text-selo-900">{card.value}</p>
          <p className="mt-0.5 text-xs text-ink/50">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
