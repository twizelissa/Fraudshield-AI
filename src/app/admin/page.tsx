"use client";

import { useState, useEffect } from "react";
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
  Unlock,
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
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      const savedKey = sessionStorage.getItem("fs-admin-key");
      const correctKeys = ["admin", "admin123", "fraudshield2026"];
      return correctKeys.includes(savedKey || "");
    }
    return false;
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Authentication State
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== "undefined") {
      const savedKey = sessionStorage.getItem("fs-admin-key");
      const correctKeys = ["admin", "admin123", "fraudshield2026"];
      return correctKeys.includes(savedKey || "");
    }
    return false;
  });
  const [adminKey, setAdminKey] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("fs-admin-key") || "";
    }
    return "";
  });
  
  const [decryptPassword, setDecryptPassword] = useState("");
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
      setError("Failed to interface with threat database telemetry console.");
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

  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    const correctKeys = ["admin", "admin123", "fraudshield2026"];
    const key = decryptPassword.trim();
    if (correctKeys.includes(key)) {
      sessionStorage.setItem("fs-admin-key", key);
      setIsAdmin(true);
      setAdminKey(key);
      setDecryptPassword("");
      setDecryptError(false);
      fetchReports("", "", key);
    } else {
      setDecryptError(true);
      setDecryptPassword("");
      setTimeout(() => setDecryptError(false), 2500);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("fs-admin-key");
    setIsAdmin(false);
    setAdminKey("");
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

  // 1. visitor Screen: Strictly locked terminal crack checkpoint screen when not authenticated
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy cyber-grid flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorative Mesh Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-brand/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-brand/5 blur-[120px] pointer-events-none rounded-full" />

        <form
          onSubmit={handleDecrypt}
          className="glass-card w-full max-w-md rounded-2xl border border-blue-brand/40 bg-navy-dark p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Holographic matrix line scanner decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_95%,rgba(0,242,254,0.05)_95%)] bg-[size:100%_20px] animate-pulse pointer-events-none" />

          <div className="text-center">
            <Lock className="h-10 w-10 text-blue-brand mx-auto mb-4 animate-pulse" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-white font-mono">Restricted Access Checkpoint</h2>
            <p className="text-[11px] font-mono text-slate-500 mt-2 leading-relaxed">
              OPERATOR LOGS LEDGER: Decrypted raw threat signals and index coordinates require terminal decrypt keys.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-blue-brand/70 mb-2.5 font-mono text-center">
                Decrypt Passcode Sequence
              </label>
              <input
                type="password"
                required
                value={decryptPassword}
                onChange={(e) => setDecryptPassword(e.target.value)}
                placeholder="Enter decrypt passcode..."
                className="w-full saas-input rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all font-mono tracking-widest text-center"
              />
            </div>

            {/* Error Flash */}
            {decryptError && (
              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-center animate-scale-in font-mono text-[9px] font-bold text-red-400 uppercase tracking-widest shadow-[0_0_12px_rgba(239,68,68,0.1)] animate-bounce">
                DECRYPTION SEQUENCE FAILURE: ACCESS REFUSED
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 btn-cyber py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-1.5 cursor-pointer font-sans"
            >
              <Unlock className="h-3.5 w-3.5 text-navy shrink-0" />
              Crack Gate
            </button>
          </div>

          <div className="text-[8px] font-mono text-slate-600 text-center leading-normal">
            SECURE DECRYPTION HUB: Access keys are overridable via ADMIN_PASSWORD environment records.
          </div>
        </form>
      </div>
    );
  }

  // 2. Admin Screen: Completely Decrypted console views
  return (
    <div className="min-h-screen bg-navy cyber-grid py-16 px-4 relative overflow-hidden">
      {/* Background Decorative Mesh Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-brand/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-brand/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-5xl relative z-10 animate-fade-in">
        
        {/* Upper Access Control Badge and Seal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-b border-blue-brand/10 pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            Secure Admin Session Active
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-navy/80 hover:bg-white/5 text-slate-300 border border-blue-brand/15 text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer animate-flicker"
          >
            Seal Logs Console
          </button>
        </div>

        {/* Title Context */}
        <div className="mb-10 text-center animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-widest uppercase">
            Decrypted Threat Catalog
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto font-medium leading-relaxed font-mono">
            Full operational catalog view active. Access keyword log querying, unmasked coordinates, and raw reported message payloads.
          </p>
        </div>

        {/* Telemetry Metrics Panel Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-scale-in">
          <div className="glass-card p-4 rounded-xl border border-blue-brand/10 bg-navy/60 backdrop-blur shadow-lg hover:border-blue-brand/20 transition-all font-mono">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">threat signals</div>
            <div className="text-2xl font-bold text-white tracking-wider">{totalSignals}</div>
            <div className="text-[9px] text-blue-brand/50 mt-1 uppercase font-bold tracking-wider">Indexed logs</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-blue-brand/10 bg-navy/60 backdrop-blur shadow-lg hover:border-blue-brand/20 transition-all font-mono">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">risk vector profiles</div>
            <div className="text-2xl font-bold text-violet-brand tracking-wider">{categoriesPresent}</div>
            <div className="text-[9px] text-violet-brand/50 mt-1 uppercase font-bold tracking-wider">Categories matched</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-blue-brand/10 bg-navy/60 backdrop-blur shadow-lg hover:border-blue-brand/20 transition-all font-mono">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">global focal zones</div>
            <div className="text-2xl font-bold text-blue-brand tracking-wider">{countriesPresent}</div>
            <div className="text-[9px] text-blue-brand/50 mt-1 uppercase font-bold tracking-wider">Targeted Geolocations</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-blue-brand/10 bg-navy/60 backdrop-blur shadow-lg hover:border-blue-brand/20 transition-all font-mono">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">engine link state</div>
            <div className="text-2xl font-bold text-emerald-400 tracking-wider animate-pulse uppercase text-sm sm:text-base pt-1">INTEGRITY OK</div>
            <div className="text-[9px] text-emerald-500/50 mt-1 uppercase font-bold tracking-wider">AI Synced live</div>
          </div>
        </div>

        {/* Command Search Controls */}
        <div className="glass-card rounded-2xl p-4 border border-blue-brand/15 bg-navy/60 backdrop-blur-md shadow-2xl mb-8 animate-scale-in">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Query message signatures, emails, or threat keyword details..."
                className="w-full saas-input rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all font-semibold font-mono"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-brand/50" />
            </div>

            {/* Dropdown filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative min-w-[200px]">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full saas-input appearance-none rounded-xl px-4 py-3.5 pr-10 text-sm text-white focus:outline-none transition-all font-semibold cursor-pointer font-mono"
                >
                  <option value="" className="bg-navy-dark text-white">All Threat Profiles</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-navy-dark text-white font-mono">
                      {cat}
                    </option>
                  ))}
                </select>
                <Filter className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-brand/50" />
              </div>

              <button
                type="submit"
                className="btn-cyber px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                <Terminal className="h-4 w-4" />
                Query Logs
              </button>
            </div>

          </form>
        </div>

        {/* Threat Listings Catalog */}
        {loading ? (
          <div className="glass-card rounded-2xl border border-blue-brand/15 bg-navy/60 p-24 text-center shadow-2xl animate-scale-in">
            <div className="flex justify-center mb-5">
              <Loader2 className="h-8 w-8 text-blue-brand animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 tracking-widest uppercase font-mono">Querying Threat Ledger...</h3>
            <p className="text-slate-400 text-xs font-medium font-mono">Retrieving active indicators and user dispatches from databases...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-violet-950/20 border border-violet-900/50 rounded-2xl shadow-xl animate-scale-in text-violet-300 font-mono text-xs">
            <ShieldAlert className="h-8 w-8 text-violet-brand mx-auto mb-4 animate-bounce" />
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">TELEMETRY ERROR DETECTED</h3>
            <p className="text-[11px] text-slate-400 font-medium mb-4">{error}</p>
            <button
              onClick={() => fetchReports(search, category)}
              className="px-5 py-2.5 rounded-xl border border-violet-850 hover:bg-violet-900/10 transition-all font-semibold uppercase tracking-widest text-[9px]"
            >
              Recalibrate Telemetry Grid
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="glass-card rounded-2xl border border-blue-brand/10 bg-navy/40 p-20 text-center shadow-xl animate-scale-in border-dashed">
            <Database className="h-8 w-8 text-slate-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-sm font-bold text-white mb-2 tracking-widest uppercase font-mono">No Threat Signals Cataloged</h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-sm mx-auto">
              Your query returned zero active threat signature entries. Revise your search descriptors or selection filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in">
            {reports.map((report) => {
              const isUpvoted = upvotedIds.includes(report.id);
              const upvoteCount = getBaseUpvotes(report.id) + (isUpvoted ? 1 : 0);

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="glass-card p-6 rounded-2xl border border-blue-brand/10 bg-navy/60 backdrop-blur shadow-lg hover-lift transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Accent Line glow */}
                  <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-blue-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Top card metadata */}
                    <div className="flex items-center justify-between gap-3 mb-4 font-mono text-[9px]">
                      <span className="px-2.5 py-1 rounded bg-blue-brand/5 border border-blue-brand/20 text-blue-brand font-bold uppercase tracking-wider">
                        {report.category || "General Uncategorized"}
                      </span>
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Body text snippet */}
                    <p className="text-slate-300 text-xs font-mono leading-relaxed line-clamp-4 mb-6 whitespace-pre-line group-hover:text-white transition-colors bg-navy-dark/40 p-3 rounded-lg border border-blue-brand/5">
                      {report.reportedMessage}
                    </p>
                  </div>

                  {/* Bottom card details info row */}
                  <div className="border-t border-blue-brand/5 pt-4 flex items-center justify-between gap-4 font-mono text-[9px]">
                    <div className="flex items-center gap-2.5 font-mono">
                      <span className="text-slate-500 flex items-center gap-1 font-medium max-w-[130px] sm:max-w-none truncate">
                        <User className="h-3.5 w-3.5 text-blue-brand/50 shrink-0" />
                        {report.userEmail || "Anonymous Submitter"}
                      </span>
                      {report.country && (
                        <span className="text-slate-500 flex items-center gap-1 font-medium border-l border-blue-brand/10 pl-3">
                          <MapPin className="h-3.5 w-3.5 text-violet-brand/50 shrink-0" />
                          {report.country}
                        </span>
                      )}
                    </div>

                    {/* Upvote & Inspect Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      {/* Interactive Simulated Upvoting Telemetry */}
                      <button
                        onClick={(e) => handleUpvote(e, report.id)}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[9px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                          isUpvoted
                            ? "bg-red-500/10 border-red-500/35 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
                            : "bg-navy-dark border-blue-brand/10 text-slate-500 hover:border-red-500/20 hover:text-red-400"
                        }`}
                        aria-label="Upvote Scam report"
                      >
                        <Heart className={`h-3 w-3 ${isUpvoted ? "fill-red-400 text-red-400" : ""}`} />
                        {upvoteCount}
                      </button>
                      
                      <span className="text-blue-brand/70 font-bold uppercase tracking-wider flex items-center gap-1 group-hover:text-blue-brand transition-colors">
                        inspect
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Large Glassmorphic Inspector Drawer Panel */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedReport(null)}>
          
          <div
            className="glass-card w-full max-w-2xl rounded-3xl border border-blue-brand/35 bg-[#070e20] shadow-2xl overflow-hidden animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Control */}
            <div className="border-b border-blue-brand/15 bg-navy/80 px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-blue-brand animate-flicker" />
                <span className="text-[10px] font-bold text-blue-brand uppercase tracking-widest font-mono">
                  threat ledger payload <code className="font-mono text-slate-500 ml-1">#fs-{selectedReport.id.slice(0, 8)}</code>
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-blue-brand/15 cursor-pointer"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Telemetry info cards row inside drawer */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-[10px]">
                <div className="p-3 bg-navy-dark/60 rounded-xl border border-blue-brand/10">
                  <div className="text-slate-500 uppercase font-bold tracking-wider mb-1">risk profile vector</div>
                  <div className="text-white font-bold uppercase text-[11px] tracking-wide text-blue-brand">
                    {selectedReport.category || "Uncategorized"}
                  </div>
                </div>
                <div className="p-3 bg-navy-dark/60 rounded-xl border border-blue-brand/10">
                  <div className="text-slate-500 uppercase font-bold tracking-wider mb-1">geographical zone</div>
                  <div className="text-white font-bold uppercase text-[11px] tracking-wide text-violet-brand flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    {selectedReport.country || "GLOBAL ZONE"}
                  </div>
                </div>
                <div className="p-3 bg-navy-dark/60 rounded-xl border border-blue-brand/10 col-span-2 sm:col-span-1">
                  <div className="text-slate-500 uppercase font-bold tracking-wider mb-1">dispatch operator</div>
                  <div className="text-white font-bold text-[11px] truncate">
                    {selectedReport.userEmail || "Anonymous Submitter"}
                  </div>
                </div>
              </div>

              {/* Complete reported text payload in monospaced format */}
              <div>
                <div className="flex justify-between items-end mb-2 font-mono text-[9px] uppercase tracking-widest text-slate-400">
                  <span>complete signature byte data</span>
                  <span>{new Date(selectedReport.createdAt).toLocaleString()}</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto w-full rounded-xl border border-blue-brand/15 bg-navy-dark p-4 text-white text-xs leading-relaxed font-mono whitespace-pre-wrap select-all">
                  {selectedReport.reportedMessage}
                </div>
              </div>

              {/* Actions row inside drawer */}
              <div className="pt-4 border-t border-blue-brand/5 flex items-center justify-between gap-4 font-mono text-[10px]">
                <button
                  onClick={() => handleCopyPayload(selectedReport.reportedMessage, selectedReport.id)}
                  className="px-5 py-2.5 rounded-xl btn-cyber text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 cursor-pointer animate-flicker font-sans"
                >
                  {copiedId === selectedReport.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-navy animate-scale-in" />
                      Payload Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Payload Content
                    </>
                  )}
                </button>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-5 py-2.5 rounded-xl border border-blue-brand/15 bg-navy-dark text-blue-brand font-semibold hover:bg-white/5 transition-all cursor-pointer uppercase tracking-widest text-[9px]"
                >
                  Close Inspection
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
