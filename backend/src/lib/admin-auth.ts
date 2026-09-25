import crypto from "crypto";
import type { Request, Response } from "express";

const ADMIN_SESSION_COOKIE = "zavr_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getCookieDomain(): string | undefined {
  const domain = process.env.COOKIE_DOMAIN?.trim();
  if (domain) return domain;
  if (process.env.VERCEL === "1") return ".vercel.app";
  return undefined;
}

function getCookieOptions(maxAge: number) {
  const domain = getCookieDomain();
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
    maxAge,
    ...(domain ? { domain } : {}),
  };
}

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
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

function encodeAdminSession(): string {
  const payload = JSON.stringify({
    admin: true,
    exp: Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function decodeAdminSession(token: string): boolean {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  try {
    if (
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return false;
    }
  } catch {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
    return payload.admin === true && payload.exp > Date.now();
  } catch {
    return false;
  }
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Checks email/password against the single fixed admin credential in env vars. */
export function verifyAdminCredentials(
  email: string,
  password: string,
): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment to enable admin login.",
    );
  }

  const emailMatches = safeEqual(
    email.trim().toLowerCase(),
    adminEmail.trim().toLowerCase(),
  );
  const passwordMatches = safeEqual(password, adminPassword);
  return emailMatches && passwordMatches;
}

export function createAdminSession(res: Response) {
  const token = encodeAdminSession();
  const options = getCookieOptions(ADMIN_SESSION_MAX_AGE * 1000);
  res.cookie(ADMIN_SESSION_COOKIE, token, options);
}

export function destroyAdminSession(res: Response) {
  const domain = getCookieDomain();
  res.clearCookie(ADMIN_SESSION_COOKIE, { path: "/", ...(domain ? { domain } : {}) });
}

export function isAdminSession(req: Request): boolean {
  const token = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (!token) return false;
  return decodeAdminSession(token);
}
