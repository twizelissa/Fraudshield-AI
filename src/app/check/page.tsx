"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Loader2,
  ChevronDown,
  AlertCircle,
  SearchCheck,
  Terminal,
} from "lucide-react";
import { ScamAnalysis, MessageType, AnalyzeResponse } from "@/types/fraudshield";
import ScamResultCard from "@/components/ScamResultCard";
import { cn } from "@/lib/utils";

const messageTypes: { value: MessageType | ""; label: string }[] = [
  { value: "", label: "General Verification Terminal" },
  { value: "job", label: "Job Opportunity Module" },
  { value: "scholarship", label: "Scholarship / Education Module" },
  { value: "grant", label: "Financial Grant / Award Module" },
  { value: "email", label: "Email Threat Content" },
  { value: "sms", label: "SMS / WhatsApp Messaging" },
  { value: "investment", label: "Investment / Asset Opportunity" },
];

const exampleMessages = [
  {
    label: "Verify a scholarship offer",
    text: `Congratulations! You have been selected for a $15,000 international scholarship. To claim your award, please send a registration fee of $200 via Western Union to secure your slot. Act now — only 3 spots remaining! Reply with your full name, ID number, and bank details to: scholarshipoffice247@gmail.com`,
  },
  {
    label: "Verify a job opportunity",
    text: `URGENT HIRING: Remote Data Entry Clerk — Earn $500/day working from home. No experience needed. We will provide training. To start, purchase our starter kit for $150 and we will refund it on your first paycheck. WhatsApp us now: +1-555-0198. Limited positions available TODAY ONLY!`,
  },
];

export default function CheckPage() {
  const [text, setText] = useState("");
  const [selectedType, setSelectedType] = useState<MessageType | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<(ScamAnalysis & { id: string }) | null>(null);

  const charCount = text.length;
  const isOverLimit = charCount > 10000;

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 10) {
      setError("Please input a payload with at least 10 characters.");
      return;
    }
    if (isOverLimit) {
      setError("Payload length exceeds terminal buffer limit of 10,000 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/fraudshield/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText: text.trim(),
          selectedType: selectedType || "unknown",
        }),
      });

      const data: AnalyzeResponse = await res.json();

      if (!data.success || !data.data) {
        setError(data.error ?? "Security analysis could not be completed. Please try again.");
        return;
      }

      setResult(data.data);

      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch {
      setError("Network connection failure. Unable to interface with the core security engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setText("");
    setSelectedType("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-navy cyber-grid py-16 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-brand/25 bg-blue-brand/5 px-4 py-1.5 text-[9px] font-bold text-blue-brand mb-5 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,242,254,0.1)]">
            <SearchCheck className="h-3.5 w-3.5 animate-pulse" />
            Decentralized Threat Scanner
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-widest uppercase">Security Analysis Console</h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Paste the payload of any suspicious message or opportunity below to evaluate digital risk signatures.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-blue-brand/15 bg-navy/60 backdrop-blur shadow-2xl animate-scale-in">
          <div className="space-y-6">
            {/* Type selector */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-blue-brand/70 mb-2.5 flex items-center gap-1">
                <Terminal className="h-3 w-3" />
                Target Analysis Module
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as MessageType)}
                  className="w-full appearance-none rounded-xl border border-blue-brand/15 bg-navy-dark px-4 py-3.5 text-sm text-white focus:border-blue-brand focus:outline-none focus:ring-4 focus:ring-blue-brand/5 transition-all font-semibold saas-input cursor-pointer"
                >
                  {messageTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-navy-dark text-white">
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-brand/50" />
              </div>
            </div>

            {/* Message input */}
            <div>
              <div className="flex justify-between items-end mb-2.5">
                <label className="block text-[9px] font-bold uppercase tracking-widest text-blue-brand/70 flex items-center gap-1">
                  <Terminal className="h-3 w-3 animate-flicker" />
                  Source Code / Payload Buffer
                </label>
                <div className={cn("text-[9px] font-bold tracking-wider uppercase font-mono", isOverLimit ? "text-violet-brand animate-pulse" : "text-blue-brand/50")}>
                  {charCount.toLocaleString()} / 10,000 B
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste suspicious text email contents, SMS messages, or scholarship offer descriptions..."
                className="min-h-[250px] w-full rounded-xl border border-blue-brand/15 bg-navy-dark p-4 text-white text-sm placeholder:text-slate-600 focus:border-blue-brand focus:outline-none focus:ring-4 focus:ring-blue-brand/5 transition-all leading-relaxed saas-input font-mono resize-y"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-violet-950 bg-violet-950/25 p-4 text-xs text-violet-300 shadow-sm animate-scale-in">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-violet-brand mt-0.5" />
                <p className="font-bold uppercase tracking-wider">{error}</p>
              </div>
            )}

            {/* Examples help */}
            {!text && (
              <div className="pt-2">
                <div className="text-[9px] font-bold uppercase tracking-widest text-blue-brand/70 mb-3 flex items-center gap-1">
                  <Terminal className="h-3 w-3" />
                  Select Sample threat payload:
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {exampleMessages.map((msg) => (
                    <button
                      key={msg.label}
                      onClick={() => setText(msg.text)}
                      className="rounded-xl border border-blue-brand/15 bg-navy-dark px-4 py-2.5 text-xs font-semibold text-slate-300 hover:border-blue-brand hover:text-blue-brand hover:bg-blue-brand/5 hover-lift transition-all cursor-pointer shadow-sm uppercase tracking-wider font-mono text-[10px]"
                    >
                      {msg.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim() || isOverLimit}
              className="w-full flex items-center justify-center gap-2 rounded-xl btn-cyber py-4 text-xs font-black text-navy shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer uppercase tracking-widest"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Decrypting Payload...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  Interface Security Engine
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div id="results-section" className="mt-10 scroll-mt-24">
          {result && !loading && (
            <ScamResultCard result={result} onReset={handleReset} />
          )}

          {loading && (
            <div className="glass-card rounded-2xl border border-blue-brand/15 bg-navy/60 p-16 text-center shadow-2xl animate-scale-in relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_95%,rgba(0,242,254,0.05)_95%)] bg-[size:100%_20px] animate-pulse" />
                <div className="flex justify-center mb-5 relative z-10">
                    <Loader2 className="h-10 w-10 text-blue-brand animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-widest uppercase relative z-10">Decompiling signatures</h3>
                <p className="text-slate-400 text-xs sm:text-sm font-medium relative z-10 leading-normal">Our system is decoding the threat payload for social engineering factors, payment requirements, and source domains...</p>
            </div>
          )}
        </div>

        {/* Disclaimer info */}
        <div className="mt-12 text-center text-slate-500 text-xs px-4">
          <p className="max-w-2xl mx-auto leading-relaxed italic">
            FraudShield AI analysis is for educational purposes. We recommend verifying any financial or employment offer through official government channels or verified corporate websites. Never share bank credentials or OTPs.
          </p>
        </div>
      </div>
    </div>
  );
}
