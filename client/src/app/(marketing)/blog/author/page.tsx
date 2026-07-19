import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getPostsByAuthor } from "@/lib/blog";
import { ArrowLeft, BookOpen, ChevronRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Verified Authors & Contributors | ChatCV Career Advice Hub",
  description: "Meet the experts, resume writers, and career coaches behind ChatCV's professional advice, guide templates, and career resources.",
  alternates: {
    canonical: "https://resume-builder-chatcv.vercel.app/blog/author",
  },
  openGraph: {
    title: "Verified Authors & Contributors | ChatCV Career Advice Hub",
    description: "Meet the experts, resume writers, and career coaches behind ChatCV's professional advice.",
    url: "https://resume-builder-chatcv.vercel.app/blog/author",
    type: "website",
    siteName: "ChatCV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified Authors & Contributors | ChatCV Career Advice Hub",
    description: "Meet the experts, resume writers, and career coaches behind ChatCV's professional advice.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AuthorsIndexPage() {
  const posts = getAllPosts();
  
  // Find all unique authors by mapping them
  const uniqueAuthorsMap = new Map<string, typeof posts[0]["author"]>();
  posts.forEach((post) => {
    if (post.author && post.author.slug) {
      uniqueAuthorsMap.set(post.author.slug, post.author);
    }
  });
  
  const authors = Array.from(uniqueAuthorsMap.values());
  const baseUrl = "https://resume-builder-chatcv.vercel.app";
  const canonicalUrl = `${baseUrl}/blog/author`;

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
        "name": "Authors",
        "item": canonicalUrl,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Verified Authors & Contributors | ChatCV Career Advice Hub",
    "description": "Meet the experts, resume writers, and career coaches behind ChatCV's professional advice.",
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": authors.map((author, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${baseUrl}/blog/author/${author.slug}`,
        "name": author.name,
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
          <span className="bg-[#00ff9c]/10 border border-[#00ff9c]/20 text-[#00ff9c] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Editorial Staff
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-6 mb-6 tracking-tight leading-none">
            Verified <span className="bg-gradient-to-r from-[#00ff9c] to-emerald-400 bg-clip-text text-transparent">Authors</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Read professional insights, recruitment guides, and typesetting analysis from our team of industry professionals and verified coaches.
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {authors.map((author) => {
            const authorPosts = getPostsByAuthor(author.slug);

            return (
              <div
                key={author.slug}
                className="bg-gradient-to-br from-zinc-950 to-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:border-[#00ff9c]/30 hover:shadow-[0_8px_30px_rgba(0,255,156,0.04)] transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff9c] opacity-[0.02] blur-2xl pointer-events-none rounded-full" />

                {/* Avatar */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-zinc-800 flex-shrink-0 shadow-lg">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info and Details */}
                <div className="flex-grow text-center sm:text-left flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {author.name}
                    </h3>
                    <p className="text-xs text-[#00ff9c] font-semibold mt-1">
                      {author.role}
                    </p>
                    <p className="text-zinc-400 text-xs leading-relaxed mt-4 mb-4 line-clamp-3">
                      {author.bio}
                    </p>
                  </div>

                  <div className="flex items-center justify-center sm:justify-between border-t border-white/5 pt-4 mt-auto">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-600" />
                      {authorPosts.length} {authorPosts.length === 1 ? "article" : "articles"}
                    </span>
                    <Link
                      href={`/blog/author/${author.slug}`}
                      className="group/btn hidden sm:flex items-center gap-1 text-xs font-bold text-[#00ff9c] hover:underline"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-all" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
