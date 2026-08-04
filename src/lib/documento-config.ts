// MVP 1.1 — Fase 3. Fonte única de verdade pro status de documento e pro
// checklist automático por serviço (mesmo padrão já usado em crm-config.ts).

import type { DocumentoHistorico, DocumentoStatus } from "@/types/documento";

export interface DocumentoStatusOption {
  value: DocumentoStatus;
  emoji: string;
  label: string;
  badgeClass: string;
}

export const DOCUMENTO_STATUS_OPTIONS: DocumentoStatusOption[] = [
  {
    value: "PENDENTE",
    emoji: "⚪",
    label: "Pendente",
    badgeClass: "bg-ink/5 text-ink/60 border-ink/20",
  },
  {
    value: "RECEBIDO",
    emoji: "🔵",
    label: "Recebido",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    value: "VALIDADO",
    emoji: "🟢",
    label: "Validado",
    badgeClass: "bg-green-50 text-green-700 border-green-200",
  },
  {
    value: "SOLICITAR_NOVO",
    emoji: "🟡",
    label: "Solicitar novo",
    badgeClass: "bg-ouro-50 text-ouro-600 border-ouro-500/40",
  },
  {
    value: "INVALIDO",
    emoji: "🔴",
    label: "Inválido",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
];

const DOCUMENTO_STATUS_MAP = new Map(DOCUMENTO_STATUS_OPTIONS.map((o) => [o.value, o]));

export function resolveDocumentoStatus(status: string): DocumentoStatusOption {
  return (
    DOCUMENTO_STATUS_MAP.get(status as DocumentoStatus) ?? {
      value: status as DocumentoStatus,
      emoji: "•",
      label: status,
      badgeClass: "bg-ink/5 text-ink/60 border-ink/10",
    }
  );
}

// Status que representam "o documento já avançou" — usados na regra de
// troca de serviço combinada com o usuário: se algum documento do lead já
// está em um desses status, a troca de serviço não pode apagar nada.
export const DOCUMENTO_STATUS_AVANCADOS: DocumentoStatus[] = [
  "RECEBIDO",
  "VALIDADO",
  "SOLICITAR_NOVO",
  "INVALIDO",
];

// Checklist documental por serviço (seção "CHECKLIST POR SERVIÇO" do spec
// da Fase 3). `tipo` é o slug persistido em documentos.tipo — usado tanto
// pra gerar o checklist automaticamente quanto pra nunca duplicar linha
// (constraint unique (lead_id, tipo) em sql/010).
export interface ChecklistItem {
  tipo: string;
  nome: string;
}

// As chaves batem com SERVICO_OPTIONS (crm-config.ts): isencao_ir,
// inss_acima_teto, ipva_pcd.
export const DOCUMENTO_CHECKLIST_POR_SERVICO: Record<string, ChecklistItem[]> = {
  isencao_ir: [
    { tipo: "rg", nome: "RG" },
    { tipo: "cpf", nome: "CPF" },
    { tipo: "laudo_medico", nome: "Laudo Médico" },
    { tipo: "informe_rendimentos", nome: "Informe de Rendimentos" },
    { tipo: "comprovante_aposentadoria", nome: "Comprovante da aposentadoria" },
  ],
  inss_acima_teto: [
    { tipo: "cnis", nome: "CNIS" },
    { tipo: "documento_pessoal", nome: "Documento pessoal" },
    { tipo: "comprovante_renda", nome: "Comprovantes de renda" },
    { tipo: "procuracao", nome: "Procuração" },
  ],
  ipva_pcd: [
    { tipo: "documento_pessoal", nome: "Documento pessoal" },
    { tipo: "crlv", nome: "CRLV" },
    { tipo: "laudo_medico", nome: "Laudo Médico" },
  ],
};

export function checklistDoServico(servico: string | null | undefined): ChecklistItem[] {
  if (!servico) return [];
  return DOCUMENTO_CHECKLIST_POR_SERVICO[servico] ?? [];
}

// FASE 4A — movido de LeadDetailModal.tsx pra virar fonte única de verdade:
// usado tanto pelo histórico por documento (dentro do modal) quanto pela
// Timeline Unificada (FEATURE 010, src/lib/lead-timeline.ts).
export const ACAO_HISTORICO_LABEL: Record<DocumentoHistorico["acao"], string> = {
  CHECKLIST_GERADO: "Item do checklist gerado",
  DOCUMENTO_ENVIADO: "Documento enviado",
  DOCUMENTO_SUBSTITUIDO: "Documento substituído",
  DOCUMENTO_VALIDADO: "Marcado como correto",
  DOCUMENTO_REJEITADO: "Marcado como inválido",
  NOVA_VERSAO_SOLICITADA: "Nova versão solicitada",
};

// Ícone por ação — só usado pela Timeline (o histórico dentro do modal já
// tem contexto visual suficiente sem ícone, ver LeadDetailModal.tsx).
export const ACAO_HISTORICO_ICONE: Record<DocumentoHistorico["acao"], string> = {
  CHECKLIST_GERADO: "📋",
  DOCUMENTO_ENVIADO: "📤",
  DOCUMENTO_SUBSTITUIDO: "🔁",
  DOCUMENTO_VALIDADO: "✅",
  DOCUMENTO_REJEITADO: "❌",
  NOVA_VERSAO_SOLICITADA: "🔄",
};
