import { calcularResumoComissoes } from "@/lib/comissao";
import { calcularResumoFinanceiro, formatCurrency } from "@/lib/financeiro";
import { formatDate } from "@/lib/format";
import type { LeadFinanceiro } from "@/types/lead-financeiro";

// FASE 5A.1 — FEATURE 028. Indicadores Financeiros da Especialista. Mesmo
// padrão visual de IndicadoresFinanceiros.tsx (Dashboard do Gestor).
export function SpecialistIndicadoresComissao({ registros }: { registros: LeadFinanceiro[] }) {
  const resumoFinanceiro = calcularResumoFinanceiro(registros);
  const resumoComissoes = calcularResumoComissoes(registros);

  const indicadores = [
    { label: "Total previsto", value: formatCurrency(resumoFinanceiro.honorariosPrevistos) },
    { label: "Recebido", value: formatCurrency(resumoFinanceiro.honorariosRecebidos) },
    {
      label: "Comissões pendentes",
      value: String(resumoComissoes.quantidadePendente),
    },
    {
      label: "Comissões em conferência",
      value: String(resumoComissoes.quantidadeAguardandoConferencia),
    },
    {
      label: "Último pagamento",
      value: resumoComissoes.ultimoPagamento ? formatDate(resumoComissoes.ultimoPagamento) : "—",
    },
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
