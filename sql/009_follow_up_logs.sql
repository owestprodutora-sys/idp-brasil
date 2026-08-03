-- MVP 1.1 — Fase 2: motor de follow-up (FEATURE 002) + cadência (FEATURE 003).
-- Rodar no SQL Editor do Supabase, depois de 001 a 008.
--
-- O que este script faz:
--   Cria `follow_up_logs`, o histórico de envios de follow-up confirmados
--   pela especialista (nunca automáticos — ver README/spec: não existe
--   envio automático de WhatsApp, só registro do que já foi enviado
--   manualmente). Cada linha aqui é um "Confirmar envio" no painel.
--
-- Não precisa de coluna nova em `leads`: a cadência (FEATURE 003) usa os
-- campos que já existem desde o TASK-007 (`ultimo_contato` e
-- `data_proximo_contato`) — o painel só passa a recalculá-los sozinho
-- (ultimo_contato = hoje; data_proximo_contato = hoje + intervalo padrão)
-- toda vez que um envio é confirmado, em vez de depender só de edição manual.

create table if not exists public.follow_up_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  mensagem text not null,
  enviado_em timestamptz not null default now(),
  usuario_id uuid references auth.users(id),
  -- Nome de quem confirmou o envio, guardado no momento do insert (evita
  -- depender de join com profiles só pra exibir no histórico; mesma lógica
  -- pragmática já usada em outros pontos do projeto pra manter simples).
  usuario_nome text
);

alter table public.follow_up_logs enable row level security;

-- Mesma política já usada em `leads`: só existem contas de staff hoje
-- (gestor/especialista), ambas precisam ler e registrar follow-ups.
drop policy if exists "Autenticados leem follow-ups" on public.follow_up_logs;
create policy "Autenticados leem follow-ups"
  on public.follow_up_logs
  for select
  to authenticated
  using (true);

drop policy if exists "Autenticados registram follow-ups" on public.follow_up_logs;
create policy "Autenticados registram follow-ups"
  on public.follow_up_logs
  for insert
  to authenticated
  with check (true);

create index if not exists follow_up_logs_lead_id_idx on public.follow_up_logs (lead_id);

comment on table public.follow_up_logs is
  'Histórico de follow-ups confirmados manualmente pela especialista (FEATURE 002). Nenhum envio automático é feito pelo sistema.';
