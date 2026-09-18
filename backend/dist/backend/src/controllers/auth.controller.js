"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.me = me;
exports.adminLogin = adminLogin;
exports.adminLogout = adminLogout;
exports.adminMe = adminMe;
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../lib/auth");
const admin_auth_1 = require("../lib/admin-auth");
async function register(req, res) {
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
        const [existing] = await db_1.db
            .select({ id: db_1.schema.users.id })
            .from(db_1.schema.users)
            .where((0, drizzle_orm_1.eq)(db_1.schema.users.email, normalizedEmail))
            .limit(1);
        if (existing) {
            return res.status(409).json({ error: "An account with this email already exists" });
        }
        const passwordHash = await (0, auth_1.hashPassword)(password);
        const [user] = await db_1.db
            .insert(db_1.schema.users)
            .values({ name: name.trim(), email: normalizedEmail, passwordHash })
            .returning({ id: db_1.schema.users.id, name: db_1.schema.users.name, email: db_1.schema.users.email });
        (0, auth_1.createSession)(res, user.id);
        return res.status(201).json({ user });
    }
    catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const [user] = await db_1.db
            .select()
            .from(db_1.schema.users)
            .where((0, drizzle_orm_1.eq)(db_1.schema.users.email, normalizedEmail))
            .limit(1);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const valid = await (0, auth_1.verifyPassword)(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        (0, auth_1.createSession)(res, user.id);
        return res.json({ user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}
async function logout(_req, res) {
    (0, auth_1.destroySession)(res);
    return res.json({ ok: true });
}
async function me(req, res) {
    return res.json({ user: req.user ?? null });
}
async function adminLogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "Email and password are required" });
        }
        let valid;
        try {
            valid = (0, admin_auth_1.verifyAdminCredentials)(email, password);
        }
        catch (err) {
            console.error("Admin login misconfigured:", err);
            return res.status(500).json({ error: "Admin login is not configured" });
        }
        if (!valid) {
            return res.status(401).json({ error: "Invalid admin email or password" });
        }
        (0, admin_auth_1.createAdminSession)(res);
        return res.json({ ok: true });
    }
    catch (err) {
        console.error("Admin login error:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}
async function adminLogout(_req, res) {
    (0, admin_auth_1.destroyAdminSession)(res);
    return res.json({ ok: true });
}
async function adminMe(req, res) {
    return res.json({ isAdmin: !!req.isAdmin });
}
