import { NextResponse } from "next/server";
import { isAuthenticated, changePassword, verifyCredentials } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getContent());
}

export async function PUT(req) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const content = await req.json();
    if (!content || !content.settings || !Array.isArray(content.services)) {
      return NextResponse.json({ error: "Malformed content document." }, { status: 400 });
    }
    await saveContent(content);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
}

export async function PATCH(req) {
  // Change admin password: { currentPassword, newPassword }
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { currentPassword, newPassword } = await req.json();
  if (!(await verifyCredentials("admin", String(currentPassword || "")))) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 403 });
  }
  if (!newPassword || String(newPassword).length < 10) {
    return NextResponse.json({ error: "New password must be at least 10 characters." }, { status: 400 });
  }
  await changePassword(String(newPassword));
  return NextResponse.json({ ok: true });
}
