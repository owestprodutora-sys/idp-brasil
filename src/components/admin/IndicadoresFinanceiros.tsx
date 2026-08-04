import { calcularResumoFinanceiro, formatCurrency } from "@/lib/financeiro";
import type { LeadFinanceiro } from "@/types/lead-financeiro";

// FEATURE 020 — Indicadores Financeiros. Tudo calculado a partir da tabela
// financeira (lib/financeiro.ts#calcularResumoFinanceiro), nunca em tela.
export function IndicadoresFinanceiros({ registros }: { registros: LeadFinanceiro[] }) {
  const resumo = calcularResumoFinanceiro(registros);

  const indicadores = [
    { label: "Ticket médio", value: formatCurrency(resumo.ticketMedio) },
    { label: "Valor médio de honorários", value: formatCurrency(resumo.honorariosMedio) },
    { label: "Comissão média", value: formatCurrency(resumo.comissaoMedia) },
    { label: "Receita prevista", value: formatCurrency(resumo.receitaPrevista) },
    { label: "Receita recebida", value: formatCurrency(resumo.receitaRecebida) },
  ];

  return (
    <div className="rounded-2xl border border-selo-700/10 bg-white px-5 py-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
        Indicadores financeiros
      </h3>
      <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {indicadores.map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-ink/45">{item.label}</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold text-selo-900">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
