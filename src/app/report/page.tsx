"use client";

import { useState } from "react";
import { Flag, CheckCircle, AlertCircle, ChevronDown, Terminal } from "lucide-react";

const scamCategories = [
  "Fake job",
  "Fake scholarship",
  "Fake grant",
  "Phishing",
  "Fake investment",
  "Romance/social scam",
  "Fake delivery/payment scam",
  "General suspicious message",
  "Other",
];

export default function ReportPage() {
  const [form, setForm] = useState({
    reportedMessage: "",
    category: "",
    country: "",
    userEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reportedMessage.trim() || form.reportedMessage.trim().length < 10) {
      setError("Payload content buffer requires at least 10 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/fraudshield/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedMessage: form.reportedMessage.trim(),
          category: form.category || undefined,
          country: form.country.trim() || undefined,
          userEmail: form.userEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Threat submission failed. Please try again.");
        return;
      }
      setSuccess(true);
      setForm({ reportedMessage: "", category: "", country: "", userEmail: "" });
    } catch {
      setError("Console connection error. Unable to dispatch payload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy min-h-screen cyber-grid px-4 py-20">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-[9px] font-bold text-red-400 mb-5 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(244,63,94,0.05)]">
            <Terminal className="h-3.5 w-3.5 animate-pulse text-red-500" />
            Threat Dispatcher
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-widest uppercase">
            Submit Threat Payload
          </h1>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed font-medium text-xs sm:text-sm">
            Help improve our analysis engine by contributing verified scam signatures to the decentralized threat database.
          </p>
        </div>

        {success ? (
          <div className="p-10 text-center bg-navy-dark border border-blue-brand/20 rounded-2xl shadow-2xl animate-scale-in">
            <div className="flex justify-center mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-brand/5 text-blue-brand border border-blue-brand/20 shadow-[0_0_15px_rgba(0,242,254,0.05)] animate-pulse">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-widest uppercase font-mono">Payload Transmitted</h2>
            <p className="text-slate-400 mb-6 leading-relaxed font-medium text-xs sm:text-sm">
              Your submission has been cataloged. Threat telemetry helps protect the entire FraudShield console framework.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2.5 rounded-xl btn-cyber text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Submit Another Payload
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card bg-navy-dark/90 rounded-3xl border border-blue-brand/20 p-6 sm:p-8 shadow-2xl space-y-5 animate-scale-in">
            {/* Scam message */}
            <div>
              <label
                htmlFor="reportedMessage"
                className="block text-[9px] font-bold text-blue-brand/70 uppercase tracking-widest mb-2.5 flex items-center gap-1 font-mono"
              >
                <Terminal className="h-3 w-3 animate-flicker" />
                Linguistic Payload Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reportedMessage"
                name="reportedMessage"
                required
                value={form.reportedMessage}
                onChange={handleChange}
                placeholder="Paste suspicious text email headers, body contents, SMS metadata, or phishing URLs here to index..."
                className="w-full rounded-xl border border-blue-brand/15 bg-navy-dark px-4 py-3.5 text-sm text-white placeholder:text-slate-700 focus:border-blue-brand focus:outline-none focus:ring-4 focus:ring-blue-brand/5 transition-all resize-none leading-relaxed saas-input shadow-inner font-mono"
                rows={7}
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-[9px] font-bold text-blue-brand/70 uppercase tracking-widest mb-2.5 flex items-center gap-1 font-mono"
              >
                <Terminal className="h-3 w-3" />
                Indexed Risk Signature
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="saas-input w-full appearance-none rounded-xl border border-blue-brand/15 bg-navy-dark px-4 py-3.5 text-sm text-white focus:border-blue-brand focus:outline-none focus:ring-4 focus:ring-blue-brand/5 transition-all font-semibold shadow-sm cursor-pointer font-mono"
                >
                  <option value="" className="bg-navy-dark text-white">Select Threat Category...</option>
                  {scamCategories.map((cat) => (
                    <option key={cat} value={cat} className="bg-navy-dark text-white font-mono">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-brand/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
              <div>
                <label
                  htmlFor="country"
                  className="block text-[9px] font-bold text-blue-brand/70 uppercase tracking-widest mb-2.5 flex items-center gap-1 font-mono"
                >
                  <Terminal className="h-3 w-3" />
                  Target Geolocation
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="e.g. Kenya, USA, Nigeria"
                  className="saas-input w-full rounded-xl border border-blue-brand/15 bg-navy-dark px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:border-blue-brand focus:outline-none focus:ring-4 focus:ring-blue-brand/5 transition-all shadow-sm font-mono"
                />
              </div>

              <div>
                <label
                  htmlFor="userEmail"
                  className="block text-[9px] font-bold text-blue-brand/70 uppercase tracking-widest mb-2.5 flex items-center gap-1 font-mono"
                >
                  <Terminal className="h-3 w-3" />
                  Operator Contact Email
                </label>
                <input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  value={form.userEmail}
                  onChange={handleChange}
                  placeholder="For official threat follow-up"
                  className="saas-input w-full rounded-xl border border-blue-brand/15 bg-navy-dark px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:border-blue-brand focus:outline-none focus:ring-4 focus:ring-blue-brand/5 transition-all shadow-sm font-mono"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-violet-950/20 border border-violet-950/50 p-3.5 shadow-sm animate-scale-in text-violet-300">
                <AlertCircle className="h-4.5 w-4.5 text-violet-brand shrink-0 mt-0.5" />
                <p className="text-xs font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl btn-cyber py-4 text-xs font-black text-navy shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-200 cursor-pointer uppercase tracking-widest"
            >
              {loading ? (
                "Encrypting Telemetry Payload..."
              ) : (
                <>
                  <Flag className="h-4 w-4" />
                  Finalize Threat Dispatch
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-slate-500 font-medium px-4 leading-normal font-mono">
              All dispatches are indexed securely. Submissions are strictly utilized for cyber intelligence and catalog signature optimization.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
