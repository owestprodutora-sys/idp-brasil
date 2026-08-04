import { CLOSED_STATUSES } from "@/lib/crm-config";
import type { Documento } from "@/types/documento";
import type { Lead } from "@/types/lead";

// FASE 4B — FEATURE 016. Só contagens sobre dados já carregados
// (leads + documentos) e sobre o mesmo número de follow-ups vencidos
// calculado em lib/meu-dia.ts — nenhum cálculo novo de regra de negócio.
// "Tempo médio de atendimento" fica como placeholder, conforme o spec.
export function IndicadoresOperacionais({
  leads,
  documentos,
  followUpsVencidos,
}: {
  leads: Lead[];
  documentos: Documento[];
  followUpsVencidos: number;
}) {
  const finalizados = leads.filter((lead) =>
    CLOSED_STATUSES.includes(lead.status as (typeof CLOSED_STATUSES)[number]),
  ).length;
  const ativos = leads.length - finalizados;
  const novos = leads.filter((lead) => lead.status === "NOVO_LEAD").length;
  const emAtendimento = ativos - novos;
  const aguardandoDocumentos = leads.filter(
    (lead) => lead.status === "DOCUMENTOS_SOLICITADOS",
  ).length;
  const documentosPendentes = documentos.filter((documento) => documento.status === "PENDENTE").length;

  const indicadores: { label: string; value: string | number }[] = [
    { label: "Leads ativos", value: ativos },
    { label: "Em atendimento", value: emAtendimento },
    { label: "Aguardando documentos", value: aguardandoDocumentos },
    { label: "Finalizados", value: finalizados },
    { label: "Tempo médio de atendimento", value: "Em breve" },
    { label: "Documentos pendentes", value: documentosPendentes },
    { label: "Follow-ups vencidos", value: followUpsVencidos },
  ];

  return (
    <div className="rounded-2xl border border-selo-700/10 bg-white px-5 py-5">
      <h2 className="font-display text-base font-semibold text-selo-900">Indicadores</h2>

      <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {indicadores.map((item) => (
          <div key={item.label}>
            <dt className="text-xs uppercase tracking-wide text-ink/40">{item.label}</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold text-selo-900">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
