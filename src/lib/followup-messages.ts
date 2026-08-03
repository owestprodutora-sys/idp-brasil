// MVP 1.1 — Fase 2 (FEATURE 002). Mensagem sugerida por status do
// pipeline — só um texto de partida pra especialista copiar e ajustar
// antes de enviar manualmente no WhatsApp. Nada aqui é enviado sozinho.
import { resolveStatus } from "@/lib/crm-config";
import type { Lead } from "@/types/lead";

function primeiroNome(nomeCompleto: string): string {
  return nomeCompleto.trim().split(/\s+/)[0] ?? nomeCompleto;
}

export function mensagemSugerida(lead: Lead): string {
  const nome = primeiroNome(lead.nome);

  switch (resolveStatus(lead.status).value) {
    case "NOVO_LEAD":
      return `Olá, ${nome}! Aqui é a equipe da IDP Brasil. Recebemos sua pré-análise sobre a isenção do Imposto de Renda e já estamos avaliando o seu caso. Posso te fazer algumas perguntas rápidas pra dar continuidade?`;

    case "PRE_ANALISE":
      return `Olá, ${nome}! Estamos concluindo a análise inicial do seu caso de isenção de IR. Em breve te retorno com os próximos passos, tudo bem?`;

    case "DOCUMENTOS_SOLICITADOS":
      return `Olá, ${nome}! Passando pra saber se você conseguiu separar os documentos que pedimos pra dar sequência no seu processo de isenção. Qualquer dúvida sobre o que enviar, estou à disposição.`;

    case "DOCUMENTACAO_COMPLETA":
      return `Olá, ${nome}! Recebemos toda a sua documentação. Vamos agendar uma conversa pra explicar os próximos passos do seu caso?`;

    case "CONSULTA_AGENDADA":
      return `Olá, ${nome}! Passando pra confirmar nossa consulta sobre o seu processo de isenção de IR. Continua de pé?`;

    case "CONTRATO":
      return `Olá, ${nome}! Seu contrato está pronto pra assinatura. Posso te enviar os detalhes agora?`;

    case "EXECUCAO":
      return `Olá, ${nome}! Seu processo de isenção está em andamento. Assim que tivermos novidades, te aviso por aqui.`;

    default:
      return `Olá, ${nome}! Aqui é a equipe da IDP Brasil, passando pra saber como está o seu caso.`;
  }
}
