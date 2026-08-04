import { calcularResumoComissoes } from "@/lib/comissao";
import { formatCurrency } from "@/lib/financeiro";
import type { LeadFinanceiro } from "@/types/lead-financeiro";

// FASE 5A.1 — FEATURE 026. Dashboard de Comissões (Gestor). Usa só dados
// já carregados por useFinanceiro (mesmo hook de FinanceiroCards) — sem
// cálculo novo, tudo vem de lib/comissao.ts#calcularResumoComissoes.
export function ComissoesDashboard({ registros }: { registros: LeadFinanceiro[] }) {
  const resumo = calcularResumoComissoes(registros);

  const cards = [
    { label: "Comissões pendentes", value: String(resumo.quantidadePendente) },
    { label: "Em conferência", value: String(resumo.quantidadeAguardandoConferencia) },
    { label: "Pagas", value: String(resumo.quantidadePaga) },
    {
      label: "Valor pendente",
      value: formatCurrency(resumo.comissaoPendente + resumo.comissaoAguardandoConferencia),
    },
    { label: "Valor recebido", value: formatCurrency(resumo.comissaoPaga) },
    { label: "Comissão prevista", value: formatCurrency(resumo.comissaoPrevista) },
  ];

  return (
    <div className="rounded-2xl border border-selo-700/10 bg-white px-5 py-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
        Comissões
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-selo-700/10 bg-selo-50/40 px-4 py-3">
            <p className="font-display text-xl font-semibold text-selo-900">{card.value}</p>
            <p className="mt-0.5 text-xs text-ink/50">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
