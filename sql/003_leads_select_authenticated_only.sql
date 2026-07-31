-- Fecha o acesso público de leitura criado no 002 (temporário) e passa a
-- exigir autenticação (Supabase Auth) pra ler os leads — usado pelo /admin
-- agora que ele tem login (TASK-006 — Autenticação do Painel).
-- Rodar no SQL Editor do Supabase, depois do 001 e do 002.

drop policy if exists "Leitura de leads (temporário, sem autenticação)" on public.leads;

create policy "Leitura de leads (usuários autenticados)"
  on public.leads
  for select
  to authenticated
  using (true);

-- A policy de INSERT continua liberada pra "anon" (sql/001) — precisa
-- continuar assim, porque o formulário público de Cadastro não tem login.
