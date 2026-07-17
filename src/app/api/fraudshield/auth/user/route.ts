import { NextRequest, NextResponse } from "next/server";
import { USER_COOKIE, verifyGoogleToken } from "@/lib/google-auth";

// Current signed-in user (from cookie), or null.
export async function GET(req: NextRequest) {
  const user = await verifyGoogleToken(req.cookies.get(USER_COOKIE)?.value ?? "");
  return NextResponse.json({ user: user && { email: user.email, name: user.name } });
}

// Sign in / sign up with a Google ID token.
export async function POST(req: NextRequest) {
  const { credential } = await req.json().catch(() => ({}));
  const user = await verifyGoogleToken(credential);
  if (!user) {
    return NextResponse.json({ success: false, error: "Google sign-in failed" }, { status: 401 });
  }
  const res = NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
  res.cookies.set(USER_COOKIE, credential, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.max(60, user.exp - Math.floor(Date.now() / 1000)),
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(USER_COOKIE);
  return res;
}
