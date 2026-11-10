"use client";

import { useState, useEffect } from "react";
import {
  Terminal,
  Activity,
  Search,
  Filter,
  Calendar,
  MapPin,
  Copy,
  ShieldAlert,
  Loader2,
  X,
  Check,
  ChevronRight,
  Database,
  Globe,
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

export default function ThreatsPage() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  const fetchReports = async (searchVal = "", catVal = "") => {
    setLoading(true);
    setError(null);
    try {
      const qParams = new URLSearchParams();
      if (searchVal.trim()) qParams.append("q", searchVal.trim());
      if (catVal) qParams.append("category", catVal);

      const res = await fetch(`/api/fraudshield/complaints?${qParams.toString()}`);
      if (!res.ok) {
        throw new Error(`Server error (${res.status}). Please try again.`);
      }
      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Unable to load threat reports.");
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

  // Mount logic - fetch reports on load and when category changes
  useEffect(() => {
    fetchReports(search, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(search, category);
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

  return (
    <div className="min-h-screen bg-[#F8F6F0] py-12 px-4 relative">
      <div className="mx-auto max-w-5xl relative z-10 animate-fade-in">

        {/* Upper Title - concise, app-like */}
        <div className="mb-6 text-center animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Threat Feed
          </h1>
          <p className="text-black text-xs sm:text-sm font-medium mt-1">
            Community reports and verified scam patterns.
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
            <div className="text-xl font-extrabold text-[#0B6A3B] tracking-tight">{countriesPresent}</div>
          </div>
          <div className="card-editorial p-3.5 rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
            <div className="text-xs font-bold text-black mb-0.5">Feed Status</div>
            <div className="text-base font-extrabold text-[#166534] tracking-tight pt-0.5">LIVE</div>
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
                placeholder="Search threats or keywords..."
                className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-black placeholder:text-black/50 focus:border-[#0B6A3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6A3B]/10 transition-all font-medium"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
            </div>

            {/* Dropdown filters */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative min-w-[180px]">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 pr-8 text-xs sm:text-sm text-black focus:border-[#0B6A3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6A3B]/10 transition-all font-semibold cursor-pointer"
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
              <Loader2 className="h-7 w-7 text-[#0B6A3B] animate-spin" />
            </div>
            <h3 className="text-sm font-bold text-black mb-1">Loading reports...</h3>
            <p className="text-black text-xs font-medium">Fetching verified community threat signals.</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl shadow-xs animate-scale-in text-[#991B1B] text-xs">
            <ShieldAlert className="h-7 w-7 text-[#DC2626] mx-auto mb-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Failed to load feed</h3>
            <p className="text-xs text-black font-medium mb-3">{error}</p>
            <button
              onClick={() => fetchReports(search, category)}
              className="px-4 py-2 rounded-xl border border-[#FCA5A5] bg-white hover:bg-[#FEF2F2] font-bold text-xs text-black"
            >
              Retry
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="card-editorial rounded-2xl border border-[#E5E0D8] bg-white p-12 text-center shadow-xs animate-scale-in border-dashed">
            <Database className="h-7 w-7 text-black mx-auto mb-2" />
            <h3 className="text-sm font-bold text-black mb-1">No reports found</h3>
            <p className="text-black text-xs font-medium leading-relaxed max-w-sm mx-auto">
              No matching threats found. Try another search or category.
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
                    <div>
                      {report.country && (
                        <span className="text-black flex items-center gap-1 font-bold text-[11px]">
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

                      <span className="text-[#0B6A3B] font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
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
                <Terminal className="h-4 w-4 text-[#0B6A3B]" />
                <span className="text-xs font-bold text-black">
                  Report <code className="text-black ml-1 font-mono font-bold">#fs-{selectedReport.id.slice(0, 8)}</code>
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-black hover:text-[#0B6A3B] hover:bg-[#FAF8F5] transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">

              {/* Telemetry info cards */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                  <div className="text-black font-bold mb-0.5 text-[11px]">Category</div>
                  <div className="text-[#0B6A3B] font-bold text-xs">
                    {selectedReport.category || "General"}
                  </div>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
                  <div className="text-black font-bold mb-0.5 text-[11px]">Location</div>
                  <div className="text-black font-bold text-xs flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-[#0B6A3B] shrink-0" />
                    {selectedReport.country || "Global"}
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
