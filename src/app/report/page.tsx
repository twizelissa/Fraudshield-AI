"use client";

import { useEffect, useState } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Flag, CheckCircle, AlertCircle, ChevronDown, Terminal, Lock } from "lucide-react";

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
  });
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/fraudshield/auth/user")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => { })
      .finally(() => setAuthChecked(true));
  }, []);

  const handleCredential = async (credential: string) => {
    setError(null);
    const res = await fetch("/api/fraudshield/auth/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (data.success) setUser(data.user);
    else setError(data.error ?? "Google sign-in failed.");
  };

  const handleSignOut = async () => {
    await fetch("/api/fraudshield/auth/user", { method: "DELETE" });
    setUser(null);
  };
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
        }),
      });

      const data = await res.json();
      if (res.status === 401) setUser(null);
      if (!data.success) {
        setError(data.error ?? "Threat submission failed. Please try again.");
        return;
      }
      setSuccess(true);
      setForm({ reportedMessage: "", category: "", country: "" });
    } catch {
      setError("Console connection error. Unable to dispatch payload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F6F0] min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header - concise, app-like */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Report a Scam
          </h1>
          <p className="text-black text-xs sm:text-sm font-medium mt-1">
            Submit suspicious messages to help protect others.
          </p>
        </div>

        {!authChecked ? null : !user ? (
          <div className="card-editorial w-full max-w-sm mx-auto rounded-2xl border border-[#E5E0D8] bg-white p-7 shadow-xs space-y-5 text-center animate-scale-in">
            <Lock className="h-7 w-7 text-[#11382B] mx-auto" />
            <div>
              <h2 className="text-base font-bold text-black">Sign in to report</h2>
              <p className="text-xs text-black mt-1 font-medium">
                Sign in with Google to submit scam messages.
              </p>
            </div>
            <GoogleSignInButton onCredential={handleCredential} text="signup_with" />
            {error && <p className="text-xs text-[#DC2626] font-bold">{error}</p>}
          </div>
        ) : success ? (
          <div className="card-editorial p-8 text-center bg-white border border-[#E5E0D8] rounded-2xl shadow-xs animate-scale-in">
            <div className="flex justify-center mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <h2 className="text-base font-bold text-black mb-1 tracking-tight">Report Submitted</h2>
            <p className="text-black mb-5 leading-relaxed font-medium text-xs">
              Thank you. Your report helps alert other users.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-5 py-2.5 rounded-xl btn-pine text-xs font-bold shadow-xs cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-editorial bg-white rounded-2xl border border-[#E5E0D8] p-5 sm:p-7 shadow-xs space-y-4 animate-scale-in">
            <div className="flex items-center justify-between gap-3 text-xs text-black font-semibold">
              <span className="truncate">Signed in as {user.email}</span>
              <button type="button" onClick={handleSignOut} className="text-[#11382B] font-bold hover:underline cursor-pointer shrink-0">
                Sign out
              </button>
            </div>
            {/* Scam message */}
            <div>
              <label
                htmlFor="reportedMessage"
                className="block text-xs font-bold text-black mb-1.5"
              >
                Message Content <span className="text-[#DC2626]">*</span>
              </label>
              <textarea
                id="reportedMessage"
                name="reportedMessage"
                required
                value={form.reportedMessage}
                onChange={handleChange}
                placeholder="Paste suspicious text email, SMS, or WhatsApp message here..."
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-3 text-xs sm:text-sm text-black placeholder:text-black/50 focus:border-[#11382B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#11382B]/10 transition-all resize-none leading-relaxed font-sans font-medium"
                rows={6}
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-xs font-bold text-black mb-1.5"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-xs sm:text-sm text-black focus:border-[#11382B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#11382B]/10 transition-all font-semibold cursor-pointer"
                >
                  <option value="" className="bg-white text-black font-medium">Select Category...</option>
                  {scamCategories.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-black font-medium">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-xs font-bold text-black mb-1.5"
              >
                Country (optional)
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={form.country}
                onChange={handleChange}
                placeholder="e.g. Kenya, USA, Nigeria"
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-xs sm:text-sm text-black placeholder:text-black/50 focus:border-[#11382B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#11382B]/10 transition-all font-medium"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] p-3 text-xs text-[#991B1B]">
                <AlertCircle className="h-4 w-4 text-[#DC2626] shrink-0 mt-0.5" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl btn-pine py-3 text-xs font-bold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Flag className="h-4 w-4" />
                  Submit Report
                </>
              )}
            </button>

            <p className="text-center text-xs text-black font-medium px-4 leading-normal">
              Reports are verified and shared in the community threat feed.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
