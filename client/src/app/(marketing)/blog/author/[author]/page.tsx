import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, getPostsByAuthor } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";
import { ArrowLeft, Sparkles } from "lucide-react";

interface AuthorPageProps {
  params: Promise<{ author: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const authors = Array.from(new Set(posts.map((p) => p.author.slug)));
  return authors.map((authorSlug) => ({
    author: authorSlug,
  }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const posts = getAllPosts();
  const authorSlug = resolvedParams.author;
  const post = posts.find((p) => p.author.slug === authorSlug);
  
  if (!post) return {};

  return {
    title: `${post.author.name} - Author Profile | ChatCV`,
    description: post.author.bio,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const resolvedParams = await params;
  const authorSlug = resolvedParams.author;
  const posts = getAllPosts();
  
  // Find first post to retrieve author metadata
  const authorPost = posts.find((p) => p.author.slug === authorSlug);
  if (!authorPost) {
    notFound();
  }

  const author = authorPost.author;
  const authorPosts = getPostsByAuthor(authorSlug);
  const baseUrl = "https://resume-builder-chatcv.vercel.app";

  // PROFILE PAGE JSON-LD SCHEMA FOR EEAT
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": author.name,
      "description": author.bio,
      "image": author.avatar,
      "jobTitle": author.role,
      "sameAs": [
        author.linkedin || "",
        author.twitter || "",
      ].filter(Boolean),
    },
  };

  return (
    <main className="bg-black min-h-screen pt-28 pb-20 text-white">
      {/* SCHEMA INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-zinc-500 hover:text-[#00ff9c] text-xs font-bold flex items-center gap-1 mb-10 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </Link>

        {/* AUTHOR PROFILE HERO */}
        <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-white/10 rounded-3xl p-8 md:p-10 mb-16 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff9c] opacity-5 blur-3xl pointer-events-none rounded-full" />

          {/* Avatar */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-[#00ff9c]/20 bg-zinc-800 flex-shrink-0 shadow-lg">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="text-center md:text-left flex-grow">
            <span className="text-[10px] text-[#00ff9c] uppercase tracking-widest font-black bg-[#00ff9c]/10 px-2.5 py-1 rounded-full border border-[#00ff9c]/20 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Verified Writer
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-3 mb-1">
              {author.name}
            </h1>
            <p className="text-zinc-400 text-sm font-medium mb-4">{author.role} at ChatCV</p>
            <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl mb-6">
              {author.bio}
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-900 border border-white/5 hover:border-[#00ff9c]/20 rounded-xl text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
                >
                  <svg className="w-4 h-4 text-[#00ff9c]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
              {author.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-900 border border-white/5 hover:border-[#00ff9c]/20 rounded-xl text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
                >
                  <svg className="w-4 h-4 text-[#00ff9c]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ARTICLES LIST SECTION */}
        <div>
          <h2 className="text-xl font-black text-white mb-8 border-b border-white/5 pb-4">
            Articles Written by {author.name}
          </h2>
          {authorPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {authorPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900/20 border border-white/5 rounded-3xl">
              <p className="text-zinc-400">No posts found by this author.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
