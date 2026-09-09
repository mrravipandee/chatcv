'use client';

import React, { useEffect, useState, use } from 'react';
import BlogEditor from '@/components/admin/blog/BlogEditor';
import { getAdminBlogById } from '@/lib/blogAdminApi';
import { BlogPost } from '@/types/blog';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const res = await getAdminBlogById(resolvedParams.id);
        if (res.success && res.data) {
          setBlog(res.data);
        } else {
          setError(res.message || 'Failed to load blog data');
        }
      } catch (err: any) {
        setError(err.message || 'Error connecting to server');
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="py-32 text-center">
        <RefreshCw className="h-8 w-8 text-[#00ff9c] animate-spin mx-auto mb-3" />
        <p className="text-xs text-zinc-500 font-mono">Loading post for editing...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 max-w-lg mx-auto text-center mt-20">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-rose-500" />
        <h3 className="font-bold text-sm">Could not find article</h3>
        <p className="text-xs mt-1 text-rose-300">{error || 'Article not found'}</p>
      </div>
    );
  }

  return <BlogEditor initialData={blog} isEditing={true} />;
}
