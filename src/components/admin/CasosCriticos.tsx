import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { listarAlertasDoLead } from "@/lib/lead-alertas";
import type { Documento } from "@/types/documento";
import type { Lead } from "@/types/lead";

// FASE 4B — FEATURE 015. Reaproveita listarAlertasDoLead() (extraída de
// LeadAlertas.tsx — FASE 4A / FEATURE 012) — mesma regra de alerta usada
// dentro do modal do lead; aqui só filtramos quem tem pelo menos um
// alerta operacional. Nenhuma regra nova.
export function CasosCriticos({
  leads,
  documentosPorLead,
  onOpenLead,
}: {
  leads: Lead[];
  documentosPorLead: Map<string, Documento[]>;
  onOpenLead: (lead: Lead) => void;
}) {
  const casos = leads
    .map((lead) => ({
      lead,
      alertas: listarAlertasDoLead(lead, documentosPorLead.get(lead.id) ?? []),
    }))
    .filter((item) => item.alertas.length > 0);

  return (
    <div className="rounded-2xl border border-selo-700/10 bg-white px-5 py-5">
      <h2 className="font-display text-base font-semibold text-selo-900">Necessitam Atenção</h2>

      {casos.length === 0 ? (
        <p className="mt-2 text-sm text-ink/50">Nenhum caso com alerta no momento.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {casos.map(({ lead, alertas }) => (
            <li
              key={lead.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ouro-500/30 bg-ouro-50 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-selo-900">{lead.nome}</p>
                <p className="truncate text-xs text-selo-900/70">
                  {alertas.map((alerta) => `${alerta.icone} ${alerta.texto}`).join(" · ")}
                </p>
                {lead.ultimo_contato && (
                  <p className="text-xs text-ink/45">
                    Último contato: {formatDate(lead.ultimo_contato)}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenLead(lead)}
                className="shrink-0 border-selo-700/30 text-selo-700 hover:bg-selo-700/5"
              >
                Abrir cliente
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
