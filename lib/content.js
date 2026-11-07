import fs from "fs";
import path from "path";
import { cache } from "react";
import { defaultContent } from "./default-content";
import { sbSelect, sbUpsert, sbInsert, sbUpdate, sbDelete } from "./db";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

function useDb() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/* ---------- flat-file fallback helpers ---------- */

let fileWritable = true;

function ensureFiles() {
  if (!fileWritable) return false;
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(CONTENT_FILE)) fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultContent, null, 2));
    if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
    return true;
  } catch {
    // Read-only filesystem (e.g. Vercel serverless without Supabase env vars).
    fileWritable = false;
    return false;
  }
}

/* ---------- content document ---------- */

// React cache(): one DB/file read per request no matter how many components ask.
export const getContent = cache(async () => {
  if (useDb()) {
    const rows = await sbSelect("site_content", "?id=eq.1&select=doc");
    if (rows?.[0]?.doc) return rows[0].doc;
    // First run on a fresh database: seed from the factory default content.
    await sbUpsert("site_content", { id: 1, doc: defaultContent, updated_at: new Date().toISOString() });
    return defaultContent;
  }
  if (ensureFiles()) {
    try {
      return JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
    } catch {
      // fall through to defaults
    }
  }
  return defaultContent;
});

export async function saveContent(content) {
  if (useDb()) {
    await sbUpsert("site_content", { id: 1, doc: content, updated_at: new Date().toISOString() });
    return content;
  }
  if (!ensureFiles()) throw new Error("Storage is read-only. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable editing.");
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  return content;
}

export async function getService(slug) {
  return (await getContent()).services.find((s) => s.slug === slug);
}

export async function getLocation(slug) {
  return (await getContent()).locations.find((l) => l.slug === slug);
}

export async function getPost(slug) {
  return (await getContent()).posts.find((p) => p.slug === slug);
}

/* ---------- contact-form messages inbox ---------- */

export async function getMessages() {
  if (useDb()) {
    const rows = await sbSelect("messages", "?select=*&order=created_at.desc");
    return (rows || []).map((m) => ({ ...m, id: String(m.id), date: m.created_at }));
  }
  if (ensureFiles()) {
    try {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
    } catch {
      // fall through
    }
  }
  return [];
}

export async function addMessage(msg) {
  if (useDb()) {
    const rows = await sbInsert("messages", {
      name: msg.name, phone: msg.phone, email: msg.email || "",
      service: msg.service || "", city: msg.city || "", message: msg.message || "",
    });
    return rows?.[0];
  }
  if (!ensureFiles()) throw new Error("Storage is read-only. Configure Supabase env vars to receive form submissions.");
  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
  const row = { ...msg, id: Date.now().toString(36), date: new Date().toISOString(), read: false };
  messages.unshift(row);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  return row;
}

export async function markMessageRead(id, read) {
  if (useDb()) {
    await sbUpdate("messages", `?id=eq.${Number(id)}`, { read: !!read });
    return;
  }
  if (!ensureFiles()) return;
  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8")).map((m) => (m.id === id ? { ...m, read: !!read } : m));
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

export async function deleteMessage(id) {
  if (useDb()) {
    await sbDelete("messages", `?id=eq.${Number(id)}`);
    return;
  }
  if (!ensureFiles()) return;
  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8")).filter((m) => m.id !== id);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}
