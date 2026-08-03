import { Router } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Role } from "@prisma/client";
import { authController } from "../controllers/auth.controller.js";
import { adminController } from "../controllers/admin.controller.js";
import { accountController } from "../controllers/account.controller.js";
import { cartController } from "../controllers/cart.controller.js";
import { catalogController } from "../controllers/catalog.controller.js";
import { orderController } from "../controllers/order.controller.js";
import { env } from "../config/env.js";
import { ensureAuthenticated, ensureRole } from "../middlewares/auth.js";
import { createRateLimit } from "../middlewares/rate-limit.js";
import { AppError, asyncHandler } from "../utils/http.js";

const uploadDirectory = path.resolve(process.cwd(), "uploads");
const allowedMimeTypes = new Map<string, string>([
  ["jpg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
]);

const loginRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Muitas tentativas de autenticacao. Tente novamente em alguns minutos.",
  keyGenerator: (req) => `${req.ip}:${String(req.body?.email ?? "").toLowerCase()}`,
});

const recoveryRateLimit = createRateLimit({
  windowMs: 30 * 60 * 1000,
  max: 3,
  message: "Muitas tentativas de recuperacao de senha. Aguarde antes de tentar novamente.",
  keyGenerator: (req) => `${req.ip}:${String(req.body?.email ?? "").toLowerCase()}`,
});

function detectImageExtension(buffer: Buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).equals(Buffer.from("RIFF")) &&
    buffer.subarray(8, 12).equals(Buffer.from("WEBP"))
  ) {
    return "webp";
  }

  return null;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new AppError("Envie apenas arquivos de imagem.", 400));
    }

    return callback(null, true);
  },
});

export const router = Router();

function buildUploadUrl(filename: string) {
  return `${env.APP_URL}/uploads/${encodeURIComponent(filename)}`;
}

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.post("/auth/register", loginRateLimit, asyncHandler(authController.register));
router.post("/auth/login", loginRateLimit, asyncHandler(authController.login));
router.post("/auth/forgot-password", recoveryRateLimit, asyncHandler(authController.forgotPassword));
router.post("/auth/reset-password", recoveryRateLimit, asyncHandler(authController.resetPassword));
router.get("/auth/me", ensureAuthenticated, asyncHandler(authController.me));

router.get("/categories", asyncHandler(catalogController.listCategories));
router.get("/categories/:slug", asyncHandler(catalogController.getCategory));
router.post("/categories", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(catalogController.createCategory));
router.put("/categories/:id", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(catalogController.updateCategory));
router.delete("/categories/:id", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(catalogController.deleteCategory));

router.get("/products", asyncHandler(catalogController.listProducts));
router.get("/products/:idOrSlug", asyncHandler(catalogController.getProduct));
router.post("/products", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(catalogController.createProduct));
router.put("/products/:id", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(catalogController.updateProduct));
router.delete("/products/:id", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(catalogController.deleteProduct));

router.get("/cart", ensureAuthenticated, asyncHandler(cartController.getCart));
router.post("/cart/items", ensureAuthenticated, asyncHandler(cartController.addItem));
router.patch("/cart/items/:itemId", ensureAuthenticated, asyncHandler(cartController.updateItem));
router.delete("/cart/items/:itemId", ensureAuthenticated, asyncHandler(cartController.removeItem));
router.post("/cart/apply-coupon", ensureAuthenticated, asyncHandler(cartController.applyCoupon));

router.get("/orders", ensureAuthenticated, asyncHandler(orderController.list));
router.get("/orders/:id", ensureAuthenticated, asyncHandler(orderController.getOne));
router.post("/orders", ensureAuthenticated, asyncHandler(orderController.create));
router.patch("/orders/:id/status", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(orderController.updateStatus));

router.get("/addresses", ensureAuthenticated, asyncHandler(accountController.listAddresses));
router.post("/addresses", ensureAuthenticated, asyncHandler(accountController.createAddress));
router.put("/addresses/:id", ensureAuthenticated, asyncHandler(accountController.updateAddress));
router.delete("/addresses/:id", ensureAuthenticated, asyncHandler(accountController.deleteAddress));

router.get("/favorites", ensureAuthenticated, asyncHandler(accountController.listFavorites));
router.post("/favorites/:productId", ensureAuthenticated, asyncHandler(accountController.toggleFavorite));
router.delete("/favorites/:productId", ensureAuthenticated, asyncHandler(accountController.removeFavorite));

router.get("/reviews/product/:productId", asyncHandler(accountController.listReviews));
router.post("/reviews", ensureAuthenticated, asyncHandler(accountController.createReview));
router.put("/reviews/:id", ensureAuthenticated, asyncHandler(accountController.updateReview));
router.delete("/reviews/:id", ensureAuthenticated, asyncHandler(accountController.deleteReview));

router.post(
  "/uploads/products",
  ensureAuthenticated,
  ensureRole(Role.ADMIN),
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError("Nenhuma imagem foi enviada.", 400);
    }

    const extension = detectImageExtension(req.file.buffer);
    if (!extension) {
      throw new AppError("Envie apenas imagens JPG, PNG ou WEBP válidas.", 400);
    }

    const filename = `${randomUUID()}.${extension}`;
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, filename), req.file.buffer);

    return res.status(201).json({
      message: "Upload realizado com sucesso.",
      file: {
        filename,
        mimeType: allowedMimeTypes.get(extension),
        size: req.file.size,
        url: buildUploadUrl(filename),
      },
    });
  }),
);

router.get("/admin/dashboard", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(adminController.dashboard));
router.get("/admin/reports/sales", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(adminController.salesReport));
router.get("/admin/reports/inventory", ensureAuthenticated, ensureRole(Role.ADMIN), asyncHandler(adminController.inventoryReport));
