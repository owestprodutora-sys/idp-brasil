// FASE 5A — Centro Financeiro Operacional. Espelha o schema de
// sql/013_financeiro.sql.

export type StatusFinanceiro = "PENDENTE" | "PARCIAL" | "RECEBIDO" | "CANCELADO";

export interface LeadFinanceiro {
  id: string;
  lead_id: string;
  valor_recuperacao_estimado: number | null;
  percentual_honorarios: number | null;
  valor_honorarios: number | null;
  percentual_comissao_idp: number | null;
  valor_comissao_idp: number | null;
  valor_especialista: number | null;
  status_financeiro: StatusFinanceiro;
  data_prevista_pagamento: string | null;
  data_recebimento: string | null;
  forma_pagamento: string | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}
