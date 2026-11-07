import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getMessages, markMessageRead, deleteMessage } from "@/lib/content";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getMessages());
}

export async function PUT(req) {
  // Mark read/unread: { id, read }
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, read } = await req.json();
  await markMessageRead(String(id), !!read);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await deleteMessage(String(id));
  return NextResponse.json({ ok: true });
}
