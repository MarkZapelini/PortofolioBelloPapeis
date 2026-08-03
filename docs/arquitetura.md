# Arquitetura Técnica - Loja B2B de Papéis

## 1. Stack

### Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- React Hook Form + Zod
- Axios
- Lucide React
- Framer Motion
- Sonner

### Backend

- Node.js 20+
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Multer
- Swagger UI Express
- Zod
- CORS
- Helmet
- Morgan

## 2. Arquitetura Geral

Monorepo simples com duas aplicações:

- `frontend/`: SPA pública + área autenticada + painel admin
- `backend/`: API REST, autenticação, regras de negócio, uploads e documentação Swagger

Comunicação via API REST JSON com autenticação Bearer JWT.

## 3. Estrutura de Pastas Planejada

```text
.
├── docs/
├── frontend/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── product/
│       │   ├── cart/
│       │   └── admin/
│       ├── features/
│       │   ├── auth/
│       │   ├── products/
│       │   ├── cart/
│       │   ├── orders/
│       │   ├── favorites/
│       │   └── admin/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── store/
│       ├── styles/
│       ├── types/
│       └── utils/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── repositories/
│       ├── validators/
│       ├── utils/
│       ├── docs/
│       └── server.ts
└── README.md
```

## 4. Banco de Dados

### Tabelas

- `users`
- `addresses`
- `categories`
- `products`
- `product_images`
- `reviews`
- `favorites`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `coupons`

### Relacionamentos

- Usuário possui vários endereços
- Usuário possui um carrinho ativo
- Usuário possui vários pedidos
- Usuário possui vários favoritos
- Usuário pode avaliar vários produtos
- Categoria possui vários produtos
- Produto possui várias imagens
- Produto possui várias avaliações
- Pedido pertence a um usuário e um endereço
- Pedido possui vários itens
- Carrinho possui vários itens

## 5. Campos Principais por Entidade

### Users

- `id`, `name`, `email`, `phone`, `passwordHash`, `role`, `isActive`, `createdAt`, `updatedAt`

### Categories

- `id`, `name`, `slug`, `description`, `imageUrl`, `isActive`

### Products

- `id`, `name`, `slug`, `description`, `sku`, `price`, `compareAtPrice`, `stock`, `brand`, `unit`, `weight`, `isFeatured`, `isActive`, `categoryId`

### Orders

- `id`, `code`, `status`, `subtotal`, `discount`, `shippingCost`, `total`, `paymentMethod`, `paymentStatus`, `notes`, `userId`, `addressId`

### Coupons

- `id`, `code`, `type`, `value`, `minOrderValue`, `expiresAt`, `isActive`

## 6. API REST Planejada

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`

### Produtos

- `GET /api/products`
- `GET /api/products/:idOrSlug`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Categorias

- `GET /api/categories`
- `GET /api/categories/:slug`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Carrinho

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `POST /api/cart/apply-coupon`

### Pedidos

- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`

### Favoritos

- `GET /api/favorites`
- `POST /api/favorites/:productId`
- `DELETE /api/favorites/:productId`

### Avaliações

- `GET /api/reviews/product/:productId`
- `POST /api/reviews`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`

### Endereços

- `GET /api/addresses`
- `POST /api/addresses`
- `PUT /api/addresses/:id`
- `DELETE /api/addresses/:id`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/reports/sales`
- `GET /api/admin/reports/inventory`

### Upload

- `POST /api/uploads/products`

## 7. Regras Técnicas

- MVC no backend com camadas `routes -> controllers -> services -> repositories`
- Validação de entrada com Zod
- Prisma para acesso a dados
- JWT com `access token`
- Senhas com Bcrypt
- Controle de acesso por `role` (`CUSTOMER`, `ADMIN`)
- Upload local preparado para futura troca por S3
- Paginação baseada em `page` e `limit`
- Busca por `q`
- Filtros por categoria, faixa de preço, estoque e destaque

## 8. Frontend

### Seções da Home

- Header com busca e ações rápidas
- Hero com ofertas
- Bloco de categorias
- Grade de produtos em destaque
- Benefícios comerciais
- Depoimentos e avaliações
- CTA para contato e pedidos recorrentes
- Footer institucional

### Estados de UI

- Loading global
- Skeleton de cards e páginas
- Empty states
- Toasts de feedback
- Tema claro e escuro persistido

## 9. SEO e Performance

- Meta tags por página
- Open Graph básico
- `loading="lazy"` para imagens
- Divisão de rotas com lazy loading
- Queries cacheadas com TanStack Query
- Componentes e imagens otimizados

## 10. Integrações Preparadas

- Stripe: camada de serviço isolada
- Mercado Pago: camada de serviço isolada
- Frete: serviço interno com cálculo base por peso/valor

## 11. Segurança

- Helmet
- CORS configurável
- Sanitização e validação de entrada
- Hash de senha
- Verificação de permissões
- Rotas protegidas no frontend e backend

## 12. Documentação

- Swagger em `/api/docs`
- `README.md` com setup local
- `.env.example` para frontend e backend
