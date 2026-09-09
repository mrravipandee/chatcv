'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUpRight,
  Filter,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar
} from 'lucide-react';
import {
  getAdminBlogs,
  updateAdminBlogStatus,
  deleteAdminBlog
} from '@/lib/blogAdminApi';
import { BlogPost } from '@/types/blog';

export default function AdminBlogManagementPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'publishDate' | 'views' | 'title'>('publishDate');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Strict sorting helper (guarantees descending date: current/newest first, previous following)
  const sortArticles = (
    list: BlogPost[],
    field: 'publishDate' | 'views' | 'title',
    order: 'asc' | 'desc'
  ) => {
    return [...list].sort((a, b) => {
      if (field === 'publishDate') {
        const timeA = new Date(a.publishDate || a.createdAt || 0).getTime();
        const timeB = new Date(b.publishDate || b.createdAt || 0).getTime();
        return order === 'desc' ? timeB - timeA : timeA - timeB;
      }
      if (field === 'views') {
        const vA = Number(a.views) || 0;
        const vB = Number(b.views) || 0;
        return order === 'desc' ? vB - vA : vA - vB;
      }
      if (field === 'title') {
        return order === 'desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminBlogs(page, 20, statusFilter, searchQuery, sortBy, sortOrder);
      if (res.success && res.data) {
        setBlogs(sortArticles(res.data, sortBy, sortOrder));
        const meta = (res as any).meta;
        if (meta) {
          setTotalPages(meta.totalPages || 1);
          setTotalCount(meta.total || 0);
        }
      } else {
        // Fallback to public blog endpoint if admin session is unauthenticated in preview
        const fallbackRes = await fetch(`/api/blogs?limit=50&status=${statusFilter}`);
        if (fallbackRes.ok) {
          const json = await fallbackRes.json();
          if (Array.isArray(json.data)) {
            setBlogs(sortArticles(json.data, sortBy, sortOrder));
            setTotalCount(json.data.length);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load admin blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [page, statusFilter, sortBy, sortOrder]);

  const handleSortToggle = (field: 'publishDate' | 'views' | 'title') => {
    if (sortBy === field) {
      const nextOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      setSortOrder(nextOrder);
      setBlogs((prev) => sortArticles(prev, field, nextOrder));
    } else {
      setSortBy(field);
      setSortOrder('desc'); // Default to descending: current one first, previous below
      setBlogs((prev) => sortArticles(prev, field, 'desc'));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadBlogs();
  };

  const handleStatusToggle = async (blog: BlogPost) => {
    const id = blog._id || blog.id;
    if (!id) return;

    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      setActionLoading(id);
      const res = await updateAdminBlogStatus(id, newStatus, blog.slug);
      if (res.success) {
        setBlogs((prev) =>
          prev.map((b) => ((b._id || b.id) === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (blog: BlogPost) => {
    const id = blog._id || blog.id;
    if (!id) return;

    if (!window.confirm(`Are you sure you want to permanently delete "${blog.title}"?`)) {
      return;
    }

    try {
      setActionLoading(id);
      const res = await deleteAdminBlog(id, blog.slug);
      if (res.success) {
        setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete blog:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Stats calculation
  const publishedCount = blogs.filter((b) => b.status === 'published').length;
  const draftCount = blogs.filter((b) => b.status === 'draft').length;
  const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-md bg-[#00ff9c]/10 text-[#00ff9c] border border-[#00ff9c]/20">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#00ff9c] font-bold">
              Content Management System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Blog Articles & SEO Posts
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your articles, publish drafts, update SEO metadata, and monitor view telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadBlogs}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-[#00ff9c] hover:bg-[#00ff9c]/90 text-black shadow-lg shadow-[#00ff9c]/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold mb-2">
            <span>Total Articles</span>
            <Layers className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            {totalCount || blogs.length}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Live in database</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold mb-2">
            <span>Published</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {publishedCount}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Publicly indexable</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold mb-2">
            <span>Drafts</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {draftCount}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Unpublished work</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold mb-2">
            <span>Total Views</span>
            <Eye className="h-4 w-4 text-[#00ff9c]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            {totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Reader engagements</span>
        </div>
      </div>

      {/* FILTER, SORT & SEARCH BAR */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800/80">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 w-full lg:w-auto overflow-x-auto">
          {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer flex-1 lg:flex-initial ${
                statusFilter === status
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sort Controls & Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Quick Sort Selector */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs w-full sm:w-auto">
            <span className="text-zinc-400 text-[11px] font-medium whitespace-nowrap">Sort:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as [
                  'publishDate' | 'views' | 'title',
                  'desc' | 'asc'
                ];
                setSortBy(field);
                setSortOrder(order);
                setBlogs((prev) => sortArticles(prev, field, order));
              }}
              className="bg-transparent text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none cursor-pointer text-xs w-full"
            >
              <option value="publishDate-desc" className="bg-zinc-900 text-white">📅 Date: Newest First (Current → Previous)</option>
              <option value="publishDate-asc" className="bg-zinc-900 text-white">📅 Date: Oldest First (Previous → Current)</option>
              <option value="views-desc" className="bg-zinc-900 text-white">👁️ Views: High to Low</option>
              <option value="views-asc" className="bg-zinc-900 text-white">👁️ Views: Low to High</option>
              <option value="title-asc" className="bg-zinc-900 text-white">🔤 Title: A to Z</option>
              <option value="title-desc" className="bg-zinc-900 text-white">🔤 Title: Z to A</option>
            </select>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search articles by title, slug, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00ff9c]"
            />
          </form>
        </div>
      </div>

      {/* ARTICLES TABLE */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-8 w-8 text-[#00ff9c] animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-500 font-mono">Loading blog database...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="h-10 w-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">No blog posts found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No articles matched your search "${searchQuery}".`
                : 'No articles exist in this filter category yet.'}
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-[#00ff9c] text-black"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Post</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
              <thead className="bg-zinc-50 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800/80 text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                <tr>
                  <th
                    onClick={() => handleSortToggle('title')}
                    className="py-4 px-5 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 select-none transition-colors"
                    title="Click to sort by Title"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Article</span>
                      {sortBy === 'title' ? (
                        sortOrder === 'desc' ? (
                          <ArrowDown className="h-3.5 w-3.5 text-[#00ff9c]" />
                        ) : (
                          <ArrowUp className="h-3.5 w-3.5 text-[#00ff9c]" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-zinc-500 opacity-40 hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Author</th>
                  <th className="py-4 px-4">Status</th>
                  <th
                    onClick={() => handleSortToggle('views')}
                    className="py-4 px-4 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 select-none transition-colors"
                    title="Click to sort by Views"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Views</span>
                      {sortBy === 'views' ? (
                        sortOrder === 'desc' ? (
                          <ArrowDown className="h-3.5 w-3.5 text-[#00ff9c]" />
                        ) : (
                          <ArrowUp className="h-3.5 w-3.5 text-[#00ff9c]" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-zinc-500 opacity-40 hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortToggle('publishDate')}
                    className="py-4 px-4 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 select-none transition-colors"
                    title="Click to toggle: Current/Newest first vs Previous/Oldest first"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Publish Date</span>
                      {sortBy === 'publishDate' ? (
                        sortOrder === 'desc' ? (
                          <div className="flex items-center gap-1 text-[#00ff9c]">
                            <ArrowDown className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-mono tracking-tight lowercase">(newest)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[#00ff9c]">
                            <ArrowUp className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-mono tracking-tight lowercase">(oldest)</span>
                          </div>
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-zinc-500 opacity-40 hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                {blogs.map((blog) => {
                  const id = blog._id || blog.id || blog.slug;
                  const isPublished = blog.status === 'published';

                  return (
                    <tr
                      key={id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Title & Cover Image */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5 max-w-md">
                          <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                            {blog.featuredImage ? (
                              <Image
                                src={blog.featuredImage}
                                alt={blog.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                                <BookOpen className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 text-sm">
                              {blog.title}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400 font-mono">
                              <span>/{blog.slug}</span>
                              {blog.readingTime && (
                                <>
                                  <span>•</span>
                                  <span>{blog.readingTime} min read</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">
                          {blog.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                          {blog.author?.name || 'Admin'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(blog)}
                          disabled={actionLoading === id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isPublished
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20'
                          }`}
                          title="Click to toggle publication status"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          <span>{blog.status || (blog.draft ? 'draft' : 'published')}</span>
                        </button>
                      </td>

                      {/* Views */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-zinc-600 dark:text-zinc-400">
                        {blog.views || 0}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-[11px] text-zinc-500">
                        {new Date(blog.publishDate || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Public View Link */}
                          {isPublished && (
                            <Link
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                              title="View live post"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          )}

                          {/* Edit Button */}
                          <Link
                            href={`/admin/blog/${id}/edit`}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Edit article"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(blog)}
                            disabled={actionLoading === id}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION BAR */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-200 dark:border-zinc-800 text-xs">
            <span className="text-zinc-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
