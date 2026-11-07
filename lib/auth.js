import crypto from "crypto";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

const CRED_FILE = path.join(process.cwd(), "data", "admin-credentials.json");
const COOKIE_NAME = "cleannit_admin";
const SESSION_HOURS = 12;

function getSecret() {
  return process.env.ADMIN_SECRET || "cleannit-local-secret-change-in-production";
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function ensureCredentials() {
  const dir = path.dirname(CRED_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CRED_FILE)) {
    // Default login: admin / Cleannit2026! — change it in the admin panel after first login.
    const { salt, hash } = hashPassword("Cleannit2026!");
    fs.writeFileSync(CRED_FILE, JSON.stringify({ username: "admin", salt, hash }, null, 2));
  }
}

export function verifyCredentials(username, password) {
  ensureCredentials();
  const cred = JSON.parse(fs.readFileSync(CRED_FILE, "utf8"));
  if (username !== cred.username) return false;
  const hash = crypto.scryptSync(password, cred.salt, 64);
  return crypto.timingSafeEqual(hash, Buffer.from(cred.hash, "hex"));
}

export function changePassword(newPassword) {
  ensureCredentials();
  const cred = JSON.parse(fs.readFileSync(CRED_FILE, "utf8"));
  const { salt, hash } = hashPassword(newPassword);
  cred.salt = salt;
  cred.hash = hash;
  fs.writeFileSync(CRED_FILE, JSON.stringify(cred, null, 2));
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
