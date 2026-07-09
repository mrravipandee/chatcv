import { Metadata } from "next";
import Link from "next/link";
import { getTags, getPostsByTag } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";
import { ArrowLeft } from "lucide-react";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getTags();
  return tags.map((tag) => ({
    tag: tag.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tagLabel = resolvedParams.tag.replace(/-/g, " ");

  return {
    title: `#${tagLabel} Articles | ChatCV Blog`,
    description: `Read career guides, templates, and resume building tips tagged with #${tagLabel} on the ChatCV blog.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params;
  const rawTag = resolvedParams.tag;

  // Find tags matching slugified param
  const allTags = getTags();
  const matchedTag = allTags.find(
    (t) => t.toLowerCase().replace(/\s+/g, "-") === rawTag
  ) || rawTag;

  const posts = getPostsByTag(matchedTag);

  return (
    <main className="bg-black min-h-screen pt-28 pb-20 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-zinc-500 hover:text-[#00ff9c] text-xs font-bold flex items-center gap-1 mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </Link>

        <div className="mb-12">
          <span className="text-xs text-[#00ff9c] uppercase font-black tracking-widest bg-[#00ff9c]/10 px-3 py-1 rounded-full border border-[#00ff9c]/20">
            Tag Archive
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-4 lowercase">
            #{matchedTag}
          </h1>
          <p className="text-zinc-400 text-sm mt-3">
            Showing {posts.length} {posts.length === 1 ? "article" : "articles"} with this tag
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/20 border border-white/5 rounded-3xl">
            <p className="text-zinc-400">No posts found with this tag.</p>
          </div>
        )}
      </div>
    </main>
  );
}
