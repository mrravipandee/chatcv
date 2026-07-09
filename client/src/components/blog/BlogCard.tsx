"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { Bookmark, Share2, Eye, Clock, Calendar, Check, Link2 } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(`${window.location.origin}/blog/${post.slug}`);
    
    // Check local storage for bookmark state
    const bookmarks = JSON.parse(localStorage.getItem("chatcv_bookmarks") || "[]");
    setBookmarked(bookmarks.includes(post.slug));
  }, [post.slug]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const bookmarks = JSON.parse(localStorage.getItem("chatcv_bookmarks") || "[]");
    let updated: string[];
    
    if (bookmarked) {
      updated = bookmarks.filter((slug: string) => slug !== post.slug);
    } else {
      updated = [...bookmarks, post.slug];
    }
    
    localStorage.setItem("chatcv_bookmarks", JSON.stringify(updated));
    setBookmarked(!bookmarked);
    
    // Dispatch event to update other client instances (like the sidebar reading history/bookmarks)
    window.dispatchEvent(new Event("bookmarksChanged"));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to share/copy link: ", err);
    }
  };

  // Consistent simulated views count based on post ID length to keep it static and stable
  const simulatedViews = (post.title.length * 17) + 142;

  const formattedDate = new Date(post.publishDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col h-full bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:border-[#00ff9c]/30 hover:shadow-[0_8px_30px_rgba(0,255,156,0.05)] transition-all duration-300"
    >
      {/* SHIMMER GLOW */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00ff9c]/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* COVER IMAGE CONTAINER */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-800 border-b border-white/5">
        <Image
          src={post.featuredImage}
          alt={post.imageAltText || post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-[1.04]"
        />

        {/* OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* CATEGORY TAG */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-[#00ff9c]">
          {post.category}
        </div>

        {/* FLOATING QUICK ACTIONS */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* BOOKMARK BUTTON */}
          <button
            onClick={toggleBookmark}
            className={`w-7 h-7 rounded-lg backdrop-blur-md border flex items-center justify-center transition-all duration-200 ${
              bookmarked
                ? "bg-[#00ff9c] border-[#00ff9c] text-black"
                : "bg-black/60 border-white/10 text-zinc-300 hover:text-white hover:border-white/20"
            }`}
            title={bookmarked ? "Bookmarked" : "Bookmark article"}
          >
            <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
          </button>

          {/* SHARE BUTTON */}
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 flex items-center justify-center transition-all duration-200 relative"
            title="Share or Copy Link"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#00ff9c]" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            {copied && (
              <span className="absolute right-0 -bottom-8 bg-zinc-950 border border-white/10 text-[9px] text-[#00ff9c] px-2 py-0.5 rounded whitespace-nowrap z-55">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ARTICLE DATA BODY */}
      <div className="flex flex-col flex-grow p-6">
        {/* METADATA LIST */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-zinc-600" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-600" />
            {post.readingTime} min read
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Eye className="w-3 h-3 text-zinc-600" />
            {simulatedViews} views
          </span>
        </div>

        {/* TITLE SECTION WITH ANIMATED HOVER SLIDER */}
        <Link href={`/blog/${post.slug}`} className="focus:outline-none group/title mb-3 block">
          <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
            {post.title}
          </h3>
          <span className="block h-[1px] bg-[#00ff9c] w-0 group-hover/title:w-full transition-all duration-300 mt-1" />
        </Link>

        {/* EXCERPT DESCR */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-6 flex-grow">
          {post.excerpt}
        </p>

        {/* FOOTER AUTHOR BLOCK */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 flex-shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-200">{post.author.name}</p>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none font-semibold mt-0.5">
                {post.author.role.split(" & ").pop() || "Contributor"}
              </p>
            </div>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-[11px] font-bold uppercase tracking-wider text-[#00ff9c] hover:text-[#00ff9c]/80 flex items-center gap-1 group/btn focus:outline-none transition-colors"
          >
            <span>Read</span>
            <svg
              className="w-3 h-3 transform transition-transform group-hover/btn:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.0" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
