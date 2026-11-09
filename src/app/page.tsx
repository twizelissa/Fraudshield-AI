import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Link2Off,
  DollarSign,
  SearchCheck,
  Building2,
  FileWarning,
  Eye,
  Database,
  Flag,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FraudShield — Scam Detection & Security Verification",
  description: "Verify suspicious messages, offers, and links. Detect fraud instantly.",
};

const appModules = [
  {
    title: "Scanner",
    badge: "Core Tool",
    desc: "Paste messages, emails, or offers to detect scam patterns.",
    href: "/check",
    cta: "Open Scanner",
    icon: SearchCheck,
  },
  {
    title: "Threat Feed",
    badge: "Database",
    desc: "Browse reported scam templates and verified threats.",
    href: "/threats",
    cta: "View Threats",
    icon: Database,
  },
  {
    title: "Report Scam",
    badge: "Dispatch",
    desc: "Submit suspicious messages to help protect others.",
    href: "/report",
    cta: "Report Message",
    icon: Flag,
  },
];

const categories = [
  { icon: Briefcase, label: "Fake Jobs", desc: "Upfront fees and fake remote roles" },
  { icon: GraduationCap, label: "Scholarships", desc: "Advance registration charges" },
  { icon: Link2Off, label: "Phishing", desc: "Credential and password theft links" },
  { icon: Building2, label: "Fake Grants", desc: "Unsolicited fund and fee requests" },
  { icon: DollarSign, label: "Investments", desc: "Unrealistic return schemes" },
  { icon: FileWarning, label: "SMS & Messaging", desc: "Urgent payment and account alerts" },
];

export default function HomePage() {
  return (
    <div className="bg-[#F8F6F0] min-h-screen py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-10 animate-fade-in">

        {/* App Hero Header - concise, minimal words */}
        <div className="text-center max-w-2xl mx-auto pt-8 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight leading-tight">
            Verify messages before you trust.
          </h1>
          <p className="text-black text-xs sm:text-sm font-medium max-w-md mx-auto">
            Detect fake jobs, phishing links, and scam messages instantly.
          </p>

          <div className="flex items-center justify-center gap-2.5 pt-2">
            <Link
              href="/check"
              className="px-5 py-2.5 rounded-xl btn-pine text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              Start Scan
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/threats"
              className="px-5 py-2.5 rounded-xl bg-white text-black border-1.5 border-[#E5E0D8] hover:border-black hover:bg-[#FAF8F5] text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              Threat Feed
            </Link>
          </div>
        </div>

        {/* Main App Modules (3 Compact Cards like inspiration UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-scale-in">
          {appModules.map((mod) => (
            <div
              key={mod.title}
              className="card-editorial p-5 rounded-2xl bg-white border border-[#E5E0D8] hover:border-black flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#11382B]">
                    <mod.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-black">
                    {mod.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-black tracking-tight">{mod.title}</h3>
                  <p className="text-xs text-black font-medium leading-relaxed mt-1">
                    {mod.desc}
                  </p>
                </div>
              </div>

              <Link
                href={mod.href}
                className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#E5E0D8] hover:border-black text-xs font-bold text-black transition-all group"
              >
                <span>{mod.cta}</span>
                <ArrowRight className="h-3.5 w-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Categories Grid - Compact App Grid */}
        <div className="card-editorial p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
            <h2 className="text-sm font-extrabold text-black uppercase tracking-wider">Detection Categories</h2>
            <span className="text-[11px] font-bold text-black">6 Vectors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.label}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] hover:border-black transition-all flex items-start gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#11382B] shrink-0 mt-0.5">
                  <cat.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black">{cat.label}</h4>
                  <p className="text-[11px] text-black font-medium leading-normal mt-0.5">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner - Concise utility prompt */}
        <div className="rounded-2xl bg-[#11382B] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-base font-extrabold tracking-tight">Have a suspicious message right now?</h3>
            <p className="text-xs text-white/90 font-medium">Paste the text into the scanner for instant analysis.</p>
          </div>
          <Link
            href="/check"
            className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-[#FAF8F5] text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            Scan Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
