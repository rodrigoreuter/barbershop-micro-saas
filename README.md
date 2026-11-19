# Barbershop Micro SaaS

Micro SaaS de agendamento para barbearias, feito com Next.js 15, React 19, Tailwind CSS e Prisma (SQLite).

## Funcionalidades
- Página pública por barbearia (`/[slug]`) com fluxo de agendamento (serviços, barbeiro, horário)
- Ticket de agendamento (`/[slug]/booking/[id]`)
- Painel administrativo (`/admin`)
- API REST: barbeiros, barbearias, agendamentos, produtos, serviços
- Webhook/integração com WhatsApp
- UI estilo Apple (glass cards, dynamic island)

## Como rodar
```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Stack
Next.js, React, TypeScript, Tailwind, Prisma, Framer Motion.
