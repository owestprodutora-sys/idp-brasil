# Projeto

Fundação inicial: React + Vite + TypeScript, Tailwind, shadcn/ui, React Router, Lucide Icons e Supabase.

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

Acesse http://localhost:5173

## Supabase

Rode, nessa ordem, no SQL Editor do seu projeto Supabase:
1. `sql/001_create_leads_table.sql` — cria a tabela `leads` e permite que o site insira novos leads
2. `sql/002_add_leads_select_policy.sql` — política de leitura temporária (substituída pela nº 3)
3. `sql/003_leads_select_authenticated_only.sql` — restringe a leitura dos leads a usuários logados
4. `sql/004_leads_insert_any_role.sql` — corrige o INSERT pra funcionar mesmo com uma sessão de admin ativa no mesmo navegador

## Login do Painel (/admin)

O `/admin` exige login (Supabase Auth, e-mail + senha). Não existe cadastro público — o
usuário precisa ser criado manualmente:

1. No Supabase: **Authentication → Users → Add user**
2. Preencha e-mail e senha da Adrieli, marque **Auto Confirm User**
3. Em **Authentication → Providers → Email**, desative **Allow new users to sign up**
   (evita que alguém crie uma conta sozinho usando a chave pública do site)
4. Acesse `/login` no site com esse e-mail/senha

## Deploy na Vercel

1. Suba o projeto pra um repositório no GitHub (`git remote add origin <url>` e `git push`)
2. Importe o repositório na Vercel — o framework Vite é detectado automaticamente (build command `npm run build`, output `dist`)
3. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os mesmos valores do seu `.env` local
4. Deploy. O `vercel.json` já está configurado com o rewrite necessário pra rotas do React Router (`/admin`, `/login` etc.) funcionarem em acesso direto/refresh

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção (roda `tsc -b` + `vite build`)
- `npm run preview` — serve o build de produção localmente
- `npm run lint` — ESLint

## Adicionar novos componentes shadcn/ui

O projeto já tem `components.json` configurado. Com dependências instaladas:

```bash
npx shadcn@latest add <componente>
```

## Estrutura de pastas

```
src/
  components/
    ui/          # componentes gerados pelo shadcn/ui
  pages/         # páginas/telas (uma por rota)
  routes/        # definição das rotas (React Router)
  lib/
    utils.ts     # helper cn() usado pelos componentes shadcn/ui
    supabase.ts  # cliente Supabase
  hooks/         # hooks customizados
  types/         # tipos TypeScript compartilhados
  assets/        # imagens, fontes etc.
```
