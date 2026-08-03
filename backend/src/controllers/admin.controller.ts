import type { Request, Response } from "express";
import { adminService } from "../services/admin.service.js";

export const adminController = {
  async dashboard(_req: Request, res: Response) {
    return res.json(await adminService.dashboard());
  },

  async salesReport(_req: Request, res: Response) {
    return res.json(await adminService.salesReport());
  },

  async inventoryReport(_req: Request, res: Response) {
    return res.json(await adminService.inventoryReport());
  },
};
