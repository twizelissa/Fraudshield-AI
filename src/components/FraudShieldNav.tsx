"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import BrainChargerLogo from "@/components/BrainChargerLogo";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/check", label: "Scanner" },
  { href: "/threats", label: "Threats" },
  { href: "/about", label: "About" },
  { href: "/report", label: "Report" },
];

export default function FraudShieldNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    }).catch(() => {});

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E0D8] bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Clean minimal app brandmark - pure SVG logo, no picture box */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <BrainChargerLogo className="h-7 w-7 text-[#0B6A3B] group-hover:scale-105 transition-transform shrink-0" />
          <span className="text-lg font-extrabold tracking-tight text-black">
            FraudShield
          </span>
        </Link>

        {/* Desktop Nav - Free-standing links without container */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-bold transition-colors cursor-pointer",
                  isActive
                    ? "text-[#0B6A3B]"
                    : "text-black hover:text-[#0B6A3B]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth & CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-black truncate max-w-[120px]">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-bold text-black/70 hover:text-[#0B6A3B] transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-bold text-black hover:text-[#0B6A3B] transition-colors px-2 py-1 cursor-pointer"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-xs font-bold text-[#0B6A3B] hover:underline px-2 py-1 cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link
            href="/contact"
            className="btn-pine px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer group"
          >
            Contact
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-black p-2 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] hover:bg-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E5E0D8] bg-white px-4 pb-6 pt-3 shadow-lg animate-scale-in">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                    isActive
                      ? "bg-[#0B6A3B] text-white"
                      : "text-black hover:text-[#0B6A3B] hover:bg-[#FAF8F5]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#E5E0D8] mt-2 flex flex-col gap-2">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2 bg-[#FAF8F5] rounded-xl text-xs font-bold">
                  <span>{user.email}</span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-[#DC2626] cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#E5E0D8] text-xs font-bold text-center text-black"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#E8F5E9] text-[#0B6A3B] border border-[#A7F3D0] text-xs font-bold text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn-pine mt-1 px-4 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                Contact
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

