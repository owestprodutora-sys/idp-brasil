-- FASE 5A.1 — Centro de Comissões (MVP).
-- Rodar no SQL Editor do Supabase, depois de 001 a 013.
--
-- O que este script faz:
--   Acrescenta a `lead_financeiro` (não cria tabela nova) o controle da
--   comissão que a especialista repassa manualmente à IDP Brasil via Pix.
--   `valor_comissao_idp` já existe desde a FASE 5A e continua sendo a única
--   fonte do valor — aqui só entra o *status* desse repasse.
--
--   Fluxo (sem gateway/integração bancária):
--     PENDENTE -> AGUARDANDO_CONFERENCIA -> PAGO
--     PENDENTE -> ISENTO (caso excepcional, decidido pelo gestor)
--   Ambos os passos de transição podem ser revertidos pelo gestor
--   ("voltar para pendente").

alter table public.lead_financeiro
  add column if not exists status_comissao text not null default 'PENDENTE'
    check (status_comissao in ('PENDENTE', 'AGUARDANDO_CONFERENCIA', 'PAGO', 'ISENTO'));

alter table public.lead_financeiro
  add column if not exists data_informado_pagamento_comissao date;

alter table public.lead_financeiro
  add column if not exists data_confirmacao_comissao date;

alter table public.lead_financeiro
  add column if not exists observacoes_comissao text;

create index if not exists lead_financeiro_status_comissao_idx
  on public.lead_financeiro (status_comissao);

comment on column public.lead_financeiro.status_comissao is
  'Controle operacional do repasse Pix da comissão à IDP Brasil (FASE 5A.1). Não é status de pagamento do cliente — isso continua em status_financeiro.';
comment on column public.lead_financeiro.data_informado_pagamento_comissao is
  'Data em que a especialista marcou "pagamento realizado" (Pix manual).';
comment on column public.lead_financeiro.data_confirmacao_comissao is
  'Data em que o gestor confirmou o recebimento da comissão.';
comment on column public.lead_financeiro.observacoes_comissao is
  'Observações específicas do repasse de comissão (separado de `observacoes`, que é sobre o pagamento do cliente).';

-- RLS: nenhuma política nova necessária — lead_financeiro já permite
-- select/insert/update para qualquer usuário autenticado (gestor e
-- especialista são os únicos perfis hoje), e as colunas novas seguem a
-- mesma política da tabela.
