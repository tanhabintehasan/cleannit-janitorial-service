import { NextResponse } from "next/server";
import { verifyCredentials, createSessionToken, sessionCookie, clearedCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!(await verifyCredentials(String(username || ""), String(password || "")))) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    const c = sessionCookie(createSessionToken());
    res.cookies.set(c.name, c.value, c);
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const c = clearedCookie();
  res.cookies.set(c.name, c.value, c);
  return res;
}
