import { calcularResumoFinanceiro, formatCurrency } from "@/lib/financeiro";
import type { LeadFinanceiro } from "@/types/lead-financeiro";

// FEATURE 019 — Dashboard Financeiro. Apenas cards nesta fase (sem gráficos,
// por decisão explícita do spec).
export function FinanceiroCards({ registros }: { registros: LeadFinanceiro[] }) {
  const resumo = calcularResumoFinanceiro(registros);

  const cards = [
    { label: "Honorários previstos", value: formatCurrency(resumo.honorariosPrevistos) },
    { label: "Honorários recebidos", value: formatCurrency(resumo.honorariosRecebidos) },
    { label: "Comissão IDP prevista", value: formatCurrency(resumo.comissaoIdpPrevista) },
    { label: "Comissão IDP recebida", value: formatCurrency(resumo.comissaoIdpRecebida) },
    { label: "Valores pendentes", value: formatCurrency(resumo.valoresPendentes) },
    { label: "Quantidade de contratos", value: String(resumo.quantidadeContratos) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-selo-700/10 bg-white px-4 py-3">
          <p className="font-display text-xl font-semibold text-selo-900">{card.value}</p>
          <p className="mt-0.5 text-xs text-ink/50">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
