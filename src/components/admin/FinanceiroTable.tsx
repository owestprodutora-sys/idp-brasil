import { resolveStatusComissao } from "@/lib/comissao";
import { formatCurrency, resolveStatusFinanceiro, statusFinanceiroOrdem } from "@/lib/financeiro";
import { formatDate } from "@/lib/format";
import { servicoLabel } from "@/lib/crm-config";
import type { LeadFinanceiro } from "@/types/lead-financeiro";
import type { Lead } from "@/types/lead";

interface FinanceiroTableProps {
  leads: Lead[];
  registros: LeadFinanceiro[];
  onOpenLead: (lead: Lead) => void;
}

// FEATURE 021 — Lista Financeira. Só mostra leads que já têm registro
// financeiro (lead sem contrato financeiro ainda não aparece aqui — ver
// LeadFinanceiroPanel dentro do LeadDetailModal pra criar o registro).
// Ordenação: pendentes → parciais → recebidos → cancelados.
export function FinanceiroTable({ leads, registros, onOpenLead }: FinanceiroTableProps) {
  const leadsPorId = new Map(leads.map((lead) => [lead.id, lead]));

  const linhas = registros
    .map((registro) => ({ registro, lead: leadsPorId.get(registro.lead_id) }))
    .filter((linha): linha is { registro: LeadFinanceiro; lead: Lead } => Boolean(linha.lead))
    .sort(
      (a, b) =>
        statusFinanceiroOrdem(a.registro.status_financeiro) -
        statusFinanceiroOrdem(b.registro.status_financeiro),
    );

  if (linhas.length === 0) {
    return <p className="text-sm text-ink/60">Nenhum registro financeiro ainda.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-selo-700/10 bg-white">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-selo-700/10 text-xs uppercase tracking-wide text-ink/45">
            <th className="px-5 py-3 font-medium">Cliente</th>
            <th className="px-5 py-3 font-medium">Serviço</th>
            <th className="px-5 py-3 font-medium">Honorários</th>
            <th className="px-5 py-3 font-medium">Comissão IDP</th>
            <th className="px-5 py-3 font-medium">Especialista</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Status Comissão</th>
            <th className="px-5 py-3 font-medium">Recebimento</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-selo-700/10">
          {linhas.map(({ registro, lead }) => {
            const statusOption = resolveStatusFinanceiro(registro.status_financeiro);
            const statusComissaoOption = resolveStatusComissao(registro.status_comissao);
            return (
              <tr
                key={registro.id}
                onClick={() => onOpenLead(lead)}
                className="cursor-pointer hover:bg-selo-50/60"
              >
                <td className="px-5 py-4 font-medium text-selo-900">{lead.nome}</td>
                <td className="px-5 py-4 text-ink/70">{servicoLabel(lead.servico)}</td>
                <td className="px-5 py-4 text-ink/70">
                  {formatCurrency(registro.valor_honorarios)}
                </td>
                <td className="px-5 py-4 text-ink/70">
                  {formatCurrency(registro.valor_comissao_idp)}
                </td>
                <td className="px-5 py-4 text-ink/70">
                  {formatCurrency(registro.valor_especialista)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusOption.badgeClass}`}
                  >
                    {statusOption.emoji} {statusOption.label}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusComissaoOption.badgeClass}`}
                  >
                    {statusComissaoOption.emoji} {statusComissaoOption.label}
                  </span>
                </td>
                <td className="px-5 py-4 text-ink/70">
                  {registro.data_recebimento
                    ? formatDate(registro.data_recebimento)
                    : registro.data_prevista_pagamento
                      ? `Previsto: ${formatDate(registro.data_prevista_pagamento)}`
                      : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
