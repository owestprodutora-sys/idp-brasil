import { PriorityBadge } from "@/components/admin/PriorityBadge";
import { Button } from "@/components/ui/button";
import { servicoLabel } from "@/lib/crm-config";
import { determinarProximaAcao, type ProximaAcaoUrgencia } from "@/lib/proxima-acao";
import type { Documento } from "@/types/documento";
import type { Lead } from "@/types/lead";

const URGENCIA_ORDEM: Record<ProximaAcaoUrgencia, number> = { alta: 0, media: 1, baixa: 2 };

const URGENCIA_BADGE: Record<ProximaAcaoUrgencia, { label: string; className: string }> = {
  alta: { label: "Alta", className: "bg-red-50 text-red-700 border-red-200" },
  media: { label: "Média", className: "bg-ouro-50 text-ouro-600 border-ouro-500/40" },
  baixa: { label: "Baixa", className: "bg-ink/5 text-ink/50 border-ink/10" },
};

// FASE 4B — FEATURE 014. Nenhuma regra nova: reaproveita
// determinarProximaAcao() (FASE 4A / FEATURE 011) pra decidir o que cada
// lead precisa — este componente só ordena (alta → média → baixa) e
// renderiza. Leads FINALIZADO ficam de fora (a própria função já devolve
// "Nenhuma ação necessária" pra eles).
export function FilaDeTrabalho({
  leads,
  documentosPorLead,
  onOpenLead,
}: {
  leads: Lead[];
  documentosPorLead: Map<string, Documento[]>;
  onOpenLead: (lead: Lead) => void;
}) {
  const tarefas = leads
    .filter((lead) => lead.status !== "FINALIZADO")
    .map((lead) => ({
      lead,
      acao: determinarProximaAcao(lead, documentosPorLead.get(lead.id) ?? []),
    }))
    .sort((a, b) => URGENCIA_ORDEM[a.acao.urgencia] - URGENCIA_ORDEM[b.acao.urgencia]);

  return (
    <div className="rounded-2xl border border-selo-700/10 bg-white px-5 py-5">
      <h2 className="font-display text-base font-semibold text-selo-900">Próximas tarefas</h2>

      {tarefas.length === 0 ? (
        <p className="mt-2 text-sm text-ink/50">Nenhuma tarefa pendente no momento.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {tarefas.map(({ lead, acao }) => {
            const badge = URGENCIA_BADGE[acao.urgencia];
            return (
              <li
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-selo-700/10 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-selo-900">{lead.nome}</p>
                  <p className="truncate text-xs text-ink/50">
                    {servicoLabel(lead.servico)} · {acao.titulo}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  <PriorityBadge prioridade={lead.prioridade} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenLead(lead)}
                    className="border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
                  >
                    Abrir cliente
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
