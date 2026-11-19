# 💈 Barbershop Micro SaaS

Projeto de demonstração (portfólio): plataforma de agendamento online para barbearias, com visual inspirado em interfaces da Apple.

> **Demo:** _em breve_

## Funcionalidades

- **Página pública por barbearia** (`/[slug]`): escolha de serviços, barbeiro e horário disponível
- **Ticket de agendamento** (`/[slug]/booking/[id]`) com código único
- **Painel administrativo** (`/admin`): visão geral de agendamentos, serviços e produtos
- **Integração com WhatsApp**: confirmação e webhook de mensagens
- **API REST**: barbeiros, barbearias, serviços, produtos e agendamentos
- **UI estilo Apple**: glass cards, dynamic island, animações com Framer Motion

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Prisma · SQLite · Framer Motion

## Como rodar localmente

```bash
npm install
npm run db:push   # cria o banco SQLite
npm run db:seed   # popula com a barbearia de exemplo
npm run dev
```

Acesse `http://localhost:3000` e a barbearia de exemplo em `http://localhost:3000/royal-barber`.

## Estrutura

```
prisma/        schema e seed
src/app/       páginas e rotas de API (App Router)
src/components apple-ui, booking, admin
src/lib/       prisma, utilitários, WhatsApp
```

## Aviso

Projeto de demonstração: não possui autenticação e os dados são fictícios.
