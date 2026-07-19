import { Metadata } from "next";
import Link from "next/link";
import { getTags, getPostsByTag } from "@/lib/blog";
import { Tag, ArrowLeft, BookOpen, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog Tags | ChatCV Career Advice Hub",
  description: "Explore all keywords, categories, and topics across the ChatCV career and resume building blog. Find specific topics ranging from ATS keywords to LaTeX tips.",
  alternates: {
    canonical: "https://resume-builder-chatcv.vercel.app/blog/tag",
  },
  openGraph: {
    title: "Blog Tags | ChatCV Career Advice Hub",
    description: "Explore all keywords, categories, and topics across the ChatCV career and resume building blog.",
    url: "https://resume-builder-chatcv.vercel.app/blog/tag",
    type: "website",
    siteName: "ChatCV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Tags | ChatCV Career Advice Hub",
    description: "Explore all keywords, categories, and topics across the ChatCV career and resume building blog.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TagsIndexPage() {
  const tags = getTags();
  const baseUrl = "https://resume-builder-chatcv.vercel.app";
  const canonicalUrl = `${baseUrl}/blog/tag`;

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
        "name": "Tags",
        "item": canonicalUrl,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Blog Tags | ChatCV Career Advice Hub",
    "description": "Explore all keywords, categories, and topics across the ChatCV career and resume building blog.",
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": tags.map((tag, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${baseUrl}/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`,
        "name": `#${tag}`,
      })),
    },
  };

  // Sort tags by post counts descending
  const tagsWithCounts = tags.map((tag) => {
    const posts = getPostsByTag(tag);
    return { tag, count: posts.length };
  }).sort((a, b) => b.count - a.count);

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
            Popular Keywords
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-6 mb-6 tracking-tight leading-none">
            Topic <span className="bg-gradient-to-r from-[#00ff9c] to-emerald-400 bg-clip-text text-transparent">Tags</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Search or browse through specific tags and keywords to find focused advice, template formats, and technical guidelines.
          </p>
        </div>

        {/* Interactive Tag Cloud / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tagsWithCounts.map(({ tag, count }) => {
            const tagSlug = tag.toLowerCase().replace(/\s+/g, "-");
            
            return (
              <Link
                key={tag}
                href={`/blog/tag/${tagSlug}`}
                className="group flex items-center justify-between p-4 bg-gradient-to-b from-zinc-900/40 to-zinc-950/70 border border-white/5 hover:border-[#00ff9c]/30 rounded-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#00ff9c]/5 border border-[#00ff9c]/10 text-zinc-400 group-hover:text-[#00ff9c] group-hover:border-[#00ff9c]/20 p-2.5 rounded-xl transition-all">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-zinc-300 group-hover:text-white transition-colors">
                      #{tag}
                    </span>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">
                      {count} {count === 1 ? "article" : "articles"}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-[#00ff9c] transform group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
