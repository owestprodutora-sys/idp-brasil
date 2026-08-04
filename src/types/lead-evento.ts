// FASE 4A — Espelha o schema de sql/012_lead_eventos.sql (FEATURE 009).

export interface LeadEvento {
  id: string;
  lead_id: string;
  tipo: string;
  descricao: string | null;
  usuario_id: string | null;
  usuario_nome: string | null;
  criado_em: string;
}
