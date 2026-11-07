import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getMessages, saveMessages } from "@/lib/content";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getMessages());
}

export async function PUT(req) {
  // Mark read/unread: { id, read }
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, read } = await req.json();
  const messages = getMessages().map((m) => (m.id === id ? { ...m, read: !!read } : m));
  saveMessages(messages);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  saveMessages(getMessages().filter((m) => m.id !== id));
  return NextResponse.json({ ok: true });
}
