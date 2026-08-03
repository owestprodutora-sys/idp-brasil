-- Corrige o default de public.leads.status.
--
-- Bug: a migration 001 criou a coluna com default 'novo' (minúsculo). A
-- migration 008 trocou os valores válidos do CHECK constraint pra
-- maiúsculo ('NOVO_LEAD', ...) mas esqueceu de atualizar o default —
-- desde então, qualquer insert em `leads` que não informe `status`
-- explicitamente (ex: Register.tsx, cadastro público da landing) falha
-- com "violates check constraint leads_status_check".

alter table public.leads
  alter column status set default 'NOVO_LEAD';
