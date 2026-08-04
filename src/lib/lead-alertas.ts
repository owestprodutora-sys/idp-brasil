import { documentoPrecisaReenvio, isProximaAcaoVencida, isSemContatoRecente } from "@/lib/crm-config";
import type { Documento } from "@/types/documento";
import type { Lead } from "@/types/lead";

export interface LeadAlerta {
  icone: string;
  texto: string;
}

// FASE 4B — extraído de LeadAlertas.tsx (FASE 4A / FEATURE 012) pra virar
// reutilizável também pelo bloco "Necessitam Atenção" do Dashboard
// Operacional (FEATURE 015) e pelo cálculo de "Casos críticos" do Meu Dia
// (FEATURE 013 — ver lib/meu-dia.ts). Nenhuma regra nova: comportamento
// idêntico ao que já existia embutido no componente.
export function listarAlertasDoLead(lead: Lead, documentos: Documento[]): LeadAlerta[] {
  const alertas: LeadAlerta[] = [];

  const documentoInvalido = documentos.find(documentoPrecisaReenvio);
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

  return alertas;
}
