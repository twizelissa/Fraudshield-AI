export interface GoogleUser {
  email: string;
  name: string | null;
  exp: number;
}

export const USER_COOKIE = "fs_user";

// Verifies a Google ID token issued for this app's client ID.
export async function verifyGoogleToken(idToken: string): Promise<GoogleUser | null> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId || !idToken) return null;

  try {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );
    if (!res.ok) return null;
    const info = await res.json();
    const verified = info.email_verified === true || info.email_verified === "true";
    if (info.aud !== clientId || !verified || !info.email) return null;
    return {
      email: String(info.email).toLowerCase(),
      name: info.name ?? null,
      exp: Number(info.exp) || 0,
    };
  } catch {
    return null;
  }
}

// Same as above, but the account must be listed in ADMIN_EMAILS.
export async function verifyGoogleAdmin(idToken: string): Promise<string | null> {
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const user = await verifyGoogleToken(idToken);
  return user && allowed.includes(user.email) ? user.email : null;
}
