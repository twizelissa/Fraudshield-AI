"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Loader2,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { ScamAnalysis, MessageType, AnalyzeResponse } from "@/types/fraudshield";
import ScamResultCard from "@/components/ScamResultCard";
import { cn } from "@/lib/utils";

const messageTypes: { value: MessageType | ""; label: string }[] = [
  { value: "", label: "All Categories" },
  { value: "job", label: "Job Offer" },
  { value: "scholarship", label: "Scholarship" },
  { value: "grant", label: "Grant / Award" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS / WhatsApp" },
  { value: "investment", label: "Investment" },
];

const exampleMessages = [
  {
    label: "Scholarship sample",
    text: `Congratulations! You have been selected for a $15,000 international scholarship. To claim your award, please send a registration fee of $200 via Western Union to secure your slot. Act now — only 3 spots remaining! Reply with your full name, ID number, and bank details to: scholarshipoffice247@gmail.com`,
  },
  {
    label: "Job offer sample",
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
      setError("Please enter at least 10 characters.");
      return;
    }
    if (isOverLimit) {
      setError("Message exceeds 10,000 characters.");
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
        setError(data.error ?? "Analysis could not be completed. Please try again.");
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
      setError("Connection failure. Unable to contact scanner engine.");
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
    <div className="min-h-screen bg-[#F8F6F0] py-10 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header - concise, app-like */}
        <div className="mb-6 text-center animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">Scam Scanner</h1>
          <p className="text-black text-xs sm:text-sm font-medium mt-1">
            Paste any message or offer to check for fraud indicators.
          </p>
        </div>

        <div className="card-editorial rounded-2xl p-5 sm:p-7 bg-white border border-[#E5E0D8] shadow-xs animate-scale-in">
          <div className="space-y-5">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as MessageType)}
                  className="w-full appearance-none rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-xs sm:text-sm text-black focus:border-[#0B6A3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6A3B]/10 transition-all font-semibold cursor-pointer"
                >
                  {messageTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-white text-black font-medium">
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              </div>
            </div>

            {/* Message input */}
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className="block text-xs font-bold text-black">
                  Message Content
                </label>
                <div className={cn("text-xs font-bold", isOverLimit ? "text-[#DC2626]" : "text-black")}>
                  {charCount.toLocaleString()} / 10,000
                </div>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste suspicious email, SMS, or job offer here..."
                className="min-h-[180px] w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-3.5 text-black text-xs sm:text-sm placeholder:text-black/50 focus:border-[#0B6A3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6A3B]/10 transition-all leading-relaxed font-sans resize-y font-medium"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-xs text-[#991B1B] shadow-2xs animate-scale-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626] mt-0.5" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Examples quick select */}
            {!text && (
              <div>
                <div className="text-xs font-bold text-black mb-2">
                  Sample messages:
                </div>
                <div className="flex flex-wrap gap-2">
                  {exampleMessages.map((msg) => (
                    <button
                      key={msg.label}
                      onClick={() => setText(msg.text)}
                      className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3 py-1.5 text-xs font-bold text-black hover:bg-white hover:border-[#0B6A3B] transition-all cursor-pointer shadow-2xs"
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
              className="w-full flex items-center justify-center gap-2 rounded-xl btn-pine py-3 text-xs font-bold shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning Message...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Scan Message
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div id="results-section" className="mt-8 scroll-mt-24">
          {result && !loading && (
            <ScamResultCard result={result} onReset={handleReset} />
          )}

          {loading && (
            <div className="card-editorial rounded-2xl border border-[#E5E0D8] bg-white p-10 text-center shadow-xs animate-scale-in">
              <div className="flex justify-center mb-3">
                <Loader2 className="h-8 w-8 text-[#0B6A3B] animate-spin" />
              </div>
              <h3 className="text-sm font-bold text-black mb-1">Scanning for scam patterns...</h3>
              <p className="text-black text-xs font-medium max-w-sm mx-auto">Evaluating payment demands, urgency triggers, and domain legitimacy.</p>
            </div>
          )}
        </div>

        {/* Disclaimer info - concise */}
        <div className="mt-8 text-center text-black font-medium text-xs px-4">
          <p className="max-w-xl mx-auto leading-relaxed">
            Educational tool. Always verify financial or employment requests through official channels.
          </p>
        </div>
      </div>
    </div>
  );
}
