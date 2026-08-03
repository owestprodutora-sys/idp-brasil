import type { Lead } from "@/types/lead";

const EM_ATENDIMENTO_STATUSES = [
  "primeiro_contato_pendente",
  "em_analise",
  "aguardando_documento",
];

export function GestorMetricsCards({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const novos = leads.filter((lead) => lead.status === "novo").length;
  const emAtendimento = leads.filter((lead) =>
    EM_ATENDIMENTO_STATUSES.includes(lead.status),
  ).length;
  const convertidos = leads.filter((lead) => lead.status === "elegivel").length;
  const taxaConversao = total > 0 ? `${((convertidos / total) * 100).toFixed(1)}%` : "—";

  const cards = [
    { label: "Total de leads", value: String(total) },
    { label: "Leads novos", value: String(novos) },
    { label: "Em atendimento", value: String(emAtendimento) },
    { label: "Convertidos", value: String(convertidos) },
    { label: "Taxa de conversão", value: taxaConversao },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-selo-700/10 bg-white px-4 py-3">
          <p className="font-display text-2xl font-semibold text-selo-900">{card.value}</p>
          <p className="mt-0.5 text-xs text-ink/50">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
