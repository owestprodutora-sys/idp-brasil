import { calcularResumoComissoes } from "@/lib/comissao";
import { calcularResumoFinanceiro, formatCurrency } from "@/lib/financeiro";
import type { LeadFinanceiro } from "@/types/lead-financeiro";

// FASE 5A.1 — FEATURE 022. Painel Financeiro da Especialista. Mesmo padrão
// visual de FinanceiroCards.tsx (Dashboard do Gestor); os valores vêm de
// lib/financeiro.ts#calcularResumoFinanceiro (honorários, já existente
// desde a FASE 5A) e de lib/comissao.ts#calcularResumoComissoes (comissão
// e saldo líquido) — nenhum cálculo novo neste componente.
export function SpecialistFinanceiroCards({ registros }: { registros: LeadFinanceiro[] }) {
  const resumoFinanceiro = calcularResumoFinanceiro(registros);
  const resumoComissoes = calcularResumoComissoes(registros);

  const cards = [
    { label: "Honorários previstos", value: formatCurrency(resumoFinanceiro.honorariosPrevistos) },
    { label: "Honorários recebidos", value: formatCurrency(resumoFinanceiro.honorariosRecebidos) },
    { label: "Comissão IDP pendente", value: formatCurrency(resumoComissoes.comissaoPendente) },
    { label: "Comissão IDP paga", value: formatCurrency(resumoComissoes.comissaoPaga) },
    { label: "Saldo líquido previsto", value: formatCurrency(resumoComissoes.saldoLiquidoPrevisto) },
    { label: "Saldo líquido recebido", value: formatCurrency(resumoComissoes.saldoLiquidoRecebido) },
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
