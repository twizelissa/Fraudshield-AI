"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, Lock, Mail, User } from "lucide-react";
import BrainChargerLogo from "@/components/BrainChargerLogo";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Check if session was created immediately or confirmation email sent
      if (data.session) {
        router.push("/");
        router.refresh();
      } else {
        setSuccess(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to sign up. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to initiate Google sign-up.";
      setError(msg);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F6F0] min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 animate-fade-in">

        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <BrainChargerLogo className="h-8 w-8 text-[#0B6A3B] group-hover:scale-105 transition-transform" />
            <span className="text-xl font-extrabold tracking-tight text-black">
              FraudShield
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-black/70 font-medium">
            Join the community to report threats and protect people from online scams.
          </p>
        </div>

        {/* Main Card */}
        <div className="card-editorial p-6 sm:p-8 bg-white border border-[#E5E0D8] rounded-2xl shadow-xs space-y-6">

          {success ? (
            <div className="text-center py-4 space-y-3 animate-scale-in">
              <div className="h-12 w-12 rounded-full bg-[#E8F5E9] text-[#0B6A3B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-black">Check your email</h3>
              <p className="text-xs text-black/70 font-medium leading-relaxed max-w-xs mx-auto">
                We sent a confirmation link to <span className="font-bold text-black">{email}</span>. Click the link to complete your registration.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="btn-pine px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
                >
                  Go to Login
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Google Sign-up button */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-black transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#0B6A3B]" />
                ) : (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign up with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#E5E0D8] w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-black/40 uppercase tracking-wider">
                  or with email
                </span>
                <div className="border-t border-[#E5E0D8] w-full" />
              </div>

              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold animate-scale-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626] mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 pl-9 text-xs text-black placeholder:text-black/40 focus:border-[#0B6A3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6A3B]/10 transition-all font-medium"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 pl-9 text-xs text-black placeholder:text-black/40 focus:border-[#0B6A3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6A3B]/10 transition-all font-medium"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 pl-9 text-xs text-black placeholder:text-black/40 focus:border-[#0B6A3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B6A3B]/10 transition-all font-medium"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/50" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full btn-pine py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

        </div>

        {/* Footer switch to sign in */}
        <p className="text-center text-xs text-black font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#0B6A3B] hover:underline">
            Log in here
          </Link>
        </p>

      </div>
    </div>
  );
}
