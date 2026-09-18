"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachUser = attachUser;
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const auth_1 = require("../lib/auth");
const admin_auth_1 = require("../lib/admin-auth");
/** Attaches req.user (customer) and req.isAdmin (fixed admin session). Never blocks. */
async function attachUser(req, _res, next) {
    req.user = await (0, auth_1.getCurrentUser)(req);
    req.isAdmin = (0, admin_auth_1.isAdminSession)(req);
    next();
}
/** Blocks the request with 401 unless a valid customer session is present. */
function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    next();
}
/** Blocks the request with 403 unless a valid admin session is present. */
function requireAdmin(req, res, next) {
    if (!req.isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
}
