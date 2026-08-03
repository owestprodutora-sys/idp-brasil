-- TASK-007 — CRM operacional mínimo no Painel Adrieli
-- Adiciona os campos de acompanhamento de atendimento à tabela leads e
-- libera a atualização desses campos (UPDATE) para usuários autenticados.
-- Rodar no SQL Editor do Supabase, depois dos scripts 001 a 004.

alter table public.leads
  add column if not exists prioridade text not null default 'normal',
  add column if not exists observacoes text,
  add column if not exists ultimo_contato date,
  add column if not exists proxima_acao text,
  add column if not exists data_proximo_contato date,
  add column if not exists motivo_encerramento text;

-- Até aqui não existia nenhuma policy de UPDATE — o painel só lia (select)
-- e inseria (insert) leads. O CRM precisa que a Adrieli edite status,
-- prioridade, observações etc. a partir do /admin, então liberamos o
-- UPDATE apenas para quem está autenticado (mesma regra do SELECT em 003).

drop policy if exists "Atualização de leads (usuários autenticados)" on public.leads;

create policy "Atualização de leads (usuários autenticados)"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);
