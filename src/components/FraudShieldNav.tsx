"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E0D8] bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Clean minimal app brandmark */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="h-8 w-8 rounded-xl bg-[#11382B] flex items-center justify-center shadow-2xs group-hover:bg-[#0C271E] transition-all text-white">
            <ShieldCheck className="h-4.5 w-4.5 text-white" />
          </div>
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
                    ? "text-[#11382B]"
                    : "text-black hover:text-[#11382B]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
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
                      ? "bg-[#11382B] text-white"
                      : "text-black hover:text-[#11382B] hover:bg-[#FAF8F5]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn-pine mt-2 px-4 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              Contact
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
