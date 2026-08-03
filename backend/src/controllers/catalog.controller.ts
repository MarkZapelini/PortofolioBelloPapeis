import type { Request, Response } from "express";
import { catalogService } from "../services/catalog.service.js";

function getParam(value: unknown) {
  if (Array.isArray(value)) return value[0];
  if (typeof value === "string") return value;
  return "";
}

export const catalogController = {
  async listCategories(_req: Request, res: Response) {
    return res.json(await catalogService.listCategories());
  },

  async getCategory(req: Request, res: Response) {
    return res.json(await catalogService.getCategoryBySlug(req.params.slug));
  },

  async createCategory(req: Request, res: Response) {
    return res.status(201).json(await catalogService.createCategory(req.body));
  },

  async updateCategory(req: Request, res: Response) {
    return res.json(await catalogService.updateCategory(req.params.id, req.body));
  },

  async deleteCategory(req: Request, res: Response) {
    return res.json(await catalogService.deleteCategory(req.params.id));
  },

  async listProducts(req: Request, res: Response) {
    return res.json(await catalogService.listProducts(req.query as Record<string, unknown>));
  },

  async getProduct(req: Request, res: Response) {
    return res.json(await catalogService.getProduct(req.params.idOrSlug));
  },

  async createProduct(req: Request, res: Response) {
    return res.status(201).json(await catalogService.createProduct(req.body));
  },

  async updateProduct(req: Request, res: Response) {
    const id = getParam((req.params as Record<string, unknown>).id);
    return res.json(await catalogService.updateProduct(id, req.body));
  },

  async deleteProduct(req: Request, res: Response) {
    const id = getParam((req.params as Record<string, unknown>).id);
    return res.json(await catalogService.deleteProduct(id));
  },
};
