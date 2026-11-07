import fs from "fs";
import path from "path";
import { defaultContent } from "./default-content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CONTENT_FILE)) {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(defaultContent, null, 2));
  }
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
  }
}

let cache = { content: null, mtime: 0 };

export function getContent() {
  ensureFiles();
  const mtime = fs.statSync(CONTENT_FILE).mtimeMs;
  if (!cache.content || cache.mtime !== mtime) {
    cache = { content: JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8")), mtime };
  }
  return cache.content;
}

export function saveContent(content) {
  ensureFiles();
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  cache = { content, mtime: fs.statSync(CONTENT_FILE).mtimeMs };
  return content;
}

export function getMessages() {
  ensureFiles();
  return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
}

export function addMessage(msg) {
  const messages = getMessages();
  messages.unshift({ ...msg, id: Date.now().toString(36), date: new Date().toISOString(), read: false });
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  return messages[0];
}

export function saveMessages(messages) {
  ensureFiles();
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

export function getService(slug) {
  return getContent().services.find((s) => s.slug === slug);
}

export function getLocation(slug) {
  return getContent().locations.find((l) => l.slug === slug);
}

export function getPost(slug) {
  return getContent().posts.find((p) => p.slug === slug);
}
