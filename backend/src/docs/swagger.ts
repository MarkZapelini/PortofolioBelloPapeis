import swaggerJSDoc from "swagger-jsdoc";
import { env } from "../config/env.js";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Mayco Papéis API",
      version: "1.0.0",
      description: "API REST para loja B2B de papéis descartáveis, produtos de limpeza e painel administrativo.",
    },
    servers: [
      {
        url: `${env.APP_URL}/api`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/health": {
        get: {
          summary: "Health check",
          responses: {
            "200": {
              description: "API saudável",
            },
          },
        },
      },
      "/auth/login": {
        post: {
          summary: "Realiza login",
          responses: {
            "200": {
              description: "Token JWT emitido",
            },
          },
        },
      },
      "/products": {
        get: {
          summary: "Lista produtos com paginação e filtros",
          responses: {
            "200": {
              description: "Produtos retornados",
            },
          },
        },
        post: {
          summary: "Cria produto",
          responses: {
            "201": {
              description: "Produto criado",
            },
          },
        },
      },
      "/orders": {
        get: {
          summary: "Lista pedidos do usuário autenticado",
          responses: {
            "200": {
              description: "Pedidos retornados",
            },
          },
        },
        post: {
          summary: "Cria pedido a partir do carrinho",
          responses: {
            "201": {
              description: "Pedido criado",
            },
          },
        },
      },
      "/admin/dashboard": {
        get: {
          summary: "Métricas resumidas do dashboard",
          responses: {
            "200": {
              description: "Indicadores retornados",
            },
          },
        },
      },
    },
  },
  apis: [],
});
