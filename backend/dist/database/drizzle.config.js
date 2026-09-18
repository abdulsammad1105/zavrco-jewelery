"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const drizzle_kit_1 = require("drizzle-kit");
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required (set it in backend/.env)");
}
exports.default = (0, drizzle_kit_1.defineConfig)({
    dialect: "postgresql",
    schema: path_1.default.join(__dirname, "schema.ts").split(path_1.default.sep).join("/"),
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});
