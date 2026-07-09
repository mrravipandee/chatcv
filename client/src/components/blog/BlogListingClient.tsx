"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { BlogPost } from "@/types/blog";
import BlogCard from "./BlogCard";
import { Search, Tag, FolderOpen, Flame, Newspaper, Sparkles, Mail, TrendingUp, History, Check, ArrowRight, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface BlogListingClientProps {
  initialPosts: BlogPost[];
  categories: string[];
  tags: string[];
}

export default function BlogListingClient({
  initialPosts,
  categories,
  tags,
}: BlogListingClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  
  // Bookmarks & history state loaded client-side
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Keyboard Shortcut listener (⌘K or / to focus search)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // 2. Load recent searches, bookmarks from localStorage
    const savedSearches = JSON.parse(localStorage.getItem("chatcv_recent_searches") || "[]");
    setRecentSearches(savedSearches.slice(0, 3));

    const loadBookmarks = () => {
      const savedBookmarks = JSON.parse(localStorage.getItem("chatcv_bookmarks") || "[]");
      setBookmarkedSlugs(savedBookmarks);
    };
    loadBookmarks();

    // Listen to bookmark changes from other components
    window.addEventListener("bookmarksChanged", loadBookmarks);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("bookmarksChanged", loadBookmarks);
    };
  }, []);

  const addSearchQueryToHistory = (query: string) => {
    if (!query.trim()) return;
    const history = JSON.parse(localStorage.getItem("chatcv_recent_searches") || "[]") as string[];
    const updated = [query, ...history.filter((q) => q !== query)].slice(0, 5);
    localStorage.setItem("chatcv_recent_searches", JSON.stringify(updated));
    setRecentSearches(updated.slice(0, 3));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSearchQueryToHistory(searchQuery);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
  };

  // Filter posts based on search query, category, and tag
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory
        ? post.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;

      const matchesTag = selectedTag
        ? post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
        : true;

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [initialPosts, searchQuery, selectedCategory, selectedTag]);

  // Extract featured post
  const featuredPost = useMemo(() => {
    return initialPosts.find((p) => p.featured) || initialPosts[0];
  }, [initialPosts]);

  // Remaining posts for grid (excluding featured)
  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    if (selectedCategory || selectedTag || searchQuery) {
      return filteredPosts;
    }
    return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
  }, [filteredPosts, featuredPost, selectedCategory, selectedTag, searchQuery]);

  // Calculate posts counts per category for UI indicators
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialPosts.forEach((post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [initialPosts]);

  // Filter bookmarked articles list for history sidebar
  const bookmarkedPosts = useMemo(() => {
    return initialPosts.filter((p) => bookmarkedSlugs.includes(p.slug));
  }, [initialPosts, bookmarkedSlugs]);

  // Simulated popular/trending posts sidebar listing
  const popularPosts = useMemo(() => {
    return [...initialPosts]
      .sort((a, b) => b.title.length - a.title.length) // stable simulation
      .slice(0, 3);
  }, [initialPosts]);

  return (
    <div className="w-full relative min-h-screen text-white bg-black overflow-hidden">
      
      {/* BACKGROUND MESH GRID & GLOWS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(0,255,156,0.08),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-[#00ff9c]/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

      {/* NOISE OVERLAY */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        
        {/* PREMIUM HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-20 relative">
          {/* FLOATING DECORATORS (Simulating resume chips) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[-15%] top-[10%] hidden lg:flex items-center gap-2 bg-zinc-900/50 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl shadow-xl rotate-[-6deg]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00ff9c]" />
            <span className="text-[10px] font-bold text-zinc-300 font-mono">LaTeX Export</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-[-15%] top-[50%] hidden lg:flex items-center gap-2 bg-zinc-900/50 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl shadow-xl rotate-[8deg]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00ff9c]" />
            <span className="text-[10px] font-bold text-zinc-300 font-mono">AI Resume Maker</span>
          </motion.div>

          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#00ff9c]/10 border border-[#00ff9c]/20 px-3.5 py-1.5 rounded-full mb-6 cursor-pointer hover:bg-[#00ff9c]/15 transition-all"
          >
            <span className="text-[9px] uppercase tracking-widest text-[#00ff9c] font-black">
              ★ Trusted by 50,000+ Job Seekers
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mt-2 mb-6 leading-[1.08] tracking-tight text-white font-sans">
            Write Your Way to a <span className="bg-gradient-to-r from-[#00ff9c] via-emerald-400 to-[#00ff9c] bg-clip-text text-transparent bg-[size:200%_auto] animate-pulse">Better Career</span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Expert resume writing advice, key ATS optimizations, LaTeX formatting tips, and career tools to unlock top-tier tech jobs.
          </p>

          {/* PREMIUM SEARCH BAR CONTAINER */}
          <div className="mt-12 relative max-w-xl mx-auto">
            <form onSubmit={handleSearchSubmit}>
              <motion.div
                animate={{ scale: isSearchFocused ? 1.01 : 1 }}
                className={`relative flex items-center bg-zinc-900/60 backdrop-blur-xl border rounded-2xl transition-all shadow-2xl ${
                  isSearchFocused
                    ? "border-[#00ff9c]/40 shadow-[0_0_30px_rgba(0,255,156,0.1)]"
                    : "border-white/10"
                }`}
              >
                <Search className={`w-5 h-5 absolute left-4 transition-colors ${isSearchFocused ? "text-[#00ff9c]" : "text-zinc-500"}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates, optimization guides, keywords..."
                  className="w-full bg-transparent pl-12 pr-20 py-4.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
                
                {/* Keyboard Shortcut Chip */}
                <div className="absolute right-4 text-[10px] font-mono text-zinc-500 bg-zinc-800 border border-white/5 px-2 py-0.5 rounded-lg pointer-events-none">
                  ⌘K
                </div>
              </motion.div>
            </form>

            {/* SEARCH DROPDOWN OVERLAYS (Shown when focused) */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-3 p-4 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl text-left shadow-3xl z-40"
                >
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-wider flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" /> Recent Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term, i) => (
                          <button
                            key={i}
                            onMouseDown={() => setSearchQuery(term)}
                            className="text-[11px] bg-zinc-900 border border-white/5 hover:border-white/20 px-2.5 py-1 rounded-xl text-zinc-300 hover:text-white transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["ATS Optimization", "LaTeX Source Template", "AI Resume Summary"].map((term, i) => (
                        <button
                          key={i}
                          onMouseDown={() => {
                            setSearchQuery(term);
                            addSearchQueryToHistory(term);
                          }}
                          className="text-[11px] bg-zinc-900 border border-white/5 hover:border-white/20 px-2.5 py-1 rounded-xl text-zinc-300 hover:text-white transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* HERO FEATURED ARTICLE CARD (Only shown when no search filters are applied) */}
        {!selectedCategory && !selectedTag && !searchQuery && featuredPost && (
          <div className="mb-24">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-orange-500" />
              Featured Editorial
            </h2>

            <Link href={`/blog/${featuredPost.slug}`} className="group block focus:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-zinc-900/20 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-[#00ff9c]/30 hover:shadow-[0_12px_40px_rgba(0,255,156,0.04)] transition-all duration-500 relative overflow-hidden">
                {/* Image panel */}
                <div className="relative aspect-[16/10] lg:col-span-7 rounded-2xl overflow-hidden bg-zinc-800 border border-white/5 shadow-inner">
                  <Image
                    src={featuredPost.featuredImage}
                    alt={featuredPost.imageAltText || featuredPost.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Text panel */}
                <div className="flex flex-col justify-between lg:col-span-5 py-4">
                  <div>
                    <span className="bg-[#00ff9c]/10 text-[#00ff9c] border border-[#00ff9c]/25 text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                      {featuredPost.category}
                    </span>
                    
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-6 mb-4 leading-snug group-hover:text-[#00ff9c] transition-colors duration-300">
                      {featuredPost.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-4">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-zinc-800 border border-white/10">
                        <Image
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-200">{featuredPost.author.name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5">
                          {new Date(featuredPost.publishDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })} • {featuredPost.readingTime} min read
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#00ff9c] text-black font-extrabold text-xs px-5 py-3 rounded-xl shadow-[0_4px_15px_rgba(0,255,156,0.25)] group-hover:bg-white group-hover:shadow-[0_4px_25px_rgba(255,255,255,0.2)] transition-all">
                      Read Post
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* CLASSIFIED PILLS NAVIGATION */}
        <div className="mb-12 border-b border-white/5 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedTag(null);
              }}
              className={`relative text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                selectedCategory === null && selectedTag === null
                  ? "bg-[#00ff9c] text-black"
                  : "bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-white"
              }`}
            >
              All Articles
            </button>
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory?.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedTag(null);
                  }}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#00ff9c] text-black"
                      : "bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-black/20 text-black" : "bg-black/40 text-zinc-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DUAL COLUMN SYSTEM: POSTS GRID & ADVANCED EDITORIAL SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* MAIN POSTS COLUMN (9 COLS) */}
          <div className="lg:col-span-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[#00ff9c]" />
              {selectedCategory || selectedTag || searchQuery
                ? `Results (${filteredPosts.length})`
                : "Editorial Feed"}
            </h2>

            {gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {gridPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/10 border border-dashed border-white/10 rounded-3xl">
                <p className="text-zinc-500 text-sm">No articles matched your filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedTag(null);
                  }}
                  className="mt-4 text-[#00ff9c] text-xs font-bold hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* ADVANCED EDITORIAL SIDEBAR (4 COLS) */}
          <aside className="lg:col-span-4 space-y-10">
            
            {/* NEWSLETTER CAPTURE CARD */}
            <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff9c] opacity-5 blur-2xl pointer-events-none rounded-full" />
              <div className="relative z-10">
                <div className="bg-[#00ff9c]/10 border border-[#00ff9c]/20 p-2 rounded-xl text-[#00ff9c] w-fit mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-white mb-2 leading-snug">
                  Subscribe to the Resume Handbook
                </h4>
                <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                  Join 12,000+ builders receiving monthly guides to resume writing and salary negotiation.
                </p>

                {newsletterSubscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-950/30 border border-[#00ff9c]/20 p-3 rounded-xl flex items-center justify-center gap-2 text-[#00ff9c]"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-bold">Successfully Subscribed!</span>
                  </motion.div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#00ff9c]/50 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#00ff9c] text-black font-extrabold text-xs py-2.5 rounded-xl hover:bg-white transition-all shadow-[0_4px_15px_rgba(0,255,156,0.15)] flex items-center justify-center gap-1"
                    >
                      <span>Join Free</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* POPULAR ARTICLES LIST */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6">
              <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-extrabold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <TrendingUp className="w-4 h-4 text-[#00ff9c]" />
                Trending Guides
              </h4>
              <div className="space-y-4.5">
                {popularPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block focus:outline-none">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#00ff9c] mb-1">
                        {post.category}
                      </span>
                      <h5 className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* LOCAL READING BOOKMARKS HISTORY (Client-side localStorage check) */}
            {bookmarkedPosts.length > 0 && (
              <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6">
                <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-extrabold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                  <Bookmark className="w-4 h-4 text-[#00ff9c]" />
                  Saved Articles
                </h4>
                <div className="space-y-3.5">
                  {bookmarkedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block focus:outline-none">
                      <h5 className="text-xs font-semibold text-zinc-400 group-hover:text-[#00ff9c] transition-colors line-clamp-1">
                        {post.title}
                      </h5>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* POPULAR TAGS CLOUD */}
            <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6">
              <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-extrabold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <Tag className="w-4 h-4 text-[#00ff9c]" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(isSelected ? null : tag);
                        setSelectedCategory(null);
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-[#00ff9c] border-[#00ff9c] text-black"
                          : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
