import crypto from "crypto";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

import { sbSelect, sbUpsert } from "./db";

const CRED_FILE = path.join(process.cwd(), "data", "admin-credentials.json");
const COOKIE_NAME = "cleannit_admin";
const SESSION_HOURS = 12;

function getSecret() {
  return process.env.ADMIN_SECRET || "cleannit-local-secret-change-in-production";
}

function useDb() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

// Default login on first run: admin / Cleannit2026! — change it in the admin panel.
// Deterministic so serverless cold starts (no DB) agree on the same default.
function defaultCredentials() {
  const salt = crypto.createHash("sha256").update(getSecret()).digest("hex");
  const hash = crypto.scryptSync("Cleannit2026!", salt, 64).toString("hex");
  return { username: "admin", salt, hash };
}

async function readCredentials() {
  if (useDb()) {
    const rows = await sbSelect("admin_credentials", "?id=eq.1&select=username,salt,hash");
    if (rows?.[0]) return rows[0];
    const def = defaultCredentials();
    await sbUpsert("admin_credentials", { id: 1, ...def });
    return def;
  }
  try {
    if (!fs.existsSync(path.dirname(CRED_FILE))) fs.mkdirSync(path.dirname(CRED_FILE), { recursive: true });
    if (!fs.existsSync(CRED_FILE)) fs.writeFileSync(CRED_FILE, JSON.stringify(defaultCredentials(), null, 2));
    return JSON.parse(fs.readFileSync(CRED_FILE, "utf8"));
  } catch {
    // Read-only filesystem (serverless without DB): use the deterministic default.
    return defaultCredentials();
  }
}

async function writeCredentials(cred) {
  if (useDb()) {
    await sbUpsert("admin_credentials", { id: 1, ...cred });
    return;
  }
  try {
    fs.writeFileSync(CRED_FILE, JSON.stringify(cred, null, 2));
  } catch {
    throw new Error("Storage is read-only. Configure Supabase env vars to change the password.");
  }
}

export async function verifyCredentials(username, password) {
  const cred = await readCredentials();
  if (username !== cred.username) return false;
  const hash = crypto.scryptSync(password, cred.salt, 64);
  return crypto.timingSafeEqual(hash, Buffer.from(cred.hash, "hex"));
}

export async function changePassword(newPassword) {
  const cred = await readCredentials();
  const { salt, hash } = hashPassword(newPassword);
  cred.salt = salt;
  cred.hash = hash;
  await writeCredentials(cred);
}

function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken() {
  const payload = JSON.stringify({ role: "admin", exp: Date.now() + SESSION_HOURS * 3600 * 1000 });
  const b64 = Buffer.from(payload).toString("base64url");
  return `${b64}.${sign(b64)}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) return false;
  const [b64, sig] = token.split(".");
  const expected = sign(b64);
  const a = Buffer.from(sig || "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    return payload.role === "admin" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function isAuthenticated() {
  return verifySessionToken(cookies().get(COOKIE_NAME)?.value);
}

export function sessionCookie(token) {
  return { name: COOKIE_NAME, value: token, httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_HOURS * 3600 };
}

export function clearedCookie() {
  return { name: COOKIE_NAME, value: "", httpOnly: true, path: "/", maxAge: 0 };
}
