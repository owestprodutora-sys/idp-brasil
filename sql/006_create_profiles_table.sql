-- TASK-007A — Perfis de usuário (gestor / especialista) e fundação de
-- permissões por função. Rodar no SQL Editor do Supabase, depois de 001 a 005.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null,
  role text not null default 'especialista' check (role in ('gestor', 'especialista')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada usuário só enxerga o próprio perfil — é só isso que o app precisa
-- pra saber qual dashboard mostrar depois do login. Não existe policy de
-- insert/update/delete para o client: perfis são cadastrados manualmente
-- pelo gestor no Supabase Dashboard, igual já era feito pro usuário de
-- login da Adrieli (ver README).
drop policy if exists "Usuário vê o próprio perfil" on public.profiles;

create policy "Usuário vê o próprio perfil"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

-- ⚠️ PASSO MANUAL — depois de rodar este script, cadastre uma linha em
-- `profiles` pra cada usuário que já existe em Authentication > Users
-- (o UUID de cada um fica na coluna "User UID" daquela tela):
--
--   insert into public.profiles (id, nome, email, role) values
--     ('<uuid da Adrieli>', 'Adrieli Drewlo Dias', 'adrieli@exemplo.com', 'especialista'),
--     ('<uuid do Paulo>',   'Paulo',               'paulo@exemplo.com',   'gestor');
--
-- Sem essa linha, o usuário consegue logar mas o painel mostra a mensagem
-- de "perfil não configurado" em vez de um dashboard.

-- Nota sobre a tabela leads: as policies existentes (003 e 005) já
-- liberam select/update pra qualquer usuário autenticado. Isso permanece
-- assim de propósito nesta etapa — hoje só existem contas de staff
-- (gestor e especialista), as duas precisam de acesso operacional aos
-- leads, e nenhum cliente final tem login. Se no futuro outros perfis
-- (ex: cliente) ganharem login, essas policies precisam ser revisadas
-- para não dar acesso indevido a quem não é staff.
