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
2. `sql/002_add_leads_select_policy.sql` — permite que o Painel Adrieli (`/admin`) leia os leads

⚠️ O `/admin` ainda não tem autenticação (ver aviso de segurança no topo do arquivo `002_add_leads_select_policy.sql`) — qualquer pessoa com o link consegue ver os leads. Adicionar login antes de divulgar a rota em produção.

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
