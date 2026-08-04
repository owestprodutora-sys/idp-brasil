// FASE 4A — FEATURE 010. Une cronologicamente lead_eventos, follow_up_logs,
// documento_historico e o evento sintético "Lead criado". Toda regra fica
// aqui — o componente (LeadTimeline.tsx) só renderiza o que esta função
// devolve.

import { ACAO_HISTORICO_ICONE, ACAO_HISTORICO_LABEL } from "@/lib/documento-config";
import { resolveLeadEventoTipo } from "@/lib/lead-evento-config";
import { supabase } from "@/lib/supabase";
import type { Documento, DocumentoHistorico } from "@/types/documento";
import type { Lead } from "@/types/lead";
import type { LeadEvento } from "@/types/lead-evento";

export interface TimelineItem {
  id: string;
  icone: string;
  titulo: string;
  descricao: string | null;
  data: string; // ISO datetime — usado tanto pra exibir quanto pra ordenar
  usuarioNome: string | null;
}

// `documentos` é recebido pronto (já carregado pelo modal) em vez de
// buscado de novo aqui — evita uma query redundante, já que quem chama
// esta função (LeadDetailModal) já mantém o checklist em estado.
export async function buildLeadTimeline(
  lead: Lead,
  documentos: Documento[],
): Promise<TimelineItem[]> {
  const [eventosResult, followUpResult, documentoHistoricoResult] = await Promise.all([
    supabase.from("lead_eventos").select("*").eq("lead_id", lead.id),
    supabase.from("follow_up_logs").select("*").eq("lead_id", lead.id),
    supabase.from("documento_historico").select("*").eq("lead_id", lead.id),
  ]);

  if (eventosResult.error) {
    throw new Error(`Não foi possível carregar os eventos do lead: ${eventosResult.error.message}`);
  }
  if (followUpResult.error) {
    throw new Error(`Não foi possível carregar os follow-ups: ${followUpResult.error.message}`);
  }
  if (documentoHistoricoResult.error) {
    throw new Error(
      `Não foi possível carregar o histórico de documentos: ${documentoHistoricoResult.error.message}`,
    );
  }

  const eventos = (eventosResult.data ?? []) as LeadEvento[];
  const followUps = (followUpResult.data ?? []) as {
    id: string;
    mensagem: string;
    enviado_em: string;
    usuario_nome: string | null;
  }[];
  const documentoHistorico = (documentoHistoricoResult.data ?? []) as DocumentoHistorico[];

  const documentoNomePorId = new Map(documentos.map((d) => [d.id, d.nome]));

  const itensEventos: TimelineItem[] = eventos.map((evento) => {
    const tipoOption = resolveLeadEventoTipo(evento.tipo);
    return {
      id: `evento-${evento.id}`,
      icone: tipoOption.icone,
      titulo: tipoOption.label,
      descricao: evento.descricao,
      data: evento.criado_em,
      usuarioNome: evento.usuario_nome,
    };
  });

  const itensFollowUp: TimelineItem[] = followUps.map((log) => ({
    id: `followup-${log.id}`,
    icone: "💬",
    titulo: "Follow-up enviado",
    descricao: log.mensagem,
    data: log.enviado_em,
    usuarioNome: log.usuario_nome,
  }));

  const itensDocumento: TimelineItem[] = documentoHistorico.map((registro) => {
    const nomeDocumento = documentoNomePorId.get(registro.documento_id) ?? null;
    const titulo = ACAO_HISTORICO_LABEL[registro.acao] ?? registro.acao;
    return {
      id: `documento-${registro.id}`,
      icone: ACAO_HISTORICO_ICONE[registro.acao] ?? "📄",
      titulo: nomeDocumento ? `${titulo} — ${nomeDocumento}` : titulo,
      descricao: registro.observacao,
      data: registro.criado_em,
      usuarioNome: registro.usuario_nome,
    };
  });

  // Evento sintético — não vem de nenhuma tabela, é derivado de leads.created_at.
  const itemLeadCriado: TimelineItem = {
    id: `lead-criado-${lead.id}`,
    icone: "🆕",
    titulo: "Lead criado",
    descricao: null,
    data: lead.created_at,
    usuarioNome: null,
  };

  return [...itensEventos, ...itensFollowUp, ...itensDocumento, itemLeadCriado].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  );
}
