import type { Request, Response } from "express";
import { orderService } from "../services/order.service.js";

export const orderController = {
  async list(req: Request, res: Response) {
    return res.json(await orderService.listOrders(req.user!.id, req.user!.role));
  },

  async getOne(req: Request, res: Response) {
    return res.json(await orderService.getOrder(req.user!.id, req.user!.role, req.params.id));
  },

  async create(req: Request, res: Response) {
    return res.status(201).json(await orderService.createOrder(req.user!.id, req.body));
  },

  async updateStatus(req: Request, res: Response) {
    return res.json(await orderService.updateStatus(req.params.id, req.body));
  },
};
