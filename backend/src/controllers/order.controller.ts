import type { Request, Response } from "express";
import { orderService } from "../services/order.service.js";

function getParam(value: unknown) {
  if (Array.isArray(value)) return value[0];
  if (typeof value === "string") return value;
  return "";
}

export const orderController = {
  async list(req: Request, res: Response) {
    return res.json(await orderService.listOrders(req.user!.id, req.user!.role));
  },

  async getOne(req: Request, res: Response) {
    const id = getParam((req.params as Record<string, unknown>).id);
    return res.json(await orderService.getOrder(req.user!.id, req.user!.role, id));
  },

  async create(req: Request, res: Response) {
    return res.status(201).json(await orderService.createOrder(req.user!.id, req.body));
  },

  async updateStatus(req: Request, res: Response) {
    const id = getParam((req.params as Record<string, unknown>).id);
    return res.json(await orderService.updateStatus(id, req.body));
  },
};
