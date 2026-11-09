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
  title: "About FraudShield — Scam Prevention",
  description: "Learn how FraudShield identifies scam messages, fake jobs, and suspicious offers.",
};

const userGroups = [
  {
    icon: GraduationCap,
    title: "Students",
    desc: "Fake scholarships and grant applications.",
  },
  {
    icon: Briefcase,
    title: "Job Seekers",
    desc: "Remote work offers demanding advance equipment or training fees.",
  },
  {
    icon: Building2,
    title: "Businesses",
    desc: "Unsolicited grant offers and partnership proposals.",
  },
  {
    icon: Smartphone,
    title: "General Public",
    desc: "Urgent SMS, WhatsApp, and email payment demands.",
  },
];

const detectionSignals = [
  { label: "Upfront Fees", desc: "Demands for registration or deposit payments before receiving funds." },
  { label: "Data Harvesting", desc: "Requests for passwords, OTP codes, banking credentials, or ID numbers." },
  { label: "Urgency Pressure", desc: "Phrases like 'limited slots', 'act now', or 'immediate payment'." },
  { label: "Unrealistic Offers", desc: "Guaranteed high income with zero experience required." },
  { label: "Unverified Domains", desc: "Official organizations messaging from free webmail addresses." },
  { label: "Vague Details", desc: "Generic greetings and unverifiable sender identity." },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F8F6F0] min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-10 animate-fade-in">
        {/* Header - concise */}
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            About FraudShield
          </h1>
          <p className="text-black text-xs sm:text-sm font-medium mt-1">
            Fast, reliable detection for digital scams and social engineering attacks.
          </p>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { stat: "$10B+", label: "Annual Global Scam Losses" },
            { stat: "90%", label: "Attacks Delivered via SMS & Email" },
            { stat: "24/7", label: "Instant Security Verification" },
          ].map((item) => (
            <div
              key={item.label}
              className="card-editorial p-4 rounded-xl border border-[#E5E0D8] bg-white text-center shadow-xs"
            >
              <div className="text-2xl font-extrabold text-black tracking-tight">{item.stat}</div>
              <div className="text-xs font-bold text-black mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Who It Protects */}
        <div className="card-editorial p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs">
          <h2 className="text-sm font-extrabold text-black uppercase tracking-wider border-b border-[#E5E0D8] pb-3">
            Who FraudShield Protects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userGroups.map((group) => (
              <div
                key={group.title}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-start gap-3"
              >
                <div className="h-8 w-8 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#11382B] shrink-0 mt-0.5">
                  <group.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-black text-xs">{group.title}</h3>
                  <p className="text-xs text-black font-medium leading-relaxed mt-0.5">{group.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signals */}
        <div className="card-editorial p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs">
          <h2 className="text-sm font-extrabold text-black uppercase tracking-wider border-b border-[#E5E0D8] pb-3">
            What We Check For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {detectionSignals.map((item, i) => (
              <div key={item.label} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="step-number text-[10px] w-5 h-5">{i + 1}</span>
                  <h4 className="font-bold text-black text-xs">{item.label}</h4>
                </div>
                <p className="text-xs text-black font-medium leading-relaxed pl-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl border border-[#FDE68A] bg-[#FEF3C7]/25 text-xs text-black font-medium leading-relaxed flex items-start gap-2.5">
          <Info className="h-4 w-4 text-[#D97706] shrink-0 mt-0.5" />
          <span>
            FraudShield provides risk assessments for educational safety. Always verify financial or employment opportunities directly through verified corporate websites or government registries.
          </span>
        </div>
      </div>
    </div>
  );
}
