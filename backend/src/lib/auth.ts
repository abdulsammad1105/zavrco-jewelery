import crypto from "crypto";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "zavr_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SESSION_SECRET is required in production. Set it in your environment before starting the server.",
      );
    }
    return "zavr-dev-insecure-secret-change-me";
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encodeSession(userId: number): string {
  const payload = JSON.stringify({ userId, exp: Date.now() + SESSION_MAX_AGE * 1000 });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function decodeSession(token: string): { userId: number } | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    if (typeof payload.userId !== "number" || payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createSession(res: Response, userId: number) {
  const token = encodeSession(userId);
  // No explicit `domain` set — the cookie defaults to the exact request host
  // (e.g. "localhost"), which browsers match ignoring port. That lets the
  // frontend (different port, same host) and backend share the session
  // cookie during local development. In production, frontend and backend
  // should share a top-level domain (e.g. zavr.co / api.zavr.co) with an
  // explicit Domain=.zavr.co attribute added here if needed.
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE * 1000,
  });
}

export function destroySession(res: Response) {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export async function getCurrentUser(req: Request) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  const session = decodeSession(token);
  if (!session) return null;

  const [user] = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .limit(1);

  return user ?? null;
}
