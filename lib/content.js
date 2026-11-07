import fs from "fs";
import path from "path";
import { cache } from "react";
import { defaultContent } from "./default-content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

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

/* ---------- flat-file fallback helpers ---------- */

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CONTENT_FILE)) fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultContent, null, 2));
  if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
}

/* ---------- content document ---------- */

// React cache(): one DB/file read per request no matter how many components ask.
export const getContent = cache(async () => {
  if (useDb()) {
    const sb = await db();
    const { data, error } = await sb.from("site_content").select("doc").eq("id", 1).maybeSingle();
    if (error) throw new Error("Supabase read failed: " + error.message);
    if (data?.doc) return data.doc;
    // First run on a fresh database: seed from the factory default content.
    await sb.from("site_content").upsert({ id: 1, doc: defaultContent, updated_at: new Date().toISOString() });
    return defaultContent;
  }
  ensureFiles();
  return JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
});

export async function saveContent(content) {
  if (useDb()) {
    const sb = await db();
    const { error } = await sb.from("site_content").upsert({ id: 1, doc: content, updated_at: new Date().toISOString() });
    if (error) throw new Error("Supabase write failed: " + error.message);
    return content;
  }
  ensureFiles();
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
    const sb = await db();
    const { data, error } = await sb.from("messages").select("*").order("created_at", { ascending: false });
    if (error) throw new Error("Supabase read failed: " + error.message);
    return (data || []).map((m) => ({ ...m, id: String(m.id), date: m.created_at }));
  }
  ensureFiles();
  return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
}

export async function addMessage(msg) {
  if (useDb()) {
    const sb = await db();
    const { data, error } = await sb.from("messages").insert({
      name: msg.name, phone: msg.phone, email: msg.email || "",
      service: msg.service || "", city: msg.city || "", message: msg.message || "",
    }).select().single();
    if (error) throw new Error("Supabase insert failed: " + error.message);
    return data;
  }
  ensureFiles();
  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
  const row = { ...msg, id: Date.now().toString(36), date: new Date().toISOString(), read: false };
  messages.unshift(row);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  return row;
}

export async function markMessageRead(id, read) {
  if (useDb()) {
    const sb = await db();
    const { error } = await sb.from("messages").update({ read: !!read }).eq("id", Number(id));
    if (error) throw new Error("Supabase update failed: " + error.message);
    return;
  }
  ensureFiles();
  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8")).map((m) => (m.id === id ? { ...m, read: !!read } : m));
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

export async function deleteMessage(id) {
  if (useDb()) {
    const sb = await db();
    const { error } = await sb.from("messages").delete().eq("id", Number(id));
    if (error) throw new Error("Supabase delete failed: " + error.message);
    return;
  }
  ensureFiles();
  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8")).filter((m) => m.id !== id);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}
