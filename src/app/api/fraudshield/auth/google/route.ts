import { NextRequest, NextResponse } from "next/server";
import { verifyGoogleAdmin } from "@/lib/google-auth";

export async function POST(req: NextRequest) {
  const { credential } = await req.json().catch(() => ({}));
  const email = await verifyGoogleAdmin(credential);
  if (!email) {
    return NextResponse.json({ success: false, error: "Account not authorized" }, { status: 403 });
  }
  return NextResponse.json({ success: true, email });
}
