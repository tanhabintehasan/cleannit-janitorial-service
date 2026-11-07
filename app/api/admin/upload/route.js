import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") return NextResponse.json({ error: "No file." }, { status: 400 });
    if (!/^image\//.test(file.type)) return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > 15 * 1024 * 1024) return NextResponse.json({ error: "File too large (15MB max)." }, { status: 400 });

    const base = (file.name || "image")
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "image";
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    let name = `${base}.webp`;
    let i = 1;
    while (fs.existsSync(path.join(UPLOAD_DIR, name))) name = `${base}-${i++}.webp`;

    // Auto-convert to WebP and resize to a sane maximum for web delivery.
    await sharp(buffer).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(UPLOAD_DIR, name));

    const src = `/uploads/${name}`;
    // Suggested alt text from the filename (editable in the admin form).
    const alt = base.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return NextResponse.json({ ok: true, src, alt });
  } catch (e) {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
