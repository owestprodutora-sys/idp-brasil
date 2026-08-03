import { PriorityBadge } from "@/components/admin/PriorityBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { isProximaAcaoVencida, responsavelLabel } from "@/lib/crm-config";
import { formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types/lead";

// TASK-007B (item 2) — Visão de acompanhamento do gestor. Somente leitura
// de propósito: sem coluna de ações, sem modal de edição. O CRM continua
// sendo responsabilidade da especialista (Painel Adrieli).
export function GestorLeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-selo-700/10 bg-white">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead>
          <tr className="border-b border-selo-700/10 text-xs uppercase tracking-wide text-ink/45">
            <th className="px-5 py-3 font-medium">Nome</th>
            <th className="px-5 py-3 font-medium">Cidade</th>
            <th className="px-5 py-3 font-medium">Especialista</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Prioridade</th>
            <th className="px-5 py-3 font-medium">Entrada</th>
            <th className="px-5 py-3 font-medium">Último contato</th>
            <th className="px-5 py-3 font-medium">Próxima ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-selo-700/10">
          {leads.map((lead) => {
            const vencida = isProximaAcaoVencida(lead.data_proximo_contato);
            return (
              <tr key={lead.id}>
                <td className="px-5 py-4 font-medium text-selo-900">{lead.nome}</td>
                <td className="px-5 py-4 text-ink/70">
                  {lead.cidade} / {lead.estado}
                </td>
                <td className="px-5 py-4 text-ink/70">{responsavelLabel()}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-5 py-4">
                  <PriorityBadge prioridade={lead.prioridade} />
                </td>
                <td className="px-5 py-4 text-ink/70">{formatDateTime(lead.created_at)}</td>
                <td className="px-5 py-4 text-ink/70">{formatDate(lead.ultimo_contato)}</td>
                <td className="px-5 py-4 text-ink/70">
                  {lead.proxima_acao ? (
                    <div>
                      <p>{lead.proxima_acao}</p>
                      {lead.data_proximo_contato && (
                        <p
                          className={cn(
                            "text-xs",
                            vencida ? "font-medium text-red-600" : "text-ink/40",
                          )}
                        >
                          {vencida ? "Venceu em " : "Até "}
                          {formatDate(lead.data_proximo_contato)}
                        </p>
                      )}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
