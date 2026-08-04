import { isProximaAcaoVencida, isSemContatoRecente } from "@/lib/crm-config";
import type { Documento } from "@/types/documento";
import type { Lead } from "@/types/lead";

// FASE 4A — FEATURE 012. Alertas no nível de UM lead (dentro do modal de
// detalhes) — não é o mesmo componente de AlertasOperacionais.tsx, que
// resume a operação inteira no dashboard do gestor. Aqui reaproveitamos os
// mesmos helpers de crm-config.ts, só aplicados a um lead só.
export function LeadAlertas({ lead, documentos }: { lead: Lead; documentos: Documento[] }) {
  const alertas: { icone: string; texto: string }[] = [];

  const documentoInvalido = documentos.find(
    (d) => d.status === "INVALIDO" || d.status === "SOLICITAR_NOVO",
  );
  if (documentoInvalido) {
    alertas.push({ icone: "🔴", texto: `Documento inválido: ${documentoInvalido.nome}` });
  }

  const documentoPendente = documentos.find((d) => d.status === "PENDENTE");
  if (documentoPendente) {
    alertas.push({ icone: "⚪", texto: "Há documento pendente de envio no checklist." });
  }

  if (isProximaAcaoVencida(lead.data_proximo_contato)) {
    alertas.push({ icone: "🟡", texto: "Follow-up vencido." });
  }

  if (isSemContatoRecente(lead.status, lead.ultimo_contato)) {
    alertas.push({ icone: "🟠", texto: "Caso sem atualização recente." });
  }

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
