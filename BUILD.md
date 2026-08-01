# BUILD.md

# IDP Brasil

> Última atualização: 31/07/2026
> Status: Sprint 001
> Fase: MVP Bootstrap
> Arquiteto: ChatGPT
> Desenvolvedor: Claude
> Founder: [Seu Nome]

---

# VISÃO

A IDP Brasil é uma plataforma criada para transformar conhecimento especializado em operações digitais escaláveis.

O objetivo do MVP NÃO é construir um sistema completo.

O objetivo é colocar a primeira operação em produção e gerar os primeiros clientes para a especialista Adrieli Drewlo Dias.

---

# FILOSOFIA

Primeiro faturar.

Depois automatizar.

Depois escalar.

Toda decisão deve respeitar essa ordem.

---

# REGRA MAIS IMPORTANTE

Se uma funcionalidade não ajudar diretamente a:

- gerar clientes;

ou

- economizar tempo operacional;

ela NÃO entra no MVP.

Ela será movida para ROADMAP.md.

---

# STACK (CONGELADA)

## Frontend

- React
- Vite
- TypeScript

## UI

- TailwindCSS
- shadcn/ui

## Backend

- Supabase

## Deploy

- Vercel

## Versionamento

- GitHub

Não alterar a stack sem aprovação.

---

# MVP

O MVP possui apenas cinco funcionalidades.

- Landing
- Pré-Análise
- Cadastro
- Banco de Dados
- Painel Administrativo

Nada além disso.

---

# OBJETIVO DA SPRINT

Conseguir executar o seguinte fluxo.

Visitante

↓

Landing

↓

Pré-Análise

↓

Cadastro

↓

Salvar Lead

↓

Painel Adrieli

↓

Contato via WhatsApp

↓

Cliente

Se esse fluxo funcionar, o MVP estará validado.

---

# BANCO DE DADOS

Tabelas

- users
- leads
- questions
- answers

Não criar novas tabelas sem necessidade.

---

# ROTAS

/

Landing

/pre-analise

/cadastro

/obrigado

/login

/admin

/admin/lead/:id

Não criar novas rotas.

---

# STATUS DO LEAD

Novo

↓

Em Contato

↓

Cliente

↓

Arquivado

Não adicionar novos status.

---

# DESIGN

Prioridades

- simples
- rápido
- responsivo
- limpo

Não adicionar animações desnecessárias.

Não utilizar componentes apenas por estética.

---

# RESPONSIVIDADE

Desktop

Tablet

Mobile

Obrigatória.

---

# CRITÉRIO DE ACEITE

A Sprint termina apenas quando:

✅ Landing publicada

✅ Pré-Análise funcionando

✅ Cadastro funcionando

✅ Lead salvo no Supabase

✅ Lead aparece no painel

✅ Botão WhatsApp funcionando

---

# ROADMAP

Tudo abaixo NÃO faz parte do MVP.

- Área do Cliente
- IA
- Dashboard
- Upload de documentos
- Blog
- Analytics
- Automações
- Marketplace
- Múltiplos especialistas

Esses itens permanecem em ROADMAP.md.

---

# REGRAS PARA O CLAUDE

Antes de iniciar qualquer implementação, verificar:

1. A funcionalidade está neste BUILD.md?

Se NÃO.

Não desenvolver.

2. A funcionalidade aumenta o escopo?

Se SIM.

Parar e solicitar aprovação.

3. A funcionalidade gera receita ou reduz tempo operacional?

Se NÃO.

Mover para ROADMAP.

---

# PADRÃO DE DESENVOLVIMENTO

Toda entrega deve seguir.

TASK

↓

Implementação

↓

Teste

↓

Correção

↓

Commit

↓

Deploy

---

# CHECKLIST DA SPRINT

## Infraestrutura

- [ ] Criar projeto React
- [ ] Configurar Tailwind
- [ ] Configurar shadcn/ui
- [ ] Configurar React Router
- [ ] Configurar Supabase
- [ ] Configurar Vercel

---

## Landing

- [ ] Hero
- [ ] Benefícios
- [ ] Quem pode ter direito
- [ ] Como funciona
- [ ] Especialista
- [ ] FAQ
- [ ] CTA
- [ ] Footer

---

## Pré-Análise

- [ ] Pergunta 1
- [ ] Pergunta 2
- [ ] Pergunta 3
- [ ] Pergunta 4
- [ ] Pergunta 5

---

## Cadastro

- [ ] Formulário
- [ ] LGPD
- [ ] Salvar Lead

---

## Administrativo

- [ ] Login
- [ ] Lista Leads
- [ ] Visualizar Lead
- [ ] Alterar Status

---

## Publicação

- [ ] Testes
- [ ] Deploy

---

# DEFINIÇÃO DE PRONTO

O MVP será considerado pronto quando:

Um usuário acessar a Landing.

↓

Responder à Pré-Análise.

↓

Cadastrar-se.

↓

Os dados forem gravados.

↓

A Adrieli visualizar o Lead.

↓

Conseguir iniciar contato pelo WhatsApp.

Nesse momento encerramos a Sprint 001.

Todo o restante será desenvolvido apenas após os primeiros clientes reais.

---

# LEMA DA IDP

"Construir somente o necessário para conquistar o próximo cliente."
