"use client";

import { useState, useEffect } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import {
  Terminal,
  Activity,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  Copy,
  ShieldAlert,
  Loader2,
  X,
  Check,
  ChevronRight,
  Database,
  Globe,
  Lock,
  Heart,
} from "lucide-react";

interface ScamReport {
  id: string;
  reportedMessage: string;
  category: string | null;
  country: string | null;
  userEmail: string | null;
  createdAt: string;
}

const categories = [
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

export default function AdminPage() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Authentication State — in-memory only, resets on navigation
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminUser, setAdminUser] = useState("");

  const [decryptError, setDecryptError] = useState(false);

  // Upvote / Telemetry state (Stored in LocalStorage)
  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUpvotes = localStorage.getItem("fs-upvoted-ids");
        return savedUpvotes ? JSON.parse(savedUpvotes) : [];
      } catch (e) {
        console.error("Localstorage read failed:", e);
      }
    }
    return [];
  });

  // Drawer / Inspector state
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Stats derived from loaded reports
  const totalSignals = reports.length;
  const categoriesPresent = Array.from(new Set(reports.map(r => r.category).filter(Boolean))).length;
  const countriesPresent = Array.from(new Set(reports.map(r => r.country).filter(Boolean))).length;

  const fetchReports = async (searchVal = "", catVal = "", keyOverride?: string) => {
    setLoading(true);
    setError(null);
    try {
      const activeKey = keyOverride !== undefined ? keyOverride : adminKey;
      if (!activeKey) return; // Do not fetch database reports if unauthenticated!

      const qParams = new URLSearchParams();
      if (searchVal.trim()) qParams.append("q", searchVal.trim());
      if (catVal) qParams.append("category", catVal);
      qParams.append("admin_key", activeKey);

      const headers: Record<string, string> = {
        "x-admin-key": activeKey
      };

      const res = await fetch(`/api/fraudshield/complaints?${qParams.toString()}`, {
        headers
      });
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch threat database");
      }
      setReports(result.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load threat reports. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Mount logic - restore admin session & local upvote lists
  useEffect(() => {
    if (adminKey) {
      const timer = setTimeout(() => {
        fetchReports("", "", adminKey);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Watch for category selection changes
  useEffect(() => {
    if (isAdmin) {
      const timer = setTimeout(() => {
        fetchReports(search, category);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdmin) {
      fetchReports(search, category);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    const res = await fetch("/api/fraudshield/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const result = await res.json();
    if (!result.success) {
      setDecryptError(true);
      setTimeout(() => setDecryptError(false), 2500);
      return;
    }
    setIsAdmin(true);
    setAdminKey(credential);
    setAdminUser(result.email);
    fetchReports("", "", credential);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminKey("");
    setAdminUser("");
    setReports([]);
  };

  // Deterministic stable base upvotes based on report id hash
  const getBaseUpvotes = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash += id.charCodeAt(i);
    }
    return (hash % 24) + 6; // Stable number between 6 and 29
  };

  const handleUpvote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Avoid triggering card details inspection drawer

    let nextUpvotes;
    if (upvotedIds.includes(id)) {
      nextUpvotes = upvotedIds.filter(x => x !== id);
    } else {
      nextUpvotes = [...upvotedIds, id];
    }

    setUpvotedIds(nextUpvotes);
    localStorage.setItem("fs-upvoted-ids", JSON.stringify(nextUpvotes));
  };

  const handleCopyPayload = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1. Sign-in screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center p-4">
        <div className="card-editorial w-full max-w-sm rounded-2xl border border-[#E5E0D8] bg-white p-7 shadow-xs space-y-5 text-center">
          <div className="text-center">
            <Lock className="h-7 w-7 text-[#11382B] mx-auto mb-3" />
            <h2 className="text-lg font-bold text-black">Admin Sign In</h2>
            <p className="text-xs text-black mt-1 font-medium">Access database records.</p>
          </div>

          <GoogleSignInButton onCredential={handleGoogleCredential} />
          {decryptError && (
            <p className="text-xs text-[#DC2626] text-center font-bold">Unauthorized account.</p>
          )}
        </div>
      </div>
    );
  }

  // 2. Admin Screen: App management console
  return (
    <div className="min-h-screen bg-[#F8F6F0] py-10 px-4 relative">
      <div className="mx-auto max-w-5xl relative z-10 animate-fade-in">

        {/* Upper Session Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 border-b border-[#E5E0D8] pb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1 text-xs font-bold text-[#166534]">
            <Activity className="h-3 w-3 text-[#166534]" />
            Admin: {adminUser}
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-white text-black border-1.5 border-[#E5E0D8] hover:border-black hover:bg-[#FAF8F5] text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            Log Out
          </button>
        </div>

        {/* Title */}
        <div className="mb-6 text-center animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Threat Catalog
          </h1>
          <p className="text-black text-xs sm:text-sm font-medium mt-1">
            Raw threat dispatches and user reports.
          </p>
        </div>

        {/* Telemetry Metrics Panel Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-scale-in">
          <div className="card-editorial p-3.5 rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
            <div className="text-xs font-bold text-black mb-0.5">Total Reports</div>
            <div className="text-xl font-extrabold text-black tracking-tight">{totalSignals}</div>
          </div>
          <div className="card-editorial p-3.5 rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
            <div className="text-xs font-bold text-black mb-0.5">Categories</div>
            <div className="text-xl font-extrabold text-[#D97706] tracking-tight">{categoriesPresent}</div>
          </div>
          <div className="card-editorial p-3.5 rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
            <div className="text-xs font-bold text-black mb-0.5">Regions</div>
            <div className="text-xl font-extrabold text-[#11382B] tracking-tight">{countriesPresent}</div>
          </div>
          <div className="card-editorial p-3.5 rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
            <div className="text-xs font-bold text-black mb-0.5">System State</div>
            <div className="text-base font-extrabold text-[#166534] tracking-tight pt-0.5">ACTIVE</div>
          </div>
        </div>

        {/* Command Search Controls */}
        <div className="card-editorial rounded-2xl p-3 sm:p-4 border border-[#E5E0D8] bg-white shadow-xs mb-6 animate-scale-in">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-2.5">

            {/* Search Input field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search threats, emails, or keywords..."
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-black placeholder:text-black/50 focus:border-[#11382B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#11382B]/10 transition-all font-medium"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
            </div>

            {/* Dropdown filters */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative min-w-[180px]">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 pr-8 text-xs sm:text-sm text-black focus:border-[#11382B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#11382B]/10 transition-all font-semibold cursor-pointer"
                >
                  <option value="" className="bg-white text-black font-medium">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-black font-medium">
                      {cat}
                    </option>
                  ))}
                </select>
                <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black" />
              </div>

              <button
                type="submit"
                className="btn-pine px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Search
              </button>
            </div>

          </form>
        </div>

        {/* Threat Listings Catalog */}
        {loading ? (
          <div className="card-editorial rounded-2xl border border-[#E5E0D8] bg-white p-12 text-center shadow-xs animate-scale-in">
            <div className="flex justify-center mb-3">
              <Loader2 className="h-7 w-7 text-[#11382B] animate-spin" />
            </div>
            <h3 className="text-sm font-bold text-black mb-1">Loading database...</h3>
            <p className="text-black text-xs font-medium">Fetching verified threats.</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl shadow-xs animate-scale-in text-[#991B1B] text-xs">
            <ShieldAlert className="h-7 w-7 text-[#DC2626] mx-auto mb-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Error Loading Data</h3>
            <p className="text-xs text-black font-medium mb-3">{error}</p>
            <button
              onClick={() => fetchReports(search, category)}
              className="px-4 py-2 rounded-xl border border-[#FCA5A5] bg-white hover:bg-[#FEF2F2] text-black font-bold text-xs"
            >
              Retry
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="card-editorial rounded-2xl border border-[#E5E0D8] bg-white p-12 text-center shadow-xs animate-scale-in border-dashed">
            <Database className="h-7 w-7 text-black mx-auto mb-2" />
            <h3 className="text-sm font-bold text-black mb-1">No reports found</h3>
            <p className="text-black text-xs font-medium leading-relaxed max-w-sm mx-auto">
              No matching threats found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-scale-in">
            {reports.map((report) => {
              const isUpvoted = upvotedIds.includes(report.id);
              const upvoteCount = getBaseUpvotes(report.id) + (isUpvoted ? 1 : 0);

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="card-editorial p-4 sm:p-5 rounded-2xl border border-[#E5E0D8] bg-white shadow-xs hover:border-black transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Top card metadata */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-black font-bold text-[11px]">
                        {report.category || "General"}
                      </span>
                      <span className="text-black font-bold flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Body text snippet */}
                    <p className="text-black text-xs leading-relaxed line-clamp-3 mb-3 whitespace-pre-line bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E0D8] font-medium">
                      {report.reportedMessage}
                    </p>
                  </div>

                  {/* Bottom card details info row */}
                  <div className="border-t border-[#E5E0D8] pt-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-black flex items-center gap-1 font-bold max-w-[130px] sm:max-w-none truncate text-[11px]">
                        <User className="h-3.5 w-3.5 text-black shrink-0" />
                        {report.userEmail || "Anonymous"}
                      </span>
                      {report.country && (
                        <span className="text-black flex items-center gap-1 font-bold border-l border-[#E5E0D8] pl-2 text-[11px]">
                          <MapPin className="h-3.5 w-3.5 text-black shrink-0" />
                          {report.country}
                        </span>
                      )}
                    </div>

                    {/* Upvote & Inspect Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleUpvote(e, report.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${isUpvoted
                          ? "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
                          : "bg-[#FAF8F5] border-[#E5E0D8] text-black hover:border-black hover:bg-white"
                          }`}
                        aria-label="Upvote report"
                      >
                        <Heart className={`h-3 w-3 ${isUpvoted ? "fill-[#DC2626] text-[#DC2626]" : "text-black"}`} />
                        {upvoteCount}
                      </button>

                      <span className="text-[#11382B] font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Inspect
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Inspector Drawer Panel */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in" onClick={() => setSelectedReport(null)}>

          <div
            className="card-editorial w-full max-w-xl rounded-2xl border border-[#E5E0D8] bg-white shadow-2xl overflow-hidden animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Control */}
            <div className="border-b border-[#E5E0D8] bg-[#FAF8F5] px-5 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#11382B]" />
                <span className="text-xs font-bold text-black">
                  Report <code className="text-black ml-1 font-mono font-bold">#fs-{selectedReport.id.slice(0, 8)}</code>
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-black hover:text-[#11382B] hover:bg-[#FAF8F5] transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">

              {/* Telemetry info cards row inside drawer */}
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                  <div className="text-black font-bold mb-0.5 text-[11px]">Category</div>
                  <div className="text-[#11382B] font-bold text-xs">
                    {selectedReport.category || "General"}
                  </div>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                  <div className="text-black font-bold mb-0.5 text-[11px]">Location</div>
                  <div className="text-black font-bold text-xs flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-[#11382B] shrink-0" />
                    {selectedReport.country || "Global"}
                  </div>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                  <div className="text-black font-bold mb-0.5 text-[11px]">Submitter</div>
                  <div className="text-black font-bold text-xs truncate">
                    {selectedReport.userEmail || "Anonymous"}
                  </div>
                </div>
              </div>

              {/* Complete reported text payload */}
              <div>
                <div className="flex justify-between items-end mb-1.5 text-xs text-black font-bold">
                  <span>Reported Text</span>
                  <span>{new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="max-h-[260px] overflow-y-auto w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-3 text-black text-xs leading-relaxed font-sans whitespace-pre-wrap select-all font-medium">
                  {selectedReport.reportedMessage}
                </div>
              </div>

              {/* Actions row inside drawer */}
              <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between gap-2.5">
                <button
                  onClick={() => handleCopyPayload(selectedReport.reportedMessage, selectedReport.id)}
                  className="btn-pine px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === selectedReport.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-white animate-scale-in" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Message
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-xl bg-white text-black border-1.5 border-[#E5E0D8] hover:border-black hover:bg-[#FAF8F5] text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  Close
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
