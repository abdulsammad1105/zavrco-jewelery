"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.createSession = createSession;
exports.destroySession = destroySession;
exports.getCurrentUser = getCurrentUser;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const SESSION_COOKIE = "zavr_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds
function getSecret() {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("SESSION_SECRET is required in production. Set it in your environment before starting the server.");
        }
        return "zavr-dev-insecure-secret-change-me";
    }
    return secret;
}
function sign(payload) {
    return crypto_1.default
        .createHmac("sha256", getSecret())
        .update(payload)
        .digest("base64url");
}
function encodeSession(userId) {
    const payload = JSON.stringify({
        userId,
        exp: Date.now() + SESSION_MAX_AGE * 1000,
    });
    const encoded = Buffer.from(payload).toString("base64url");
    return `${encoded}.${sign(encoded)}`;
}
function decodeSession(token) {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature)
        return null;
    const expected = sign(encoded);
    try {
        if (!crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
            return null;
        }
    }
    catch {
        return null;
    }
    try {
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
        if (typeof payload.userId !== "number" || payload.exp < Date.now())
            return null;
        return { userId: payload.userId };
    }
    catch {
        return null;
    }
}
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 10);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function createSession(res, userId) {
    const token = encodeSession(userId);
    // No explicit `domain` set — the cookie defaults to the exact request host
    // (e.g. "localhost"), which browsers match ignoring port. That lets the
    // frontend (different port, same host) and backend share the session
    // cookie during local development. In production, frontend and backend
    // should share a top-level domain (e.g. zavr.co / api.zavr.co) with an
    // explicit Domain=.zavr.co attribute added here if needed.
    res.cookie(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: SESSION_MAX_AGE * 1000,
    });
}
function destroySession(res) {
    res.clearCookie(SESSION_COOKIE, { path: "/" });
}
async function getCurrentUser(req) {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token)
        return null;
    const session = decodeSession(token);
    if (!session)
        return null;
    const [user] = await db_1.db
        .select({
        id: db_1.schema.users.id,
        name: db_1.schema.users.name,
        email: db_1.schema.users.email,
    })
        .from(db_1.schema.users)
        .where((0, drizzle_orm_1.eq)(db_1.schema.users.id, session.userId))
        .limit(1);
    return user ?? null;
}
