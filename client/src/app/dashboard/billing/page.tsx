"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Check, Loader2, MessageSquare, Crown, ArrowLeft, AlertCircle, ExternalLink } from "lucide-react";
import {
  getCurrentUser,
  getPaymentPlans,
  createPaymentOrder,
  verifyPayment,
  type CurrentUser,
  type PaymentPlan,
} from "@/lib/api";

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [verifying, setVerifying] = useState(false);

  // ── Handle return from Dodo checkout page ────────────────────────────────────
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id") || sessionStorage.getItem("dodo_session_id");
    const cancelled = searchParams.get("cancelled");

    if (cancelled) {
      setErrorMsg("Payment was cancelled. You can try again anytime.");
      return;
    }

    if (success && sessionId) {
      const token = localStorage.getItem("token");
      if (!token) return;

      setVerifying(true);
      setSuccessMsg("");
      setErrorMsg("");

      verifyPayment({ sessionId }, token).then((res) => {
        setVerifying(false);
        sessionStorage.removeItem("dodo_session_id");

        if (res.success && res.data) {
          setSuccessMsg(
            `🎉 Payment successful! ${res.data.tokensAdded} chats added. You now have ${res.data.newLimit} total chats.`
          );
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  chatTokensLimit: res.data!.newLimit,
                  chatTokensUsed: res.data!.newUsed,
                }
              : prev
          );
        } else {
          const errMsg = (res as { message?: string }).message;
          if (errMsg?.includes("not completed")) {
            setErrorMsg("Payment is still being processed. Please check back in a moment.");
          } else {
            setErrorMsg(errMsg || "Could not verify payment. Please contact support.");
          }
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load user + plans ─────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.replace("/login"); return; }

      const [userRes, plansRes] = await Promise.all([
        getCurrentUser(token),
        getPaymentPlans(),
      ]);

      if (!userRes.success) { router.replace("/login"); return; }
      setUser(userRes.data as CurrentUser);
      if (plansRes.success && plansRes.data) setPlans(plansRes.data);
      setLoading(false);
    };
    init();
  }, [router]);

  // ── Purchase ──────────────────────────────────────────────────────────────────
  const handlePurchase = useCallback(async (planId: string) => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    setPurchasingPlan(planId);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const orderRes = await createPaymentOrder(planId, token);

      if (!orderRes.success || !orderRes.data) {
        setErrorMsg(
          (orderRes as { message?: string }).message ||
          "Failed to create checkout session. Please try again."
        );
        setPurchasingPlan(null);
        return;
      }

      const { checkoutUrl, sessionId } = orderRes.data;

      // Save session ID so we can verify when user returns
      sessionStorage.setItem("dodo_session_id", sessionId);

      // Redirect to Dodo checkout
      window.location.href = checkoutUrl;

    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setPurchasingPlan(null);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#00ff9c] border-t-transparent" />
      </div>
    );
  }

  const usagePercent = user ? Math.min((user.chatTokensUsed / user.chatTokensLimit) * 100, 100) : 0;
  const remaining = user ? Math.max(user.chatTokensLimit - user.chatTokensUsed, 0) : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#00ff9c]/4 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Back */}
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-8 flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00ff9c]/20 to-[#00ff9c]/5 border border-[#00ff9c]/20">
            <Crown size={24} className="text-[#00ff9c]" />
          </div>
          <h1 className="text-3xl font-bold text-white">Upgrade Your Plan</h1>
          <p className="mt-2 text-gray-400">Get more chats to build the perfect ATS resume</p>
        </div>

        {/* Current usage */}
        {user && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-[#00ff9c]" />
                <span className="text-sm font-semibold text-white">Current Usage</span>
              </div>
              <span
                className={`text-sm font-bold ${
                  remaining === 0 ? "text-red-400" : remaining <= 5 ? "text-yellow-400" : "text-[#00ff9c]"
                }`}
              >
                {remaining} chats remaining
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  remaining === 0 ? "bg-red-500" : remaining <= 5 ? "bg-yellow-400" : "bg-[#00ff9c]"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {user.chatTokensUsed} of {user.chatTokensLimit} chats used
            </p>
          </div>
        )}

        {/* Verifying state */}
        {verifying && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#00ff9c]/30 bg-[#00ff9c]/10 p-4">
            <Loader2 size={18} className="text-[#00ff9c] animate-spin shrink-0" />
            <p className="text-sm text-[#00ff9c] font-medium">Verifying your payment…</p>
          </div>
        )}

        {/* Success / Error */}
        {successMsg && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#00ff9c]/30 bg-[#00ff9c]/10 p-4">
            <Check size={18} className="mt-0.5 shrink-0 text-[#00ff9c]" />
            <p className="text-sm font-medium text-[#00ff9c]">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{errorMsg}</p>
          </div>
        )}

        {/* Plan cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {plans.map((plan, idx) => {
            const isPopular = idx === 1;
            const isPurchasing = purchasingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                  isPopular
                    ? "border-[#00ff9c]/50 bg-[#00ff9c]/5 shadow-xl shadow-[#00ff9c]/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#00ff9c] px-3 py-0.5 text-xs font-bold text-black">
                      BEST VALUE
                    </span>
                  </div>
                )}

                <div className="mb-5 flex items-center gap-3">
                  <div className={`rounded-xl p-2 ${isPopular ? "bg-[#00ff9c]/20" : "bg-white/10"}`}>
                    <Zap size={18} className={isPopular ? "text-[#00ff9c]" : "text-gray-300"} />
                  </div>
                  <div>
                    <h2 className="font-bold text-white">{plan.label}</h2>
                    <p className="text-xs text-gray-400">{plan.tokens} AI chat messages</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="ml-1 text-sm text-gray-400">one-time</span>
                </div>

                <ul className="mb-8 flex-1 space-y-2.5">
                  {[
                    `${plan.tokens} AI chat messages`,
                    "ATS-friendly LaTeX PDF export",
                    "Unlimited resume editing",
                    "Resume upload & extraction",
                    "No subscription, no renewal",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check size={14} className={isPopular ? "text-[#00ff9c]" : "text-gray-500"} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={isPurchasing || !!purchasingPlan || verifying}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isPopular
                      ? "bg-[#00ff9c] text-black hover:scale-[1.02] hover:bg-[#00cc7a] shadow-lg shadow-[#00ff9c]/30"
                      : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Redirecting to checkout…
                    </>
                  ) : (
                    <>
                      Buy {plan.label} — {plan.price}
                      <ExternalLink size={14} className="opacity-60" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust signals */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
          <span>🔒 Secured by Dodo Payments</span>
          <span>💳 Cards · UPI · Wallets</span>
          <span>⚡ Instant credit after payment</span>
          <span>🇮🇳 INR pricing</span>
        </div>

        <p className="mt-4 text-center text-xs text-gray-600">
          You will be redirected to Dodo Payments secure checkout.
          After payment, you will be brought back here automatically.
        </p>
      </div>
    </div>
  );
}