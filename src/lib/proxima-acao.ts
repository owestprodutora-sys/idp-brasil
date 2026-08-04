// FASE 4A — FEATURE 011. Regra 100% pura: sem dependência de interface,
// sem IA, sem chamada externa. Recebe o lead (+ checklist já carregado) e
// devolve a próxima ação recomendada pra especialista.

import { precisaDeAcompanhamento, resolveStatus } from "@/lib/crm-config";
import type { Documento } from "@/types/documento";
import type { Lead } from "@/types/lead";

export type ProximaAcaoUrgencia = "alta" | "media" | "baixa";

// Ação sugerida pro botão do card — o card decide o rótulo/ícone do botão,
// a página que o usa decide o que acontece ao clicar (ver ProximaAcaoCard.tsx
// e a integração em LeadDetailModal.tsx).
export type ProximaAcaoBotao =
  | { tipo: "copiar_mensagem"; label: string }
  | { tipo: "alterar_status"; label: string }
  | { tipo: "adicionar_observacao"; label: string };

export interface ProximaAcao {
  titulo: string;
  descricao: string;
  urgencia: ProximaAcaoUrgencia;
  botao: ProximaAcaoBotao | null;
}

export function determinarProximaAcao(lead: Lead, documentos: Documento[]): ProximaAcao {
  const status = resolveStatus(lead.status).value;

  if (status === "FINALIZADO") {
    return {
      titulo: "Nenhuma ação necessária",
      descricao: "Caso encerrado.",
      urgencia: "baixa",
      botao: null,
    };
  }

  if (status === "NOVO_LEAD") {
    return {
      titulo: "Fazer primeiro contato",
      descricao: "Este lead ainda não teve nenhum contato inicial.",
      urgencia: "alta",
      botao: { tipo: "copiar_mensagem", label: "Copiar mensagem" },
    };
  }

  const documentoParaReenviar = documentos.find(
    (d) => d.status === "INVALIDO" || d.status === "SOLICITAR_NOVO",
  );
  if (documentoParaReenviar) {
    return {
      titulo: "Solicitar novo documento",
      descricao: `"${documentoParaReenviar.nome}" precisa ser reenviado pelo cliente.`,
      urgencia: "alta",
      botao: { tipo: "copiar_mensagem", label: "Copiar mensagem" },
    };
  }

  if (precisaDeAcompanhamento(lead.status, lead.data_proximo_contato)) {
    return {
      titulo: "Enviar follow-up",
      descricao: lead.data_proximo_contato
        ? "O follow-up agendado para este lead já venceu."
        : "Este lead ainda não tem um próximo contato agendado.",
      urgencia: "alta",
      botao: { tipo: "copiar_mensagem", label: "Copiar mensagem" },
    };
  }

  if (status === "DOCUMENTACAO_COMPLETA") {
    return {
      titulo: "Agendar consulta",
      descricao: "A documentação está completa — hora de agendar a consulta com o cliente.",
      urgencia: "media",
      botao: { tipo: "alterar_status", label: "Alterar status" },
    };
  }

  if (status === "CONSULTA_AGENDADA") {
    return {
      titulo: "Gerar proposta",
      descricao: "Após a consulta, gerar a proposta para o cliente.",
      urgencia: "media",
      botao: { tipo: "adicionar_observacao", label: "Adicionar observação" },
    };
  }

  if (status === "CONTRATO") {
    return {
      titulo: "Iniciar execução",
      descricao: "Contrato assinado — iniciar a execução do serviço.",
      urgencia: "media",
      botao: { tipo: "alterar_status", label: "Alterar status" },
    };
  }

  // EXECUCAO (ou qualquer status sem regra específica acima) — caso em
  // andamento, sem sinal de risco identificado pelas regras anteriores.
  return {
    titulo: "Acompanhar andamento",
    descricao: "Caso em execução, sem ação pendente identificada no momento.",
    urgencia: "baixa",
    botao: { tipo: "adicionar_observacao", label: "Adicionar observação" },
  };
}
