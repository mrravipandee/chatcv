export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, FileText, ChevronRight, Briefcase } from "lucide-react";
import fs from "fs";
import path from "path";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Professional Resume Examples by Job Role (2026)",
  description: "Browse 200+ ATS-friendly resume templates and examples by job role and industry. Copy LaTeX source templates and find target keywords.",
  alternates: {
    canonical: "/resume-examples",
  },
};

interface RoleLink {
  name: string;
  slug: string;
}

interface IndustryGroup {
  name: string;
  slug: string;
  roles: RoleLink[];
}

export default async function ResumeExamplesIndexPage() {
  const indexPath = path.join(process.cwd(), "src/content/resume-examples/index.json");
  let industries: IndustryGroup[] = [];

  try {
    if (fs.existsSync(indexPath)) {
      const data = fs.readFileSync(indexPath, "utf-8");
      industries = JSON.parse(data).industries || [];
    }
  } catch (error) {
    console.error("Error reading programmatic index:", error);
  }

  return (
    <main className="bg-[#05070a] min-h-screen pt-32 pb-24 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO TITLE HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3">
            <Badge variant="glow" icon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />} withDot>
              Resume Examples Directory
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mt-3 mb-5 leading-tight tracking-tight">
            ATS Resume Examples <br />
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              by Job Role
            </span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
            Select your target profession to find specific resume summary examples, copyable LaTeX templates, and verified ATS keywords.
          </p>
        </div>

        {/* DIRECTORY GRID */}
        {industries.length > 0 ? (
          <div className="space-y-10">
            {industries.map((ind) => (
              <div
                key={ind.slug}
                className="bg-[#0b0f16]/80 border border-white/[0.08] rounded-3xl p-6 sm:p-8 hover:border-emerald-500/20 transition-all duration-300 backdrop-blur-xl"
              >
                {/* Industry Title */}
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5 mb-6 pb-3 border-b border-white/[0.06]">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  {ind.name}
                </h3>

                {/* Roles list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {ind.roles.map((role) => (
                    <Link
                      key={role.slug}
                      href={`/resume-examples/${role.slug}`}
                      className="group flex items-center justify-between p-3.5 bg-zinc-950/60 border border-white/[0.06] rounded-2xl hover:border-emerald-500/40 hover:bg-emerald-500/[0.04] transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-zinc-900 border border-white/10 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 p-2 rounded-xl text-zinc-400 group-hover:text-emerald-400 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                          {role.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transform group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/10 border border-dashed border-white/10 rounded-3xl">
            <p className="text-zinc-500 text-sm">No industries registered in catalog index.</p>
          </div>
        )}

      </div>
    </main>
  );
}
