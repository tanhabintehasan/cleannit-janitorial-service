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

function useDb() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let _sb = null;
async function db() {
  if (!_sb) {
    const { createClient } = await import("@supabase/supabase-js");
    _sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  }
  return _sb;
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

// Default login on first run: admin / Cleannit2026! — change it in the admin panel.
const DEFAULT_CRED = { username: "admin", ...hashPassword("Cleannit2026!") };

async function readCredentials() {
  if (useDb()) {
    const sb = await db();
    const { data } = await sb.from("admin_credentials").select("username,salt,hash").eq("id", 1).maybeSingle();
    if (data) return data;
    await sb.from("admin_credentials").upsert({ id: 1, ...DEFAULT_CRED });
    return DEFAULT_CRED;
  }
  if (!fs.existsSync(path.dirname(CRED_FILE))) fs.mkdirSync(path.dirname(CRED_FILE), { recursive: true });
  if (!fs.existsSync(CRED_FILE)) fs.writeFileSync(CRED_FILE, JSON.stringify(DEFAULT_CRED, null, 2));
  return JSON.parse(fs.readFileSync(CRED_FILE, "utf8"));
}

async function writeCredentials(cred) {
  if (useDb()) {
    const sb = await db();
    await sb.from("admin_credentials").upsert({ id: 1, ...cred });
    return;
  }
  fs.writeFileSync(CRED_FILE, JSON.stringify(cred, null, 2));
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
