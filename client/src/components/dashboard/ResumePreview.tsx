"use client";

import { Download, Eye } from "lucide-react";

export default function ResumePreview() {
  return (
    <section className="hidden h-full flex-col bg-zinc-950 xl:flex">
      {/* Top Actions */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <Eye size={18} className="text-[#00ff9c]" />

          <h3 className="text-sm font-semibold text-white lg:text-base">
            Live Preview
          </h3>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-[#00ff9c] px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]">
          <Download size={16} />
          Download PDF
        </button>
      </div>

      {/* Resume Canvas */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-black shadow-2xl">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ravi Pandey
            </h1>

            <p className="mt-1 text-gray-600">
              Backend Developer
            </p>

            <p className="mt-2 text-sm text-gray-500">
              ravi@email.com • Nashik, India
            </p>
          </div>

          {/* Summary */}
          <div className="mt-8">
            <h2 className="border-b pb-2 text-lg font-semibold">
              Summary
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              Backend developer with hands-on experience
              building scalable APIs using Node.js,
              Express.js, MongoDB and Redis.
            </p>
          </div>

          {/* Skills */}
          <div className="mt-8">
            <h2 className="border-b pb-2 text-lg font-semibold">
              Skills
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              Node.js, Express.js, MongoDB, Redis,
              TypeScript, JWT, REST APIs
            </p>
          </div>

          {/* Experience */}
          <div className="mt-8">
            <h2 className="border-b pb-2 text-lg font-semibold">
              Experience
            </h2>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold">
                  Backend Intern
                </h3>

                <span className="text-sm text-gray-500">
                  2024
                </span>
              </div>

              <p className="text-sm text-gray-600">
                TCS
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                <li>
                  Built REST APIs for internal tools.
                </li>
                <li>
                  Improved database query performance.
                </li>
                <li>
                  Worked with authentication systems.
                </li>
              </ul>
            </div>
          </div>

          {/* Projects */}
          <div className="mt-8">
            <h2 className="border-b pb-2 text-lg font-semibold">
              Projects
            </h2>

            <div className="mt-4">
              <h3 className="font-semibold">
                ChatCV
              </h3>

              <p className="mt-2 text-sm text-gray-700">
                AI-powered resume builder using chat
                interface with live preview and PDF
                export.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-gray-400">
            Generated with ChatCV
          </p>
        </div>
      </div>
    </section>
  );
}