import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import FraudShieldNav from "@/components/FraudShieldNav";
import { ShieldCheck, ArrowRight, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "FraudShield — Scam Detection & Security Verification",
  description:
    "Verify suspicious messages, offers, and links. Detect fraud instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8F6F0] text-black min-h-screen flex flex-col font-sans selection:bg-[#11382B] selection:text-white">
        <FraudShieldNav />
        <main className="flex-1">{children}</main>

        {/* Footer in button color: Pine Green #11382B */}
        <footer className="border-t border-[#0C271E] bg-[#11382B] text-white mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 items-start">

              {/* Brand Column */}
              <div className="md:col-span-5 space-y-3">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="h-9 w-9 rounded-xl bg-white border border-[#E5E0D8] flex items-center justify-center p-1 shadow-sm overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brain_charger_logo.png" alt="FraudShield Logo" className="h-full w-full object-contain" />
                  </div>
                  <span className="text-lg font-extrabold tracking-tight text-white">
                    FraudShield
                  </span>
                </Link>
                <p className="text-xs text-white/90 leading-relaxed max-w-sm font-medium">
                  Real-time scam verification and threat detection.
                </p>
              </div>

              {/* Navigation Links Column */}
              <div className="md:col-span-3 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-white">Navigation</div>
                <ul className="space-y-1.5 text-xs font-medium">
                  <li>
                    <Link href="/" className="text-white/85 hover:text-white transition-colors">Home</Link>
                  </li>
                  <li>
                    <Link href="/check" className="text-white/85 hover:text-white transition-colors">Scanner</Link>
                  </li>
                  <li>
                    <Link href="/threats" className="text-white/85 hover:text-white transition-colors">Threats</Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-white/85 hover:text-white transition-colors">About</Link>
                  </li>
                  <li>
                    <Link href="/report" className="text-white/85 hover:text-white transition-colors">Report</Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-white/85 hover:text-white transition-colors">Contact</Link>
                  </li>
                </ul>
              </div>

              {/* Advisory Card Column */}
              <div className="md:col-span-4">
                <div className="rounded-xl border border-[#166534] bg-[#0C271E]/80 p-4 space-y-2">
                  <div className="text-[#FDE68A] text-xs font-bold uppercase tracking-wider">
                    Safety Tip
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    Legitimate employers, grants, and schools never ask for advance fees or credentials via SMS or WhatsApp.
                  </p>
                  <div className="pt-0.5">
                    <Link
                      href="/check"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#A7F3D0] hover:text-white transition-colors"
                    >
                      Verify offer <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row */}
            <div className="border-t border-[#166534] pt-6 flex items-center justify-between text-xs text-white/80">
              <p>© 2026 FraudShield</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
