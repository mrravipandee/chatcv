"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Loader2,
} from "lucide-react";

import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ===============================
  // Input Change
  // ===============================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    const res =
      await loginUser(form);

    setLoading(false);

    if (!res.success) {
      setError(
        res.message ||
          "Login failed."
      );
      return;
    }

    // Save Token
    localStorage.setItem(
      "token",
      res.data?.token || ""
    );

    router.push(
      "/dashboard"
    );
  };

  return (
    <section>
      {/* Heading */}
      <div className="mb-8">
        <p className="mb-3 inline-flex rounded-full border border-[#00ff9c]/20 bg-[#00ff9c]/10 px-3 py-1 text-xs font-medium text-[#00ff9c]">
          Welcome Back
        </p>

        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Sign in to{" "}
          <span className="text-[#00ff9c]">
            ChatCV
          </span>
        </h1>

        <p className="mt-3 text-sm text-gray-400">
          Continue building your
          AI-powered resume.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        {/* Security Box */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ff9c]/10">
            <Shield
              size={18}
              className="text-[#00ff9c]"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Secure Login
            </p>

            <p className="text-xs text-gray-500">
              Protected with JWT auth
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <Mail
                size={18}
                className="text-gray-500"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={
                  handleChange
                }
                placeholder="you@example.com"
                className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-gray-300">
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs text-[#00ff9c] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <Lock
                size={18}
                className="text-gray-500"
              />

              <input
                type="password"
                name="password"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                placeholder="••••••••"
                className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00ff9c] px-4 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an
          account?{" "}
          <Link
            href="/register"
            className="text-[#00ff9c] hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
}