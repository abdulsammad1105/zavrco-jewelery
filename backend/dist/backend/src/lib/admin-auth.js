"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminCredentials = verifyAdminCredentials;
exports.createAdminSession = createAdminSession;
exports.destroyAdminSession = destroyAdminSession;
exports.isAdminSession = isAdminSession;
const crypto_1 = __importDefault(require("crypto"));
const ADMIN_SESSION_COOKIE = "zavr_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds
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
    return crypto_1.default.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}
function encodeAdminSession() {
    const payload = JSON.stringify({ admin: true, exp: Date.now() + ADMIN_SESSION_MAX_AGE * 1000 });
    const encoded = Buffer.from(payload).toString("base64url");
    return `${encoded}.${sign(encoded)}`;
}
function decodeAdminSession(token) {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature)
        return false;
    const expected = sign(encoded);
    try {
        if (!crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
            return false;
        }
    }
    catch {
        return false;
    }
    try {
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
        return payload.admin === true && payload.exp > Date.now();
    }
    catch {
        return false;
    }
}
function safeEqual(a, b) {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length)
        return false;
    return crypto_1.default.timingSafeEqual(bufA, bufB);
}
/** Checks email/password against the single fixed admin credential in env vars. */
function verifyAdminCredentials(email, password) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment to enable admin login.");
    }
    const emailMatches = safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase());
    const passwordMatches = safeEqual(password, adminPassword);
    return emailMatches && passwordMatches;
}
function createAdminSession(res) {
    const token = encodeAdminSession();
    res.cookie(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ADMIN_SESSION_MAX_AGE * 1000,
    });
}
function destroyAdminSession(res) {
    res.clearCookie(ADMIN_SESSION_COOKIE, { path: "/" });
}
function isAdminSession(req) {
    const token = req.cookies?.[ADMIN_SESSION_COOKIE];
    if (!token)
        return false;
    return decodeAdminSession(token);
}
