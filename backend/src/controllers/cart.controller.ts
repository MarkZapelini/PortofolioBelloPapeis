import type { Request, Response } from "express";
import { cartService } from "../services/cart.service.js";

export const cartController = {
  async getCart(req: Request, res: Response) {
    return res.json(await cartService.getCart(req.user!.id));
  },

  async addItem(req: Request, res: Response) {
    return res.status(201).json(await cartService.addItem(req.user!.id, req.body));
  },

  async updateItem(req: Request, res: Response) {
    return res.json(await cartService.updateItem(req.user!.id, req.params.itemId, req.body));
  },

  async removeItem(req: Request, res: Response) {
    return res.json(await cartService.removeItem(req.user!.id, req.params.itemId));
  },

  async applyCoupon(req: Request, res: Response) {
    return res.json(await cartService.applyCoupon(req.user!.id, req.body));
  },
};
