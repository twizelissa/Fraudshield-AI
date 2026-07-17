"use client";

import { useEffect, useRef } from "react";

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (cfg: { client_id: string; callback: (r: { credential: string }) => void }) => void;
      renderButton: (el: HTMLElement, opts: Record<string, string | number>) => void;
    };
  };
}

const getGoogle = () => (window as unknown as { google?: GoogleIdentity }).google;

export default function GoogleSignInButton({
  onCredential,
  text = "continue_with",
}: {
  onCredential: (credential: string) => void;
  text?: "continue_with" | "signup_with" | "signin_with";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);

  useEffect(() => {
    callback.current = onCredential;
  });

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const init = () => {
      const google = getGoogle();
      if (!google || !ref.current) return;
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (r) => callback.current(r.credential),
      });
      google.accounts.id.renderButton(ref.current, {
        theme: "filled_black",
        size: "large",
        text,
        width: 280,
      });
    };
    if (getGoogle()) return init();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = init;
    document.head.appendChild(script);
  }, [text]);

  if (!GOOGLE_CLIENT_ID) {
    return <p className="text-xs text-slate-500 text-center">Google sign-in is not configured.</p>;
  }
  return <div ref={ref} className="flex justify-center min-h-[44px]" />;
}
