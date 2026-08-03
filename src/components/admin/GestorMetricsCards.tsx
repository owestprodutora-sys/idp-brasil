import type { Lead } from "@/types/lead";

// TASK-007B — "Em atendimento" agrupa os status intermediários (primeiro
// contato pendente + em análise). "Aguardando documento" tem card próprio
// porque é um gargalo específico que o gestor precisa enxergar separado.
const EM_ATENDIMENTO_STATUSES = ["primeiro_contato_pendente", "em_analise"];

export function GestorMetricsCards({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const novos = leads.filter((lead) => lead.status === "novo").length;
  const emAtendimento = leads.filter((lead) =>
    EM_ATENDIMENTO_STATUSES.includes(lead.status),
  ).length;
  const aguardandoDocumento = leads.filter(
    (lead) => lead.status === "aguardando_documento",
  ).length;
  const convertidos = leads.filter((lead) => lead.status === "elegivel").length;
  const naoElegiveis = leads.filter((lead) => lead.status === "nao_elegivel").length;
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
