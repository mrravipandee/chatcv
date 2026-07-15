import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllResumeRoles, getResumeRole, getRelatedResumeRoles } from "@/lib/blog";
import { Sparkles, FileText, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import ResumePreviewWidget from "@/components/blog/ResumePreviewWidget";
import ResumeSummaryGenerator from "@/components/blog/ResumeSummaryGenerator";
import BlogCTA from "@/components/blog/BlogCTA";

interface ResumeRolePageProps {
  params: Promise<{ role: string }>;
}

// Generate static params for compilation
export async function generateStaticParams() {
  const roles = getAllResumeRoles();
  return roles.map((role) => ({
    role: role.role,
  }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }: ResumeRolePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const role = getResumeRole(resolvedParams.role);
  if (!role) return {};

  const baseUrl = "https://resume-builder-chatcv.vercel.app";
  const canonicalUrl = `${baseUrl}/resume-examples/${role.role}`;

  return {
    title: role.title,
    description: role.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: role.title,
      description: role.metaDescription,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: role.title,
      description: role.metaDescription,
    },
  };
}

export default async function ResumeRolePage({ params }: ResumeRolePageProps) {
  const resolvedParams = await params;
  const role = getResumeRole(resolvedParams.role);

  if (!role) {
    notFound();
  }

  const relatedRoles = getRelatedResumeRoles(role, 4);
  const baseUrl = "https://resume-builder-chatcv.vercel.app";

  // SCHEMAS GENERATION
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Resume Examples",
        "item": `${baseUrl}/resume-examples`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": role.jobTitle,
        "item": `${baseUrl}/resume-examples/${role.role}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": role.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <main className="bg-black min-h-screen pt-28 pb-20 text-white">
      {/* SCHEMA INJECTIONS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BACK NAVIGATION */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/resume-examples" className="hover:text-[#00ff9c] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Resume Examples</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <span className="text-zinc-300">{role.jobTitle}</span>
        </div>

        {/* HERO TITLE HEADER */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00ff9c] bg-[#00ff9c]/10 px-3.5 py-1 rounded-full border border-[#00ff9c]/20 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Programmatic SEO Template
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-4 mb-4 leading-tight tracking-tight">
            ATS {role.jobTitle} Resume <span className="bg-gradient-to-r from-[#00ff9c] to-emerald-400 bg-clip-text text-transparent">Examples & Guide</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Need a professional, ATS-friendly resume layout for {role.jobTitle}? Below, discover target skills lists, customized bullet points examples, a simulated summary generator, and a copyable LaTeX source template.
          </p>
        </div>

        {/* LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* MAIN COLUMN */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* INTERACTIVE LEAD MAGNET: SUMMARY GENERATOR */}
            <section className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00ff9c]" />
                Interactive {role.jobTitle} Summary Generator
              </h2>
              <p className="text-zinc-400 text-xs mb-4">
                Input your specialized skills and click generate to build an ATS-friendly resume summary draft. You can copy it or load it directly in ChatCV.
              </p>
              <ResumeSummaryGenerator 
                initialRole={role.jobTitle} 
                initialSkills={role.atsKeywords.slice(0, 3).join(", ")} 
              />
            </section>

            {/* PRE-WRITTEN PROFESSIONAL SUMMARIES ARCHIVE */}
            <section className="scroll-mt-24 bg-zinc-900/10 border border-white/5 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">
                Professional {role.jobTitle} Resume Summary Examples
              </h2>
              <div className="space-y-6">
                {role.summaryExamples.map((item, index) => (
                  <div key={index} className="border-l-2 border-[#00ff9c]/20 pl-4 py-1">
                    <h4 className="text-sm font-bold text-[#00ff9c] uppercase tracking-wider mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans italic">
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* EXPERIENCE BULLET POINTS SECTION */}
            <section className="scroll-mt-24">
              <h2 className="text-xl font-black text-white mb-4">
                Job Accomplishments & Bullet Points for {role.jobTitle}
              </h2>
              <p className="text-zinc-400 text-xs mb-6">
                Recruiters look for action verbs and concrete, metrics-driven outcomes. Here are high-converting bullet point suggestions:
              </p>
              <div className="space-y-6">
                {role.bulletPoints.map((block, index) => (
                  <div key={index} className="bg-zinc-900/20 border border-white/5 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-[#00ff9c] mb-3">
                      {block.category}
                    </h4>
                    <ul className="space-y-3">
                      {block.points.map((pt, ptIndex) => (
                        <li key={ptIndex} className="text-xs sm:text-sm text-zinc-300 leading-relaxed flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#00ff9c] mt-0.5 flex-shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* RESUME TEMPLATE & SOURCE WIDGET */}
            <section className="scroll-mt-24">
              <h2 className="text-xl font-black text-white mb-4">
                Copyable LaTeX {role.jobTitle} Resume Template
              </h2>
              <p className="text-zinc-400 text-xs mb-4">
                LaTeX yields the most precise, clean spacing and passes modern ATS checks flawlessly. Copy the raw template source code or edit it on ChatCV.
              </p>
              <ResumePreviewWidget 
                roleName={role.jobTitle} 
                latexCode={role.latexCode} 
                skills={role.atsKeywords} 
              />
            </section>

            {/* FAQ SECTION */}
            <section className="scroll-mt-24">
              <h2 className="text-xl font-black text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {role.faqs.map((faq, index) => (
                  <div key={index} className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl">
                    <h4 className="font-bold text-white text-base mb-2">{faq.question}</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* SIDEBAR COLUMN */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            
            {/* CORE KEYWORDS/SKILLS CHECKLIST */}
            <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 border border-white/10 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00ff9c]" />
                Top ATS Skills Matrix
              </h3>
              <p className="text-[10px] text-zinc-400 leading-relaxed mb-6">
                Target resume skills to optimize formatting scores for {role.jobTitle} positions:
              </p>
              <div className="flex flex-wrap gap-2">
                {role.atsKeywords.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs bg-zinc-900/60 border border-white/5 px-3 py-1.5 rounded-xl text-zinc-300 font-medium hover:border-[#00ff9c]/20 hover:text-white transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* GENERAL PROMO CARD */}
            <BlogCTA type="sidebar" />

          </aside>

        </div>

        {/* RELATED ROLES LINKS */}
        {relatedRoles.length > 0 && (
          <div className="mt-20 pt-10 border-t border-white/10">
            <h3 className="text-xl font-black text-white mb-6">Other Resume Examples</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedRoles.map((rel) => (
                <Link
                  key={rel.role}
                  href={`/resume-examples/${rel.role}`}
                  className="p-4 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-[#00ff9c]/20 hover:bg-[#00ff9c]/5 transition-all text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-between"
                >
                  <span>{rel.jobTitle} Resume</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
