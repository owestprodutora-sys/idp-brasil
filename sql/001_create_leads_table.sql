-- Tabela de leads gerados pela Pré-Análise + Cadastro (TASK-005/006)
-- Rodar no SQL Editor do Supabase (Project > SQL Editor > New query)

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  cidade text not null,
  estado text not null,
  aposentado text,
  tributavel text,
  doenca text,
  qual_doenca text,
  laudo text,
  lgpd_aceito boolean not null default false,
  status text not null default 'novo',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Permite que o próprio site (chave anon) insira novos leads
create policy "Qualquer um pode criar lead"
  on public.leads
  for insert
  to anon
  with check (true);

-- Leitura/atualização (painel da Adrieli, TASK-008) fica restrita —
-- ajustar depois pra usar autenticação em vez de liberar pra anon.
