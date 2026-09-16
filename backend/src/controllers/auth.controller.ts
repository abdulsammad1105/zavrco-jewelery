import type { Request, Response } from "express";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, createSession, destroySession } from "../lib/auth";
import {
  verifyAdminCredentials,
  createAdminSession,
  destroyAdminSession,
} from "../lib/admin-auth";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Please enter your full name" });
    }
    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existing] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, normalizedEmail))
      .limit(1);

    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await hashPassword(password);

    const [user] = await db
      .insert(schema.users)
      .values({ name: name.trim(), email: normalizedEmail, passwordHash })
      .returning({ id: schema.users.id, name: schema.users.name, email: schema.users.email });

    createSession(res, user.id);
    return res.status(201).json({ user });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    createSession(res, user.id);
    return res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function logout(_req: Request, res: Response) {
  destroySession(res);
  return res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  return res.json({ user: req.user ?? null });
}

export async function adminLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let valid: boolean;
    try {
      valid = verifyAdminCredentials(email, password);
    } catch (err) {
      console.error("Admin login misconfigured:", err);
      return res.status(500).json({ error: "Admin login is not configured" });
    }

    if (!valid) {
      return res.status(401).json({ error: "Invalid admin email or password" });
    }

    createAdminSession(res);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

export async function adminLogout(_req: Request, res: Response) {
  destroyAdminSession(res);
  return res.json({ ok: true });
}

export async function adminMe(req: Request, res: Response) {
  return res.json({ isAdmin: !!req.isAdmin });
}
