// FASE 4B — FEATURE 013. Só agrega números a partir de regras que já
// existem em outros módulos (crm-config.ts, lead-alertas.ts) e das tabelas
// já carregadas (leads, documentos, lead_eventos) — nenhuma regra de
// negócio nova é criada aqui, conforme o princípio mais importante do spec.

import { CLOSED_STATUSES, isProximaAcaoVencida } from "@/lib/crm-config";
import { listarAlertasDoLead } from "@/lib/lead-alertas";
import type { Documento } from "@/types/documento";
import type { Lead } from "@/types/lead";

export interface MeuDiaResumo {
  novosLeads: number;
  followUpsVencidos: number;
  documentosAguardandoValidacao: number;
  documentosInvalidos: number;
  casosCriticos: number;
  finalizadosHoje: number;
}

// Usado tanto pelo resumo do Meu Dia quanto pela Fila de Trabalho e por
// Casos Críticos — evita repetir esse agrupamento em cada componente.
export function agruparDocumentosPorLead(documentos: Documento[]): Map<string, Documento[]> {
  const mapa = new Map<string, Documento[]>();
  for (const documento of documentos) {
    const lista = mapa.get(documento.lead_id) ?? [];
    lista.push(documento);
    mapa.set(documento.lead_id, lista);
  }
  return mapa;
}

export function buildMeuDiaResumo(
  leads: Lead[],
  documentos: Documento[],
  leadIdsFinalizadosHoje: Set<string>,
): MeuDiaResumo {
  const documentosPorLead = agruparDocumentosPorLead(documentos);

  const novosLeads = leads.filter((lead) => lead.status === "NOVO_LEAD").length;

  const followUpsVencidos = leads.filter(
    (lead) =>
      !CLOSED_STATUSES.includes(lead.status as (typeof CLOSED_STATUSES)[number]) &&
      isProximaAcaoVencida(lead.data_proximo_contato),
  ).length;

  const documentosAguardandoValidacao = documentos.filter((d) => d.status === "RECEBIDO").length;
  const documentosInvalidos = documentos.filter((d) => d.status === "INVALIDO").length;

  const casosCriticos = leads.filter(
    (lead) => listarAlertasDoLead(lead, documentosPorLead.get(lead.id) ?? []).length > 0,
  ).length;

  const finalizadosHoje = leads.filter(
    (lead) => lead.status === "FINALIZADO" && leadIdsFinalizadosHoje.has(lead.id),
  ).length;

  return {
    novosLeads,
    followUpsVencidos,
    documentosAguardandoValidacao,
    documentosInvalidos,
    casosCriticos,
    finalizadosHoje,
  };
}
