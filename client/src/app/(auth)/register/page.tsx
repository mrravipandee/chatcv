"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    const res = await registerUser(form);

    setLoading(false);

    if (!res.success) {
      setError(
        res.message ||
          "Registration failed."
      );
      return;
    }

    setSuccess(
      "Account created. Verify OTP."
    );

    router.push(
      `/verify-otp?email=${encodeURIComponent(
        form.email
      )}`
    );
  };

  return (
    <section>
      {/* Heading */}
      <div className="mb-8">
        <p className="mb-3 inline-flex rounded-full border border-[#00ff9c]/20 bg-[#00ff9c]/10 px-3 py-1 text-xs font-medium text-[#00ff9c]">
          Create Account
        </p>

        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Join{" "}
          <span className="text-[#00ff9c]">
            ChatCV
          </span>
        </h1>

        <p className="mt-3 text-sm text-gray-400">
          Start building your
          AI-powered resume today.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Full Name
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <User
                size={18}
                className="text-gray-500"
              />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                placeholder="Ravi Pandey"
                className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Email
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
            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>

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

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Confirm Password
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <Lock
                size={18}
                className="text-gray-500"
              />

              <input
                type="password"
                name="confirmPassword"
                value={
                  form.confirmPassword
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

          {/* Success */}
          {success && (
            <p className="text-sm text-[#00ff9c]">
              {success}
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
                Creating...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an
          account?{" "}
          <Link
            href="/login"
            className="text-[#00ff9c] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}