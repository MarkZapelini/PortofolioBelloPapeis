import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/http.js";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (req: Request) => string;
};

const requests = new Map<string, RateLimitEntry>();

function getClientIp(req: Request) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function cleanupExpiredEntries(now: number) {
  for (const [key, entry] of requests.entries()) {
    if (entry.resetAt <= now) {
      requests.delete(key);
    }
  }
}

export function createRateLimit(options: RateLimitOptions) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const now = Date.now();
    cleanupExpiredEntries(now);

    const scope = options.keyGenerator?.(req) ?? getClientIp(req);
    const key = `${req.path}:${scope}`;
    const current = requests.get(key);

    if (!current || current.resetAt <= now) {
      requests.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      return next();
    }

    if (current.count >= options.max) {
      return next(new AppError(options.message, 429));
    }

    current.count += 1;
    requests.set(key, current);
    return next();
  };
}
