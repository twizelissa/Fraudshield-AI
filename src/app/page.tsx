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
  LockKeyhole,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FraudShield AI — Cybersecurity & Scam Prevention",
  description:
    "Check suspicious messages before you trust them. Detect fake jobs, scholarships, grants, and phishing messages instantly.",
};

const scamTypes = [
  {
    icon: Briefcase,
    label: "Fake Jobs",
    desc: "Remote work offers requiring upfront fees for training or equipment.",
    iconColor: "text-blue-brand bg-blue-brand/10 border-blue-brand/25 shadow-[0_0_15px_rgba(0,242,254,0.05)]",
  },
  {
    icon: GraduationCap,
    label: "Scholarships",
    desc: "Educational offers asking for processing fees or personal bank data.",
    iconColor: "text-violet-brand bg-violet-brand/10 border-violet-brand/25 shadow-[0_0_15px_rgba(217,70,239,0.05)]",
  },
  {
    icon: Link2Off,
    label: "Phishing Links",
    desc: "Deceptive URLs designed to steal login credentials or identity info.",
    iconColor: "text-blue-brand bg-blue-brand/10 border-blue-brand/25 shadow-[0_0_15px_rgba(0,242,254,0.05)]",
  },
  {
    icon: Building2,
    label: "Fake Grants",
    desc: "Suspicious government or NGO grant offers that demand 'securing fees'.",
    iconColor: "text-violet-brand bg-violet-brand/10 border-violet-brand/25 shadow-[0_0_15px_rgba(217,70,239,0.05)]",
  },
  {
    icon: DollarSign,
    label: "Investment Scams",
    desc: "Cryptocurrency or financial schemes promising unrealistic daily returns.",
    iconColor: "text-blue-brand bg-blue-brand/10 border-blue-brand/25 shadow-[0_0_15px_rgba(0,242,254,0.05)]",
  },
  {
    icon: FileWarning,
    label: "Suspicious SMS",
    desc: "Urgent WhatsApp or SMS messages from unknown international numbers.",
    iconColor: "text-violet-brand bg-violet-brand/10 border-violet-brand/25 shadow-[0_0_15px_rgba(217,70,239,0.05)]",
  },
];

const steps = [
  {
    num: "01",
    icon: SearchCheck,
    title: "Check the Message",
    desc: "Copy any suspicious email, SMS, or job post and paste it into our secure scanner.",
  },
  {
    num: "02",
    icon: Eye,
    title: "Detailed Analysis",
    desc: "We analyze the content for common scam indicators, urgency pressure, and fake promises.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Stay Protected",
    desc: "Receive a professional risk assessment and clear instructions on how to proceed safely.",
  },
];

const stats = [
  { value: "Verified", label: "Scam patterns" },
  { value: "Private", label: "Safe analysis" },
  { value: "Free", label: "Public service" },
  { value: "24/7", label: "Always available" },
];

export default function HomePage() {
  return (
    <div className="hero-bg min-h-screen cyber-grid pt-12 pb-16">
      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-20 text-center max-w-4xl mx-auto z-10 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-brand/25 bg-blue-brand/5 px-4 py-1.5 text-[10px] font-bold text-blue-brand uppercase tracking-[0.2em] mb-8 shadow-[0_0_15px_rgba(0,242,254,0.1)]">
          <LockKeyhole className="h-3.5 w-3.5 text-blue-brand animate-flicker" />
          Professional Cyber Safety Terminal
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-wider leading-[1.05] text-center uppercase">
          Protect yourself from
          <br />
          <span className="text-gradient-neon font-black tracking-widest">online scams</span>
          <span className="text-blue-brand animate-pulse">.</span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-12 font-medium">
          Check suspicious messages before you trust them. Detect fake jobs, scholarships, grants, and phishing attempts instantly before sharing money or personal credentials.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/check"
            className="w-full sm:w-auto px-8 py-4 rounded-xl btn-cyber text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            Launch Scanner console
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-navy/80 hover:bg-white/5 text-white border border-blue-brand/15 text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-200 text-center cursor-pointer"
          >
            Threat intelligence
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-8 border-y border-blue-brand/10 bg-navy/40 backdrop-blur-md relative z-10 animate-scale-in">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-wider uppercase font-mono">{stat.value}</div>
                <div className="text-[9px] font-bold text-blue-brand/60 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-24 mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-widest uppercase">Comprehensive Threat Detection</h2>
          <p className="text-slate-400 max-w-md mx-auto font-medium text-xs sm:text-sm leading-relaxed">
            Our system is designed to identify suspicious patterns across multiple digital platforms and offer types.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scamTypes.map((type) => (
            <div
              key={type.label}
              className="glass-card p-6 rounded-2xl border border-blue-brand/10 bg-navy/60 backdrop-blur shadow-lg hover-lift transition-all duration-300 cursor-pointer"
            >
              <div className={`p-3 rounded-xl w-fit mb-5 border ${type.iconColor}`}>
                <type.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 tracking-wider uppercase">{type.label}</h3>
              <p className="text-slate-400 leading-relaxed text-xs sm:text-sm font-medium">
                {type.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-24 dark-mesh-bg text-white overflow-hidden relative border-y border-blue-brand/10 shadow-2xl">
        <div className="mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest mb-4 uppercase">Your safety workflow</h2>
            <p className="text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">Simple steps to verify information before you take risk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, idx) => (
              <div key={step.title} className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-brand/5 border border-blue-brand/15 text-blue-brand shadow-[0_0_15px_rgba(0,242,254,0.05)]">
                  <step.icon className="h-5 w-5 animate-pulse" />
                </div>
                <div className="text-violet-brand font-bold mb-2 tracking-widest text-[9px] uppercase font-mono">Step {step.num}</div>
                <h3 className="text-lg font-bold mb-3 tracking-wider uppercase">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-xs sm:text-sm font-medium">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-16 w-[calc(100%-35px)] h-[1px] bg-blue-brand/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="px-6 py-24 relative z-10">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-navy to-[#08122a] p-10 text-center text-white relative overflow-hidden shadow-2xl border border-blue-brand/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,242,254,0.1),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-widest leading-tight uppercase">
              Protect yourself before sharing money or information
            </h2>
            <p className="text-slate-400 mb-8 text-xs sm:text-sm font-medium leading-relaxed">
              Useful for students, job seekers, small businesses, and NGOs.
            </p>
            <Link
              href="/check"
              className="inline-flex items-center gap-1.5 btn-cyber px-7 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg cursor-pointer"
            >
              Check a message now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
