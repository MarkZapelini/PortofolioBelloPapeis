# PRD - Loja B2B de Papéis e Descartáveis

## 1. Visão do Produto

Desenvolver uma plataforma web profissional para venda de papéis descartáveis, dispensers e produtos de limpeza para empresas, comércios, clínicas e hospitais. O sistema deve combinar vitrine moderna, navegação rápida, compra simplificada, gestão de pedidos e painel administrativo.

## 2. Objetivos

- Gerar vendas online com foco B2B.
- Transmitir confiança, agilidade e catálogo profissional.
- Permitir gestão completa de produtos, estoque, pedidos e clientes.
- Manter base preparada para integração com meios de pagamento e cálculo de frete.

## 3. Público-Alvo

- Restaurantes, lanchonetes e cafeterias
- Escritórios e condomínios
- Clínicas, laboratórios e hospitais
- Comércios em geral
- Revendedores e compradores recorrentes

## 4. Catálogo Inicial

- Papel Interfolha
- Papel Toalha
- Papel Higiênico Institucional
- Guardanapos
- Bobinas de Papel
- Lençóis Hospitalares
- Dispensers
- Produtos de Limpeza

## 5. Proposta de Valor

- Compra rápida por categoria e busca
- Produtos com especificações claras e imagens
- Condições para empresas e pedidos recorrentes
- Experiência responsiva em celular, tablet e desktop
- Área do cliente com histórico e acompanhamento

## 6. Escopo Funcional

### 6.1 Frontend público

- Home com hero, ofertas, categorias, destaques e benefícios
- Barra de pesquisa global
- Menu responsivo
- Listagem por categorias
- Página de produto com galeria, descrição, estoque, avaliações e relacionados
- Carrinho de compras
- Favoritos
- Página de contato
- Login e cadastro
- Área do cliente
- Tema claro e escuro

### 6.2 Backend e regras de negócio

- Cadastro e login com JWT
- Senhas criptografadas
- Recuperação de senha por token
- CRUD de produtos
- CRUD de categorias
- CRUD de endereços
- CRUD de avaliações
- Carrinho persistente
- Criação de pedidos
- Histórico e atualização de status
- Controle de estoque
- Suporte a cupom de desconto
- Cálculo base de frete
- Upload de imagens
- Paginação, filtros e busca

### 6.3 Administração

- Dashboard com indicadores
- Gestão de produtos
- Gestão de categorias
- Gestão de pedidos
- Controle de estoque
- Relatórios resumidos
- Visão de clientes cadastrados

## 7. Requisitos de UX/UI

- Visual minimalista
- Base branca com detalhes em azul e verde
- Tipografia limpa
- Cards bem espaçados
- Microanimações suaves
- Ícones profissionais
- Feedback visual para carregamento, erro e sucesso
- Skeleton loading em listagens e detalhes

## 8. Páginas e Áreas

- `/` Home
- `/produtos` Catálogo com filtros
- `/categoria/:slug`
- `/produto/:slug`
- `/carrinho`
- `/favoritos`
- `/login`
- `/cadastro`
- `/recuperar-senha`
- `/conta`
- `/conta/pedidos`
- `/conta/enderecos`
- `/conta/favoritos`
- `/contato`
- `/admin`
- `/admin/produtos`
- `/admin/categorias`
- `/admin/pedidos`
- `/admin/clientes`
- `/admin/relatorios`

## 9. Indicadores de Sucesso

- Tempo de carregamento inicial baixo
- Navegação responsiva sem quebra visual
- Conversão por busca, destaque e categoria
- Redução de abandono de carrinho
- Facilidade de operação no painel administrativo

## 10. Requisitos Não Funcionais

- Frontend com React + Vite
- Backend com Node.js + Express
- Prisma ORM + PostgreSQL
- API REST documentada em Swagger
- Código organizado por domínio e camadas
- Componentes reutilizáveis
- SEO básico nas páginas públicas
- Lazy loading e otimização de assets

## 11. Fora do Escopo Inicial

- Integração ativa com gateway em produção
- ERP ou emissão fiscal
- Multiempresa
- Regras complexas de frete por transportadora

## 12. Entregáveis da Implementação

- Frontend completo
- Backend REST completo
- Schema Prisma com relacionamentos
- Seeds de dados iniciais
- Painel administrativo
- Documentação Swagger
- Arquivos de ambiente de exemplo
- Instruções para rodar localmente
