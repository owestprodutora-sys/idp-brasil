-- FASE 4A — Inteligência Operacional (FEATURE 009).
-- Rodar no SQL Editor do Supabase, depois de 001 a 011.
--
-- O que este script faz:
--   Cria `lead_eventos`, o Log Oficial de Eventos do Lead. Não é pensada
--   apenas para alimentar a Timeline (FEATURE 010) — é uma fonte de dados
--   reutilizável, que outros módulos da plataforma poderão gravar e ler no
--   futuro (ver lista de tipos futuros no comentário da coluna `tipo`).
--
-- Por que `tipo` é `text` livre, sem `check constraint`:
--   Ao contrário de `documento_historico.acao` (sql/010), aqui o conjunto de
--   tipos deve poder crescer sem exigir uma nova migration a cada evento
--   novo (ver seção "TIPOS DE EVENTOS" do spec da Fase 4A). A validação do
--   conjunto conhecido hoje fica em código (src/lib/lead-evento-config.ts).

create table if not exists public.lead_eventos (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,

  -- Slug do tipo de evento. Nesta fase: STATUS_ALTERADO, PRIORIDADE_ALTERADA,
  -- SERVICO_ALTERADO, OBSERVACAO_ADICIONADA, CASO_FINALIZADO.
  -- (LEAD_CRIADO não é gravado aqui — é sintetizado a partir de
  -- leads.created_at, ver src/lib/lead-timeline.ts.)
  -- Tipos futuros já previstos na arquitetura (não implementados agora):
  -- FOLLOW_UP_CONFIRMADO, DOCUMENTO_ENVIADO, DOCUMENTO_VALIDADO,
  -- DOCUMENTO_REJEITADO, DOCUMENTO_SUBSTITUIDO, CONSULTA_AGENDADA,
  -- PROPOSTA_GERADA, CONTRATO_ASSINADO, HONORARIO_RECEBIDO,
  -- PAGAMENTO_CONFIRMADO, etc.
  tipo text not null,

  descricao text,

  -- Mesmo padrão pragmático já usado em follow_up_logs e documento_historico:
  -- guarda o nome de quem gerou o evento no momento do insert.
  usuario_id uuid references auth.users(id),
  usuario_nome text,

  criado_em timestamptz not null default now()
);

create index if not exists lead_eventos_lead_id_idx on public.lead_eventos (lead_id);
create index if not exists lead_eventos_lead_id_criado_em_idx
  on public.lead_eventos (lead_id, criado_em desc);

alter table public.lead_eventos enable row level security;

-- Mesma política já usada nas demais tabelas do CRM: só existem contas de
-- staff hoje (gestor/especialista), ambas precisam ler e registrar eventos.
drop policy if exists "Autenticados leem eventos do lead" on public.lead_eventos;
create policy "Autenticados leem eventos do lead"
  on public.lead_eventos
  for select
  to authenticated
  using (true);

drop policy if exists "Autenticados registram eventos do lead" on public.lead_eventos;
create policy "Autenticados registram eventos do lead"
  on public.lead_eventos
  for insert
  to authenticated
  with check (true);

comment on table public.lead_eventos is
  'Log oficial de eventos operacionais do lead (FEATURE 009, Fase 4A). Não depende da Timeline — é reutilizável por outros módulos da plataforma. Base de dados da Timeline Unificada (FEATURE 010).';
