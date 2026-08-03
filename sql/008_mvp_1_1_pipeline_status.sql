-- MVP 1.1 — Fase 1: pipeline operacional (CRM)
-- Rodar no SQL Editor do Supabase, depois de 001 a 007.
--
-- O que este script faz:
--   1. Adiciona email, servico, origem (campos do lead pedidos no MVP 1.1)
--      e motivo_finalizacao (motivo de encerramento em nível de pipeline —
--      diferente de `motivo_encerramento`, que já existia desde o TASK-007
--      e guarda o motivo detalhado de elegibilidade; os dois convivem).
--   2. Migra os leads existentes do status antigo (TASK-007) para o novo
--      pipeline linear, preservando o motivo de quem já estava encerrado.
--   3. Trava `status` e `motivo_finalizacao` em listas fechadas (CHECK),
--      pra evitar valor solto vindo de um bug no front.
--
-- Pipeline novo:
--   NOVO_LEAD -> PRE_ANALISE -> DOCUMENTOS_SOLICITADOS -> DOCUMENTACAO_COMPLETA
--   -> CONSULTA_AGENDADA -> CONTRATO -> EXECUCAO -> FINALIZADO
-- FINALIZADO é o único status final; o desfecho vai em motivo_finalizacao
-- (CONTRATADO_CONCLUIDO, NAO_ELEGIVEL, DESISTENCIA_CLIENTE, SEM_RETORNO,
-- ARQUIVADO, DUPLICADO, ENCAMINHADO).

alter table public.leads
  add column if not exists email text,
  add column if not exists servico text,
  add column if not exists origem text not null default 'site',
  add column if not exists motivo_finalizacao text;

-- Migração de dados: status antigo -> novo, preservando o motivo de
-- encerramento pra quem já estava em nao_elegivel/arquivado.
update public.leads set
  motivo_finalizacao = case status
    when 'nao_elegivel' then 'NAO_ELEGIVEL'
    when 'arquivado' then 'ARQUIVADO'
    when 'perdido' then 'ARQUIVADO' -- esquema legado, pré TASK-007
    else motivo_finalizacao
  end,
  status = case status
    when 'novo' then 'NOVO_LEAD'
    when 'primeiro_contato_pendente' then 'PRE_ANALISE'
    when 'em_analise' then 'PRE_ANALISE'
    when 'aguardando_documento' then 'DOCUMENTOS_SOLICITADOS'
    when 'elegivel' then 'DOCUMENTACAO_COMPLETA'
    when 'nao_elegivel' then 'FINALIZADO'
    when 'arquivado' then 'FINALIZADO'
    -- esquema legado (pré TASK-007)
    when 'contatado' then 'PRE_ANALISE'
    when 'convertido' then 'DOCUMENTACAO_COMPLETA'
    when 'perdido' then 'FINALIZADO'
    else status
  end
where status in (
  'novo', 'primeiro_contato_pendente', 'em_analise', 'aguardando_documento',
  'elegivel', 'nao_elegivel', 'arquivado', 'contatado', 'convertido', 'perdido'
);

alter table public.leads
  drop constraint if exists leads_status_check;

alter table public.leads
  add constraint leads_status_check
  check (status in (
    'NOVO_LEAD', 'PRE_ANALISE', 'DOCUMENTOS_SOLICITADOS', 'DOCUMENTACAO_COMPLETA',
    'CONSULTA_AGENDADA', 'CONTRATO', 'EXECUCAO', 'FINALIZADO'
  ));

alter table public.leads
  drop constraint if exists leads_motivo_finalizacao_check;

alter table public.leads
  add constraint leads_motivo_finalizacao_check
  check (motivo_finalizacao is null or motivo_finalizacao in (
    'CONTRATADO_CONCLUIDO', 'NAO_ELEGIVEL', 'DESISTENCIA_CLIENTE',
    'SEM_RETORNO', 'ARQUIVADO', 'DUPLICADO', 'ENCAMINHADO'
  ));

comment on column public.leads.motivo_finalizacao is
  'Desfecho do pipeline quando status = FINALIZADO. Não usar em nenhum outro status.';
comment on column public.leads.servico is
  'Serviço de interesse do lead (ex: isencao_ir, inss_acima_teto, ipva_pcd). Ver lib/crm-config.ts#SERVICO_OPTIONS.';
comment on column public.leads.origem is
  'Canal de origem do lead. Default "site" pra não deixar nulo em leads que já existiam.';
