import type { Request, Response } from "express";
import { accountService } from "../services/account.service.js";

export const accountController = {
  async listAddresses(req: Request, res: Response) {
    return res.json(await accountService.listAddresses(req.user!.id));
  },

  async createAddress(req: Request, res: Response) {
    return res.status(201).json(await accountService.createAddress(req.user!.id, req.body));
  },

  async updateAddress(req: Request, res: Response) {
    return res.json(await accountService.updateAddress(req.user!.id, req.params.id, req.body));
  },

  async deleteAddress(req: Request, res: Response) {
    return res.json(await accountService.deleteAddress(req.user!.id, req.params.id));
  },

  async listFavorites(req: Request, res: Response) {
    return res.json(await accountService.listFavorites(req.user!.id));
  },

  async toggleFavorite(req: Request, res: Response) {
    return res.json(await accountService.toggleFavorite(req.user!.id, req.params.productId));
  },

  async removeFavorite(req: Request, res: Response) {
    return res.json(await accountService.removeFavorite(req.user!.id, req.params.productId));
  },

  async listReviews(req: Request, res: Response) {
    return res.json(await accountService.listReviews(req.params.productId));
  },

  async createReview(req: Request, res: Response) {
    return res.status(201).json(await accountService.createReview(req.user!.id, req.body));
  },

  async updateReview(req: Request, res: Response) {
    return res.json(await accountService.updateReview(req.user!.id, req.params.id, req.body));
  },

  async deleteReview(req: Request, res: Response) {
    return res.json(await accountService.deleteReview(req.user!.id, req.params.id));
  },
};
