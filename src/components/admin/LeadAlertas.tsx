import { listarAlertasDoLead } from "@/lib/lead-alertas";
import type { Documento } from "@/types/documento";
import type { Lead } from "@/types/lead";

// FASE 4A — FEATURE 012. Alertas no nível de UM lead (dentro do modal de
// detalhes) — não é o mesmo componente de AlertasOperacionais.tsx, que
// resume a operação inteira no dashboard do gestor. A regra em si mora em
// lib/lead-alertas.ts (extraída na FASE 4B pra ser reutilizada também pelo
// Dashboard Operacional) — este componente só renderiza.
export function LeadAlertas({ lead, documentos }: { lead: Lead; documentos: Documento[] }) {
  const alertas = listarAlertasDoLead(lead, documentos);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">Alertas</h3>

      {alertas.length === 0 ? (
        <p className="text-sm text-ink/45">Nenhum alerta operacional.</p>
      ) : (
        <ul className="space-y-1.5">
          {alertas.map((alerta) => (
            <li
              key={alerta.texto}
              className="flex items-center gap-2 rounded-lg border border-ouro-500/30 bg-ouro-50 px-3 py-1.5 text-sm text-selo-900"
            >
              <span aria-hidden="true">{alerta.icone}</span>
              <span>{alerta.texto}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
