import {
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Building2,
  Smartphone,
  Info,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FraudShield AI — Why Scam Detection Matters",
  description:
    "Learn why online scam detection matters, who FraudShield AI helps, and how our AI-powered tool works to keep you safe.",
};

const targetUsers = [
  {
    icon: GraduationCap,
    title: "Students",
    desc: "Applying for scholarships, internships, or educational grants online — where fake offers are rampant.",
    color: "text-violet-brand bg-violet-brand/5 border-violet-brand/25 shadow-[0_0_15px_rgba(217,70,239,0.05)]",
  },
  {
    icon: Briefcase,
    title: "Job Seekers",
    desc: "Searching for remote work opportunities, where fake job offers frequently request upfront fees.",
    color: "text-blue-brand bg-blue-brand/5 border-blue-brand/25 shadow-[0_0_15px_rgba(0,242,254,0.05)]",
  },
  {
    icon: Building2,
    title: "Small Business Owners",
    desc: "Receiving unsolicited grant offers, investment proposals, or suspicious partnership requests.",
    color: "text-violet-brand bg-violet-brand/5 border-violet-brand/25 shadow-[0_0_15px_rgba(217,70,239,0.05)]",
  },
  {
    icon: Smartphone,
    title: "General Users",
    desc: "Anyone who receives suspicious WhatsApp, SMS, email, or social media messages asking for money or data.",
    color: "text-blue-brand bg-blue-brand/5 border-blue-brand/25 shadow-[0_0_15px_rgba(0,242,254,0.05)]",
  },
];

const howItWorks = [
  {
    label: "Payment Requests",
    desc: "Detecting fees, deposits, registration payments, or processing charges that legitimate opportunities never require upfront.",
  },
  {
    label: "Data Harvesting",
    desc: "Identifying requests for passwords, OTPs, bank details, ID numbers, or passport information.",
  },
  {
    label: "Urgency & Pressure",
    desc: "Recognizing language like 'today only', 'act now', 'limited slots', designed to prevent you from thinking clearly.",
  },
  {
    label: "Unrealistic Promises",
    desc: "Spotting guaranteed jobs, instant scholarships, large prizes, or impossibly high returns.",
  },
  {
    label: "Suspicious Identity",
    desc: "Flagging unofficial email domains, unclear organization names, shortened links, and unverifiable contacts.",
  },
  {
    label: "Language Patterns",
    desc: "Analyzing poor grammar, generic greetings, and lack of specific verifiable details common in mass scam messages.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-navy min-h-screen cyber-grid px-4 py-20">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-brand/25 bg-blue-brand/5 px-4 py-1.5 text-[9px] font-bold text-blue-brand mb-8 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,242,254,0.1)]">
            Threat Intelligence Module
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-widest uppercase">
            Building trust through
            <br />
            <span className="text-gradient-neon font-black tracking-widest">digital intelligence.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-3xl mx-auto font-medium">
            Online fraud compromises lives, careers, and financial stability. FraudShield AI provides institutional-grade analytical tools to identify communication risks before they become security breaches.
          </p>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 animate-scale-in">
          {[
            { stat: "$10B+", label: "Global Annual Loss", desc: "Reported losses to cyber-enabled fraud and scams." },
            { stat: "3 in 5", label: "Demographic Risk", desc: "Victims frequently fall within the 18-40 age bracket." },
            { stat: "90%", label: "Delivery Channels", desc: "Attacks initiated via WhatsApp, Email, or SMS platforms." },
          ].map((item) => (
            <div
              key={item.label}
              className="glass-card p-8 rounded-2xl border border-blue-brand/10 bg-navy/60 backdrop-blur shadow-lg hover-lift transition-all text-center"
            >
              <div className="text-3xl font-bold text-white mb-1 tracking-wider uppercase font-mono">{item.stat}</div>
              <div className="text-[9px] font-bold text-blue-brand uppercase tracking-widest mb-3">{item.label}</div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-24 animate-scale-in">
            {/* The problem */}
            <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-3 tracking-wider uppercase">
                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/25 shadow-[0_0_15px_rgba(244,63,94,0.05)]">
                        <AlertTriangle className="h-5 w-5 animate-pulse" />
                    </div>
                    The Security Crisis
                </h2>
                <div className="space-y-4 text-slate-400 leading-relaxed font-medium text-xs sm:text-sm">
                    <p>
                        Digital attackers use sophisticated social engineering to exploit trust and urgency. From fake job listings to fraudulent education grants, these threats target individuals at their most vulnerable.
                    </p>
                    <p>
                        Current security measures often focus on network protection, leaving the human element—the message recipient—exposed to psychological manipulation.
                    </p>
                </div>
            </div>

            {/* Who it helps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {targetUsers.map((user) => (
                <div
                    key={user.title}
                    className="glass-card p-6 rounded-2xl border border-blue-brand/10 bg-navy/60 backdrop-blur shadow-lg hover-lift transition-all duration-300"
                >
                    <div className={`p-2.5 rounded-xl w-fit mb-4 border ${user.color}`}>
                        <user.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-white mb-2 text-xs sm:text-sm tracking-wider uppercase">{user.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{user.desc}</p>
                </div>
                ))}
            </div>
        </div>

        {/* Analysis Pillars */}
        <div className="mb-24 px-8 py-16 dark-mesh-bg rounded-[2rem] text-white shadow-2xl border border-blue-brand/10 relative overflow-hidden">
            <div className="max-w-3xl mx-auto space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest uppercase">Analytical Methodology</h2>
                    <p className="text-slate-400 font-medium text-xs sm:text-sm">
                        Our intelligence engine evaluates communications across six critical risk dimensions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {howItWorks.map((item, i) => (
                        <div key={item.label} className="group border-b border-white/5 pb-6 hover:border-blue-brand/35 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-[10px] font-bold text-blue-brand font-mono">0{i + 1}</span>
                                <h4 className="font-bold text-white uppercase tracking-widest text-xs group-hover:text-blue-brand transition-colors">{item.label}</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Disclaimer */}
        <div className="p-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 backdrop-blur shadow-sm">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/25">
                <Info className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-amber-500 tracking-wider uppercase">Legal Disclaimer & Usage Advisory</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                FraudShield AI is an intelligence-assisted educational tool. Analysis results represent a risk assessment, not a legal verdict. Users must exercise independent judgment and verify critical transactions through official government or corporate channels. Never share financial credentials or sensory data through unverified digital links.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
