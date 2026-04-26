import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Glow */}
      <div className="absolute -left-30 -top-30 h-72 w-72 rounded-full bg-[#00ff9c]/15 blur-3xl" />

      <div className="absolute -bottom-30 -right-30 h-72 w-72 rounded-full bg-[#c1ff23]/10 blur-3xl" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[38px_38px]" />

      {/* Center Container */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          
          {/* Left Brand Panel */}
          <div className="hidden flex-col justify-between border-r border-white/10 p-10 lg:flex">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Chat<span className="text-[#00ff9c]">CV</span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-7 text-gray-400">
                Build ATS-friendly resumes using AI chat.
                No complex forms. Just talk and create
                beautiful resumes in minutes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-gray-300">
                  ⚡ AI-powered resume generation
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-gray-300">
                  📄 Live preview & export ready
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-gray-300">
                  🚀 Built for modern developers
                </p>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}