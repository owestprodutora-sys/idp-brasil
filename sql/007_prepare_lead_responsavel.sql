-- TASK-007B — Preparação de arquitetura para múltiplos profissionais.
-- NÃO implementa gerenciamento de profissionais agora — só adiciona a
-- coluna que vai guardar "quem é o responsável pelo lead" quando essa
-- funcionalidade for construída de fato. Hoje ela fica sempre nula, já
-- que só existe a Adrieli (ver lib/crm-config.ts#responsavelLabel, que
-- exibe o nome fixo dela enquanto essa coluna não é usada).
-- Rodar no SQL Editor do Supabase, depois de 001 a 006.

alter table public.leads
  add column if not exists profissional_id uuid references public.profiles(id);

comment on column public.leads.profissional_id is
  'Especialista responsável pelo lead. Nulo hoje (só existe a Adrieli) — preparado para múltiplos profissionais em tarefa futura.';
