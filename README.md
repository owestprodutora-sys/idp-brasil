# Projeto

Fundação inicial: React + Vite + TypeScript, Tailwind, shadcn/ui, React Router, Lucide Icons e Supabase.

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

Acesse http://localhost:5173

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
