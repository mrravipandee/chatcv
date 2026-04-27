"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Mail, Loader2 } from "lucide-react";
import { verifyOtp } from "@/lib/api";

// ✅ Separate component that uses useSearchParams
function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(queryEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Enter valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    const res = await verifyOtp({ email, otp: finalOtp });
    setLoading(false);

    if (!res.success) {
      setError(res.message || "Verification failed.");
      return;
    }

    setSuccess("Account verified successfully.");
    setTimeout(() => {
      router.push("/login");
    }, 1200);
  };

  return (
    <section>
      <div className="mb-8">
        <p className="mb-3 inline-flex rounded-full border border-[#00ff9c]/20 bg-[#00ff9c]/10 px-3 py-1 text-xs font-medium text-[#00ff9c]">
          Email Verification
        </p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Verify Your <span className="text-[#00ff9c]">OTP</span>
        </h1>
        <p className="mt-3 text-sm text-gray-400">
          Enter the 6-digit code sent to your email.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00ff9c]/10">
          <ShieldCheck size={28} className="text-[#00ff9c]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Email Address
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <Mail size={18} className="text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Verification Code
            </label>
            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="h-12 rounded-2xl border border-white/10 bg-black/30 text-center text-lg font-semibold text-white outline-none focus:border-[#00ff9c]"
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-[#00ff9c]">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00ff9c] px-4 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already verified?{" "}
          <Link href="/login" className="text-[#00ff9c] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}

// ✅ Default export wraps with Suspense
export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}