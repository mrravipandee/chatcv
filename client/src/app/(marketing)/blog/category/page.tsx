import { Metadata } from "next";
import Link from "next/link";
import { getCategories, getPostsByCategory } from "@/lib/blog";
import { FolderOpen, ChevronRight, ArrowLeft, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog Categories | ChatCV Career Advice Hub",
  description: "Browse our career guides, resume templates, and ATS optimization advice organized by categories like AI Resume Builder, LaTeX Resumes, and Interview Tips.",
  alternates: {
    canonical: "https://resume-builder-chatcv.vercel.app/blog/category",
  },
  openGraph: {
    title: "Blog Categories | ChatCV Career Advice Hub",
    description: "Browse our career guides, resume templates, and ATS optimization advice organized by category.",
    url: "https://resume-builder-chatcv.vercel.app/blog/category",
    type: "website",
    siteName: "ChatCV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Categories | ChatCV Career Advice Hub",
    description: "Browse our career guides, resume templates, and ATS optimization advice organized by category.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Generates brief default description matching each category
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "ai resume builder": "Leverage advanced artificial intelligence to craft, optimize, and edit professional resume summaries and layouts.",
    "latex resumes": "Discover the power of typesetting LaTeX CV templates, including copyable code snippets and compilation guides.",
    "ats optimization": "Beat the Applicant Tracking System scanners by formatting keywords and formatting correctly.",
    "career advice": "General strategies for negotiating salary, applying to tech jobs, and accelerating your career path.",
    "resume tips": "Actionable, concrete recommendations for bullet points, resume formatting, and layout structure.",
  };
  return descriptions[category.toLowerCase()] || `Explore expert guides, deep dives, and tips in our ${category} editorial hub.`;
}

export default function CategoriesIndexPage() {
  const categories = getCategories();
  const baseUrl = "https://resume-builder-chatcv.vercel.app";
  const canonicalUrl = `${baseUrl}/blog/category`;

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
        "name": "Blog",
        "item": `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Categories",
        "item": canonicalUrl,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Blog Categories | ChatCV Career Advice Hub",
    "description": "Browse our career guides, resume templates, and ATS optimization advice organized by categories.",
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": categories.map((cat, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${baseUrl}/blog/category/${cat.toLowerCase().replace(/\s+/g, "-")}`,
        "name": cat,
      })),
    },
  };

  return (
    <main className="bg-black min-h-screen pt-28 pb-20 text-white relative">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(0,255,156,0.06),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link href="/blog" className="text-zinc-500 hover:text-[#00ff9c] text-xs font-bold flex items-center gap-1 mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </Link>

        {/* Hero Section */}
        <div className="mb-16">
          <span className="bg-[#00ff9c]/10 border border-[#00ff9c]/20 text-[#00ff9c] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Explore Topics
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-6 mb-6 tracking-tight leading-none">
            Blog <span className="bg-gradient-to-r from-[#00ff9c] to-emerald-400 bg-clip-text text-transparent">Categories</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Navigate through our specialized editorial categories to find guides, walkthroughs, templates, and frameworks for job search acceleration.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const posts = getPostsByCategory(cat);
            const categorySlug = cat.toLowerCase().replace(/\s+/g, "-");
            const desc = getCategoryDescription(cat);

            return (
              <Link
                key={cat}
                href={`/blog/category/${categorySlug}`}
                className="group flex flex-col justify-between p-6 bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 backdrop-blur-xl border border-white/10 hover:border-[#00ff9c]/30 rounded-3xl hover:shadow-[0_8px_30px_rgba(0,255,156,0.04)] transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff9c] opacity-0 group-hover:opacity-5 blur-2xl pointer-events-none rounded-full transition-opacity duration-300" />
                
                <div>
                  <div className="bg-[#00ff9c]/10 border border-[#00ff9c]/20 text-[#00ff9c] p-3 rounded-2xl w-fit mb-6 transition-colors group-hover:bg-[#00ff9c]/20">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-lg font-black text-white group-hover:text-[#00ff9c] transition-colors leading-snug mb-3">
                    {cat}
                  </h3>
                  
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-6">
                    {desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-600" />
                    {posts.length} {posts.length === 1 ? "article" : "articles"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#00ff9c] transform group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
