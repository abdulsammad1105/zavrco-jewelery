import type { Request, Response, NextFunction } from "express";
import { getCurrentUser } from "../lib/auth";
import { isAdminSession } from "../lib/admin-auth";

export type AuthedUser = { id: number; name: string; email: string };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthedUser | null;
      isAdmin?: boolean;
    }
  }
}

/** Attaches req.user (customer) and req.isAdmin (fixed admin session). Never blocks. */
export async function attachUser(req: Request, _res: Response, next: NextFunction) {
  req.user = await getCurrentUser(req);
  req.isAdmin = isAdminSession(req);
  next();
}

/** Blocks the request with 401 unless a valid customer session is present. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

/** Blocks the request with 403 unless a valid admin session is present. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
