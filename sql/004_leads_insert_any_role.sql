-- Corrige o INSERT de leads pra funcionar independente de haver ou não
-- uma sessão logada no mesmo navegador (ex: alguém testando o Cadastro
-- enquanto está logado no /admin). A policy antiga (001) só cobria a
-- role "anon"; "public" cobre anon + authenticated.
-- Rodar no SQL Editor do Supabase.

drop policy if exists "Qualquer um pode criar lead" on public.leads;

create policy "Qualquer um pode criar lead"
  on public.leads
  for insert
  to public
  with check (true);
