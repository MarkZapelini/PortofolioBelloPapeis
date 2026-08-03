# Mayco Papéis

Sistema completo para loja B2B de papéis descartáveis, dispensers e produtos de limpeza, com frontend em React + Vite + Tailwind CSS e backend em Node.js + Express + Prisma + PostgreSQL.

## Stack

- `frontend/`: React, Vite, TypeScript, Tailwind CSS, React Router, Zustand, TanStack Query, Sonner
- `backend/`: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, Bcrypt, Multer, Swagger

## Estrutura do Projeto

```text
.
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src
│       ├── config
│       ├── controllers
│       ├── docs
│       ├── lib
│       ├── middlewares
│       ├── routes
│       ├── services
│       └── utils
├── docs
│   ├── arquitetura.md
│   ├── plano-implementacao.md
│   └── prd.md
├── frontend
│   ├── public
│   └── src
│       ├── app
│       ├── components
│       ├── data
│       ├── pages
│       ├── routes
│       ├── services
│       ├── store
│       └── types
└── package.json
```

## Funcionalidades Entregues

- Home moderna com banner, categorias, produtos em destaque e CTA comercial
- Catálogo com busca visual, filtros, paginação simulada e cards responsivos
- Página de produto com relacionados, favoritos, avaliações e resumo de compra
- Carrinho com quantidade, cupom, frete e resumo do pedido
- Login, cadastro e área do cliente
- Painel administrativo com métricas, cards operacionais e gráficos visuais
- Tema claro e escuro
- Lazy loading de rotas
- Skeleton loading
- SEO básico via `index.html`
- Backend REST com autenticação JWT
- CRUD de produtos e categorias
- Endereços, favoritos, avaliações, carrinho e pedidos
- Dashboard e relatórios administrativos
- Upload de imagens
- Swagger em `/api/docs`
- Prisma schema com relacionamentos completos

## Rotas Principais da API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

### Catálogo

- `GET /api/categories`
- `GET /api/categories/:slug`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/products`
- `GET /api/products/:idOrSlug`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Carrinho e Pedidos

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `POST /api/cart/apply-coupon`
- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`

### Conta

- `GET /api/addresses`
- `POST /api/addresses`
- `PUT /api/addresses/:id`
- `DELETE /api/addresses/:id`
- `GET /api/favorites`
- `POST /api/favorites/:productId`
- `DELETE /api/favorites/:productId`
- `GET /api/reviews/product/:productId`
- `POST /api/reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`

### Administração

- `GET /api/admin/dashboard`
- `GET /api/admin/reports/sales`
- `GET /api/admin/reports/inventory`
- `POST /api/uploads/products`

## Banco de Dados

Entidades principais no Prisma:

- `User`
- `Address`
- `Category`
- `Product`
- `ProductImage`
- `Review`
- `Favorite`
- `Cart`
- `CartItem`
- `Coupon`
- `Order`
- `OrderItem`

## Como Executar Localmente

### 1. Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- npm 10+

### 2. Configurar variáveis de ambiente

No backend:

```bash
cp backend/.env.example backend/.env
```

No frontend:

```bash
cp frontend/.env.example frontend/.env
```

### 3. Instalar dependências

Na raiz:

```bash
npm install
```

Ou por pacote:

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 4. Preparar banco

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Rodar em desenvolvimento

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

### 6. Acessos

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`
- Swagger: `http://localhost:3333/api/docs`

Usuário administrador criado no seed:

- E-mail: `admin@maycopapeis.com.br`
- Senha: `Admin@123`

Usuário cliente criado no seed:

- E-mail: `cliente@empresa.com.br`
- Senha: `Cliente@123`

## Observação de Ambiente

Este workspace está em uma pasta sincronizada no Windows. Durante a execução aqui, a instalação de dependências apresentou erros de escrita em `node_modules`. Se isso se repetir na sua máquina, rode o projeto em um diretório local fora de sincronização, como `C:\dev\mayco-papeis`.

## Próximos Passos Recomendados

- Conectar o frontend aos endpoints reais da API
- Ativar integração de pagamento com credenciais reais
- Substituir upload local por armazenamento em nuvem
- Adicionar testes automatizados de API e interface
