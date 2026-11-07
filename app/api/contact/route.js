import { NextResponse } from "next/server";
import { addMessage } from "@/lib/content";

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.name || !data.phone) {
      return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
    }
    // Honeypot-style guard: silently drop bot payloads with a website field.
    if (data.website) return NextResponse.json({ ok: true });
    await addMessage({
      name: String(data.name).slice(0, 120),
      phone: String(data.phone).slice(0, 40),
      email: String(data.email || "").slice(0, 120),
      service: String(data.service || "").slice(0, 80),
      city: String(data.city || "").slice(0, 80),
      message: String(data.message || "").slice(0, 2000),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
