import type { Request, Response } from "express";
import { catalogService } from "../services/catalog.service.js";

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
    return res.json(await catalogService.updateProduct(req.params.id, req.body));
  },

  async deleteProduct(req: Request, res: Response) {
    return res.json(await catalogService.deleteProduct(req.params.id));
  },
};
