-- FASE 5A — Centro Financeiro Operacional.
-- Rodar no SQL Editor do Supabase, depois de 001 a 012.
--
-- O que este script faz:
--   Cria `lead_financeiro` — o controle financeiro de cada lead, totalmente
--   separado do CRM (que fica em `leads`). Os dois só se falam pelo
--   `lead_id`. Não é um sistema contábil: só registro manual de quanto há
--   pra receber, quanto já foi recebido, e quanto pertence à especialista
--   x à IDP Brasil.
--
--   Relação 1:1 com o lead (`unique (lead_id)`) — cada lead tem no máximo
--   um registro financeiro nesta fase (sem parcelamento, sem múltiplos
--   contratos por lead ainda).

create table if not exists public.lead_financeiro (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,

  valor_recuperacao_estimado numeric(12, 2),
  percentual_honorarios numeric(5, 2),
  valor_honorarios numeric(12, 2),
  percentual_comissao_idp numeric(5, 2),
  valor_comissao_idp numeric(12, 2),
  valor_especialista numeric(12, 2),

  status_financeiro text not null default 'PENDENTE'
    check (status_financeiro in ('PENDENTE', 'PARCIAL', 'RECEBIDO', 'CANCELADO')),

  data_prevista_pagamento date,
  data_recebimento date,
  forma_pagamento text,
  observacoes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (lead_id)
);

create index if not exists lead_financeiro_lead_id_idx on public.lead_financeiro (lead_id);
create index if not exists lead_financeiro_status_idx on public.lead_financeiro (status_financeiro);

alter table public.lead_financeiro enable row level security;

-- Mesma política já usada nas demais tabelas do CRM: só existem contas de
-- staff hoje (gestor/especialista), ambas precisam ler e registrar dados
-- financeiros.
drop policy if exists "Autenticados leem financeiro" on public.lead_financeiro;
create policy "Autenticados leem financeiro"
  on public.lead_financeiro
  for select
  to authenticated
  using (true);

drop policy if exists "Autenticados criam financeiro" on public.lead_financeiro;
create policy "Autenticados criam financeiro"
  on public.lead_financeiro
  for insert
  to authenticated
  with check (true);

drop policy if exists "Autenticados atualizam financeiro" on public.lead_financeiro;
create policy "Autenticados atualizam financeiro"
  on public.lead_financeiro
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Autenticados removem financeiro" on public.lead_financeiro;
create policy "Autenticados removem financeiro"
  on public.lead_financeiro
  for delete
  to authenticated
  using (true);

comment on table public.lead_financeiro is
  'Centro Financeiro Operacional (FASE 5A). Separado do CRM — só se relaciona com leads via lead_id. Valores de honorários/comissão/especialista são calculados em código (src/lib/financeiro.ts) e persistidos aqui, nunca recalculados só em tela.';
