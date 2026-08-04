// FASE 5A — Centro Financeiro Operacional. Espelha o schema de
// sql/013_financeiro.sql.
// FASE 5A.1 — Centro de Comissões acrescenta status_comissao e as datas/
// observações do repasse (sql/014_comissao_idp.sql), sem tabela nova.

export type StatusFinanceiro = "PENDENTE" | "PARCIAL" | "RECEBIDO" | "CANCELADO";

// FASE 5A.1 — status do repasse manual da comissão (especialista -> IDP),
// independente do status_financeiro (que é sobre o pagamento do cliente).
export type StatusComissao = "PENDENTE" | "AGUARDANDO_CONFERENCIA" | "PAGO" | "ISENTO";

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
  // FASE 5A.1 — Centro de Comissões (MVP).
  status_comissao: StatusComissao;
  data_informado_pagamento_comissao: string | null;
  data_confirmacao_comissao: string | null;
  observacoes_comissao: string | null;
}
