import type { Metadata } from "next";
import "./globals.css";
import FraudShieldNav from "@/components/FraudShieldNav";


export const metadata: Metadata = {
  title: "FraudShield AI — Cybersecurity & Scam Prevention",
  description:
    "Professional protection against digital scams. Detect fake jobs, scholarships, grants, phishing messages, and suspicious online offers. Stay safe from online fraud.",
  keywords: [
    "cybersecurity",
    "scam prevention",
    "fraud detection",
    "phishing checker",
    "scam protection",
    "digital safety",
  ],
  openGraph: {
    title: "FraudShield AI — Scam Prevention",
    description: "Analyze suspicious messages and stay safe from scams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-navy min-h-screen">
        <FraudShieldNav />
        <main className="min-h-[70vh]">{children}</main>
        
        {/* High-fidelity Cyberpunk Console Footer */}
        <footer className="border-t border-blue-brand/10 bg-navy-dark/90 backdrop-blur-md mt-20">
          <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-8 font-mono text-[10px]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-white">
                <div className="h-8 w-8 rounded-lg bg-blue-brand/5 border border-blue-brand/15 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.05)] overflow-hidden p-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.png" alt="FraudShield AI Logo" className="h-full w-full object-contain animate-pulse" />
                </div>
                <span className="font-bold tracking-widest uppercase text-[13px]">
                  FraudShield <span className="text-blue-brand">AI</span>
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs font-sans">
                Protecting individuals and organizations from digital fraud and social engineering threats.
              </p>
            </div>
            <div className="text-center sm:text-right space-y-2">
              <p className="text-slate-500 leading-normal max-w-xs sm:max-w-none">
                SECURE CONSOLE ACTIVE: Educational cybersecurity advisory protocol.
              </p>
              <p className="text-slate-400 leading-normal">
                © 2026 FraudShield AI — Digital Safety Project
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
