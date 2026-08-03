# Plano de Implementação

## Fase 1 - Base do Projeto

- Criar monorepo simples com `frontend` e `backend`
- Configurar Vite + React + TypeScript + Tailwind
- Configurar Express + TypeScript + Prisma
- Criar arquivos `.env.example`
- Ajustar scripts de desenvolvimento

## Fase 2 - Banco de Dados

- Modelar entidades no Prisma
- Criar relacionamentos
- Gerar migração inicial
- Criar seed com categorias, produtos e usuário admin

## Fase 3 - Backend

- Configurar middlewares globais
- Implementar autenticação JWT
- Implementar módulos de produtos, categorias, carrinho e pedidos
- Implementar favoritos, avaliações, endereços e cupons
- Implementar upload de imagens
- Gerar Swagger

## Fase 4 - Frontend

- Criar layout principal e tema
- Implementar home e catálogo
- Implementar páginas de produto, categoria, carrinho e contato
- Implementar autenticação e área do cliente
- Implementar painel administrativo
- Integrar frontend com API

## Fase 5 - Qualidade

- Testar fluxos principais
- Validar build frontend
- Validar geração Prisma
- Revisar responsividade
- Revisar acessibilidade básica

## Fase 6 - Entrega

- Consolidar README
- Descrever estrutura final
- Documentar como executar localmente

## Premissas

- Autenticação por JWT stateless
- Upload local em desenvolvimento
- Pagamento apenas preparado por serviço, sem credenciais reais
- Frete inicial com cálculo simplificado

## Riscos e Pontos de Atenção

- Escopo amplo para uma entrega única
- Integrações reais com gateways exigem credenciais e webhooks
- Relatórios serão entregues em formato operacional, não BI avançado
