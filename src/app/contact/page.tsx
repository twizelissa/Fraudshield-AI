import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Shield, MessageSquare, ArrowRight, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — FraudShield",
  description: "Get in touch with the FraudShield support and security team.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#F8F6F0] min-h-screen px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8 animate-fade-in">

        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Contact
          </h1>
          <p className="text-black text-xs sm:text-sm font-medium">
            Reach our support and scam verification review team.
          </p>
        </div>

        {/* Direct Channels Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-3 shadow-xs">
            <div className="h-9 w-9 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#0B6A3B]">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black">General Support</h3>
              <p className="text-xs text-black/70 font-medium mt-0.5">Questions, feedback, and verification inquiries.</p>
            </div>
            <a
              href="mailto:support@fraudshield.org"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B6A3B] hover:underline pt-1"
            >
              support@fraudshield.org
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] space-y-3 shadow-xs">
            <div className="h-9 w-9 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#0B6A3B]">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black">Threat Dispatches</h3>
              <p className="text-xs text-black/70 font-medium mt-0.5">Report urgent scams or fake payment campaigns.</p>
            </div>
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B6A3B] hover:underline pt-1"
            >
              Submit Scam Report
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* FAQ Quick Note */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-black shrink-0">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black">Have a suspicious message right now?</h4>
              <p className="text-[11px] text-black/70 font-medium">Use the scanner for instant analysis before sending an inquiry.</p>
            </div>
          </div>
          <Link
            href="/check"
            className="btn-pine px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            Open Scanner
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
