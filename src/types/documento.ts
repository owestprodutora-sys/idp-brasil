// MVP 1.1 — Fase 3 (FEATURE 004). Espelha o schema de sql/010_documentos.sql.

export type DocumentoStatus =
  | "PENDENTE"
  | "RECEBIDO"
  | "VALIDADO"
  | "SOLICITAR_NOVO"
  | "INVALIDO";

export interface Documento {
  id: string;
  lead_id: string;
  tipo: string;
  nome: string;
  status: DocumentoStatus;
  storage_path: string | null;
  arquivo_nome_original: string | null;
  mime_type: string | null;
  tamanho_bytes: number | null;
  observacoes: string | null;
  responsavel_id: string | null;
  responsavel_nome: string | null;
  criado_em: string;
  atualizado_em: string;
}

// FEATURE 008 — log de ações sobre um documento.
export type DocumentoHistoricoAcao =
  | "CHECKLIST_GERADO"
  | "DOCUMENTO_ENVIADO"
  | "DOCUMENTO_SUBSTITUIDO"
  | "DOCUMENTO_VALIDADO"
  | "DOCUMENTO_REJEITADO"
  | "NOVA_VERSAO_SOLICITADA";

export interface DocumentoHistorico {
  id: string;
  documento_id: string;
  lead_id: string;
  acao: DocumentoHistoricoAcao;
  observacao: string | null;
  usuario_id: string | null;
  usuario_nome: string | null;
  criado_em: string;
}
