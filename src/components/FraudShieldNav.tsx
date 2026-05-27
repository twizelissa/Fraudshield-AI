"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Terminal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/check", label: "Scanner console" },
  { href: "/about", label: "Threat intelligence" },
  { href: "/report", label: "Submit threat" },
];

export default function FraudShieldNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-5xl rounded-2xl border border-blue-brand/15 bg-navy/70 backdrop-blur-md shadow-2xl shadow-black/80 px-4 py-1 animate-fade-in transition-all">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo with holographic flicker */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-blue-brand/10 text-blue-brand border border-blue-brand/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.1)] group-hover:border-violet-brand/50 group-hover:text-violet-brand transition-all">
            <Terminal className="h-4.5 w-4.5 animate-flicker" />
          </div>
          <span className="text-lg font-bold tracking-wider text-white uppercase flex items-center">
            FraudShield <span className="text-gradient-neon font-black ml-1.5 tracking-widest text-sm uppercase">Console</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer",
                  isActive
                    ? "text-blue-brand bg-blue-brand/5 border border-blue-brand/10 shadow-[0_0_10px_rgba(0,242,254,0.05)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[1.5px] rounded-full bg-blue-brand shadow-[0_0_8px_#00f2fe]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/check"
            className="btn-cyber px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Launch Scanner
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-blue-brand/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-blue-brand/10 bg-navy/95 px-4 pb-6 pt-3 rounded-b-2xl animate-scale-in">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all",
                    isActive
                      ? "bg-blue-brand/10 text-blue-brand border border-blue-brand/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/check"
              onClick={() => setMobileOpen(false)}
              className="btn-cyber mt-4 px-4 py-3.5 rounded-xl text-xs font-black text-center uppercase tracking-widest shadow-md cursor-pointer"
            >
              Launch Scanner
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
