-- Permite leitura dos leads pra alimentar o Painel Adrieli (/admin)
-- Rodar no SQL Editor do Supabase, depois do 001_create_leads_table.sql

-- ⚠️ AVISO DE SEGURANÇA
-- A policy abaixo libera a LEITURA de todos os leads (nome, telefone,
-- cidade, doença informada etc.) pra qualquer pessoa que tenha a chave
-- anon (que é pública, vai embutida no site). Isso significa que, hoje,
-- QUALQUER pessoa que descobrir a URL /admin consegue ver os dados de
-- todos os leads — não existe login/autenticação protegendo essa rota.
--
-- Isso foi um trade-off consciente pra colocar o MVP no ar rápido
-- (TASK-008 não pediu autenticação). Antes de divulgar o /admin ou usar
-- com leads reais em produção, o recomendado é:
--   1. Trocar essa policy "to anon" por "to authenticated"
--   2. Ativar o Supabase Auth e exigir login da Adrieli pra acessar /admin
-- Me avise quando quiser que eu implemente isso.

drop policy if exists "Leitura de leads (temporário, sem autenticação)" on public.leads;

create policy "Leitura de leads (temporário, sem autenticação)"
  on public.leads
  for select
  to anon
  using (true);
