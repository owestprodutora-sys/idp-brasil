-- MVP 1.1 — Fase 3: Central de Documentos (FEATURE 004 a 008).
-- Rodar no SQL Editor do Supabase, depois de 001 a 009.
--
-- O que este script faz:
--   1. Cria `documentos` — o checklist documental de cada lead. Cada linha
--      é UM documento esperado (ou já enviado) do cliente, com ciclo de
--      vida próprio (PENDENTE → RECEBIDO → VALIDADO/SOLICITAR_NOVO/INVALIDO).
--      O checklist é PERSISTIDO aqui — nunca recalculado em tela (ver
--      src/lib/documento-checklist.ts).
--   2. Cria `documento_historico` — log de toda ação sobre um documento
--      (Feature 008), base pra futura timeline do cliente.
--   3. Cria o bucket de Storage `documentos-clientes` (privado) e as
--      políticas de acesso (só staff autenticado — mesmo critério já
--      usado nas tabelas do CRM: hoje só existem contas de gestor/especialista).

create table if not exists public.documentos (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,

  -- Slug do tipo de documento (ex: "rg", "laudo_medico") — usado tanto
  -- pro checklist automático por serviço quanto pra evitar duplicar linha
  -- quando o serviço é salvo de novo ou trocado (ver lib/documento-checklist.ts).
  tipo text not null,
  nome text not null,

  status text not null default 'PENDENTE'
    check (status in ('PENDENTE', 'RECEBIDO', 'VALIDADO', 'SOLICITAR_NOVO', 'INVALIDO')),

  -- Preenchidos só depois do upload manual (Feature 005) — ficam nulos
  -- enquanto o documento é apenas um item de checklist ainda não enviado.
  storage_path text,
  arquivo_nome_original text,
  mime_type text,
  tamanho_bytes bigint,

  observacoes text,

  -- Quem fez o upload / a última validação. Mesmo padrão pragmático já
  -- usado em follow_up_logs: guarda o nome no momento da ação, sem
  -- depender de join com profiles pra exibir.
  responsavel_id uuid references auth.users(id),
  responsavel_nome text,

  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  -- Um mesmo tipo de documento não se repete pro mesmo lead — é o que
  -- garante não duplicar o checklist quando o serviço é salvo sem mudança
  -- (item combinado com o usuário antes desta migration).
  unique (lead_id, tipo)
);

create index if not exists documentos_lead_id_idx on public.documentos (lead_id);

alter table public.documentos enable row level security;

drop policy if exists "Autenticados leem documentos" on public.documentos;
create policy "Autenticados leem documentos"
  on public.documentos
  for select
  to authenticated
  using (true);

drop policy if exists "Autenticados criam documentos" on public.documentos;
create policy "Autenticados criam documentos"
  on public.documentos
  for insert
  to authenticated
  with check (true);

drop policy if exists "Autenticados atualizam documentos" on public.documentos;
create policy "Autenticados atualizam documentos"
  on public.documentos
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Autenticados removem documentos" on public.documentos;
create policy "Autenticados removem documentos"
  on public.documentos
  for delete
  to authenticated
  using (true);

comment on table public.documentos is
  'Checklist documental persistido por lead (FEATURE 004). Gerado/atualizado automaticamente quando o serviço é definido ou trocado — ver src/lib/documento-checklist.ts. Nunca recalculado só em tela.';

-- FEATURE 008 — histórico de ações sobre cada documento.
create table if not exists public.documento_historico (
  id uuid primary key default gen_random_uuid(),
  documento_id uuid not null references public.documentos(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,

  acao text not null
    check (acao in (
      'CHECKLIST_GERADO',
      'DOCUMENTO_ENVIADO',
      'DOCUMENTO_SUBSTITUIDO',
      'DOCUMENTO_VALIDADO',
      'DOCUMENTO_REJEITADO',
      'NOVA_VERSAO_SOLICITADA'
    )),

  observacao text,
  usuario_id uuid references auth.users(id),
  usuario_nome text,

  criado_em timestamptz not null default now()
);

create index if not exists documento_historico_documento_id_idx
  on public.documento_historico (documento_id);
create index if not exists documento_historico_lead_id_idx
  on public.documento_historico (lead_id);

alter table public.documento_historico enable row level security;

drop policy if exists "Autenticados leem historico de documentos" on public.documento_historico;
create policy "Autenticados leem historico de documentos"
  on public.documento_historico
  for select
  to authenticated
  using (true);

drop policy if exists "Autenticados registram historico de documentos" on public.documento_historico;
create policy "Autenticados registram historico de documentos"
  on public.documento_historico
  for insert
  to authenticated
  with check (true);

comment on table public.documento_historico is
  'Log de toda ação sobre um documento (FEATURE 008) — base para a futura timeline do cliente.';

-- Bucket de Storage privado pros arquivos enviados manualmente (Feature 005).
-- Privado de propósito: não existe portal do cliente nem link público —
-- todo acesso passa pelo staff autenticado dentro da IDP.
insert into storage.buckets (id, name, public)
values ('documentos-clientes', 'documentos-clientes', false)
on conflict (id) do nothing;

drop policy if exists "Autenticados leem arquivos de documentos" on storage.objects;
create policy "Autenticados leem arquivos de documentos"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'documentos-clientes');

drop policy if exists "Autenticados enviam arquivos de documentos" on storage.objects;
create policy "Autenticados enviam arquivos de documentos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'documentos-clientes');

drop policy if exists "Autenticados atualizam arquivos de documentos" on storage.objects;
create policy "Autenticados atualizam arquivos de documentos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'documentos-clientes')
  with check (bucket_id = 'documentos-clientes');

drop policy if exists "Autenticados removem arquivos de documentos" on storage.objects;
create policy "Autenticados removem arquivos de documentos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'documentos-clientes');
