'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Heading,
  AlignLeft,
  List,
  Code,
  AlertCircle,
  Table as TableIcon,
  HelpCircle,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react';
import { BlogPost, ContentBlock, FAQItem } from '@/types/blog';
import { createAdminBlog, updateAdminBlog } from '@/lib/blogAdminApi';

interface BlogEditorProps {
  initialData?: Partial<BlogPost>;
  isEditing?: boolean;
}

export default function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [category, setCategory] = useState(initialData?.category || 'AI Resume Builder');
  const [tags, setTags] = useState<string[]>(initialData?.tags || ['AI Resume Builder', 'Resume Tips']);
  const [newTagInput, setNewTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage || '/resume-builder-chatcv-best-ai-resume-builder-in-2026-free-and-ats-friendly-guide.png'
  );
  const [imageAltText, setImageAltText] = useState(initialData?.imageAltText || '');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(initialData?.status || 'draft');
  const [featured, setFeatured] = useState(initialData?.featured || false);

  // Author State
  const [authorName, setAuthorName] = useState(initialData?.author?.name || 'Ravi Pandey');
  const [authorRole, setAuthorRole] = useState(initialData?.author?.role || 'Founder & Technical Architect');
  const [authorAvatar, setAuthorAvatar] = useState(
    initialData?.author?.avatar ||
      'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1740&auto=format&fit=crop'
  );
  const [authorBio, setAuthorBio] = useState(
    initialData?.author?.bio || 'Full-stack engineer and tech founder helping developers optimize their careers.'
  );

  // SEO State
  const [metaTitle, setMetaTitle] = useState(initialData?.seo?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.seo?.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(initialData?.seo?.focusKeyword || '');
  const [searchIntent, setSearchIntent] = useState<'informational' | 'transactional' | 'commercial' | 'navigational'>(
    initialData?.seo?.searchIntent || 'informational'
  );
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.seo?.canonicalUrl || '');
  const [noIndex, setNoIndex] = useState(initialData?.seo?.noIndex || false);

  // Structured Content Blocks
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialData?.content && initialData.content.length > 0
      ? initialData.content
      : [
          { type: 'paragraph', text: 'Write your introductory paragraph here...' },
          { type: 'heading', level: 2, text: 'First Main Section' },
          { type: 'paragraph', text: 'Expand on your arguments with actionable advice and examples.' }
        ]
  );

  // FAQs State
  const [faqs, setFaqs] = useState<FAQItem[]>(initialData?.faqs || []);

  // CTA State
  const [ctaTitle, setCtaTitle] = useState(initialData?.cta?.title || 'Build Your ATS-Ready Resume with AI');
  const [ctaDesc, setCtaDesc] = useState(
    initialData?.cta?.description || 'Chat with our AI assistant to structure bullet points and download your LaTeX PDF in seconds.'
  );
  const [ctaBtnText, setCtaBtnText] = useState(initialData?.cta?.buttonText || 'Create Resume Free');
  const [ctaBtnLink, setCtaBtnLink] = useState(initialData?.cta?.buttonLink || '/dashboard');

  // Auto-generate slug from title if slug not manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  // Tag Management
  const addTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim();
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setNewTagInput('');
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Content Block Management
  const addBlock = (type: ContentBlock['type']) => {
    let newBlock: ContentBlock = { type };
    if (type === 'heading') {
      newBlock = { type: 'heading', level: 2, text: 'New Heading' };
    } else if (type === 'paragraph') {
      newBlock = { type: 'paragraph', text: 'Type your paragraph content here...' };
    } else if (type === 'list') {
      newBlock = { type: 'list', ordered: false, items: ['Key takeaway point 1', 'Key takeaway point 2'] };
    } else if (type === 'callout') {
      newBlock = { type: 'callout', style: 'info', text: 'Important tip or alert message for readers.' };
    } else if (type === 'code') {
      newBlock = { type: 'code', language: 'typescript', code: '// Add example code here\nconst x = 10;' };
    } else if (type === 'image') {
      newBlock = { type: 'image', src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4', alt: 'Illustration', caption: 'Image caption' };
    }
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updated: Partial<ContentBlock>) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, ...updated } : b))
    );
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    const newBlocks = [...blocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[target];
    newBlocks[target] = temp;
    setBlocks(newBlocks);
  };

  // FAQ Management
  const addFaq = () => {
    setFaqs([...faqs, { question: 'Frequently Asked Question', answer: 'Clear, concise answer explaining this topic.' }]);
  };

  const updateFaq = (index: number, key: 'question' | 'answer', value: string) => {
    setFaqs((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [key]: value } : f))
    );
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent, forceStatus?: 'draft' | 'published') => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const activeStatus = forceStatus || status;

    if (!title.trim() || !slug.trim() || !excerpt.trim()) {
      setErrorMessage('Please fill in required fields: Title, Slug, and Excerpt.');
      return;
    }

    const payload: Partial<BlogPost> = {
      title,
      slug,
      subtitle,
      excerpt,
      category,
      tags,
      featuredImage,
      imageAltText: imageAltText || title,
      status: activeStatus,
      featured,
      author: {
        name: authorName,
        slug: authorName.toLowerCase().replace(/\s+/g, '-'),
        role: authorRole,
        avatar: authorAvatar,
        bio: authorBio,
      },
      content: blocks,
      faqs: faqs.length > 0 ? faqs : undefined,
      cta: {
        title: ctaTitle,
        description: ctaDesc,
        buttonText: ctaBtnText,
        buttonLink: ctaBtnLink,
        type: 'banner',
      },
      seo: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        focusKeyword: focusKeyword || title,
        secondaryKeywords: tags,
        difficulty: 'medium',
        contentType: 'guide',
        searchIntent,
        canonicalUrl: canonicalUrl || undefined,
        noIndex,
      },
      language: 'en',
    };

    try {
      setIsSubmitting(true);
      let res;
      const targetId = initialData?._id || initialData?.id;

      if (isEditing && targetId) {
        res = await updateAdminBlog(targetId, payload);
      } else {
        res = await createAdminBlog(payload);
      }

      if (res.success) {
        setSuccessMessage(`Post successfully ${activeStatus === 'published' ? 'published' : 'saved as draft'}!`);
        setTimeout(() => {
          router.push('/admin/blog');
        }, 1200);
      } else {
        setErrorMessage(res.message || 'Failed to save blog post.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-20 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
              {isEditing ? 'Edit Blog Article' : 'Compose New Article'}
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Slug: /blog/{slug || 'untitled-post'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer"
          >
            <Save className="h-3.5 w-3.5 inline mr-1.5" />
            Save Draft
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#00ff9c] hover:bg-[#00ff9c]/90 text-black shadow-md shadow-[#00ff9c]/20 transition-all cursor-pointer"
          >
            <Send className="h-3.5 w-3.5 inline mr-1.5" />
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </div>

      {/* FEEDBACK ALERTS */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. CORE ARTICLE DETAILS */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
          1. Core Content & Taxonomy
        </h2>

        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
            Article Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Best AI Resume Builder in 2026: Free & ATS-Friendly Guide"
            className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00ff9c]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="best-ai-resume-builder"
              className="w-full px-4 py-2.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00ff9c]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Primary Category *
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. AI Resume Builder, LaTeX Resumes, ATS Optimization"
              className="w-full px-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00ff9c]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
            Article Subtitle / Secondary Heading
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Discover the top tools of the year and learn how to optimize your resume with AI."
            className="w-full px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00ff9c]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
            Excerpt / Meta Snippet *
          </label>
          <textarea
            rows={2}
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A compelling 1-2 sentence overview used for social cards, RSS, and the blog grid..."
            className="w-full px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#00ff9c]"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
            Tags & Keywords
          </label>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {tags.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#00ff9c]/10 text-[#00ff9c] border border-[#00ff9c]/20 text-xs font-medium"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="hover:text-rose-400 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add new tag (press Enter)"
              className="px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Featured Image URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Cover Image URL *
            </label>
            <input
              type="text"
              required
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="/resume-builder-chatcv.png or https://images.unsplash.com/..."
              className="w-full px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Image Alt Description
            </label>
            <input
              type="text"
              value={imageAltText}
              onChange={(e) => setImageAltText(e.target.value)}
              placeholder="Modern workspace laptop showing ChatCV"
              className="w-full px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. STRUCTURED CONTENT BLOCKS */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              2. Structured Article Blocks
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Build your article using structured elements for headings, paragraphs, lists, code, and callouts.
            </p>
          </div>

          {/* Add Block Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => addBlock('paragraph')}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1"
            >
              <AlignLeft className="h-3.5 w-3.5" /> + Paragraph
            </button>
            <button
              type="button"
              onClick={() => addBlock('heading')}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1"
            >
              <Heading className="h-3.5 w-3.5" /> + Heading
            </button>
            <button
              type="button"
              onClick={() => addBlock('list')}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1"
            >
              <List className="h-3.5 w-3.5" /> + List
            </button>
            <button
              type="button"
              onClick={() => addBlock('callout')}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1"
            >
              <AlertCircle className="h-3.5 w-3.5" /> + Callout
            </button>
            <button
              type="button"
              onClick={() => addBlock('code')}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1"
            >
              <Code className="h-3.5 w-3.5" /> + Code
            </button>
          </div>
        </div>

        {/* Blocks Render List */}
        <div className="space-y-4 pt-2">
          {blocks.map((block, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/90 relative group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Block {idx + 1}: {block.type}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 'down')}
                    disabled={idx === blocks.length - 1}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(idx)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 cursor-pointer ml-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Specific Block Form Controls */}
              {block.type === 'heading' && (
                <div className="flex gap-2 items-center">
                  <select
                    value={block.level || 2}
                    onChange={(e) => updateBlock(idx, { level: Number(e.target.value) as any })}
                    className="px-2 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-300"
                  >
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                    <option value={4}>H4</option>
                  </select>
                  <input
                    type="text"
                    value={block.text || ''}
                    onChange={(e) => updateBlock(idx, { text: e.target.value })}
                    placeholder="Enter heading text..."
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-100 font-bold"
                  />
                </div>
              )}

              {block.type === 'paragraph' && (
                <textarea
                  rows={3}
                  value={block.text || ''}
                  onChange={(e) => updateBlock(idx, { text: e.target.value })}
                  placeholder="Enter paragraph text (markdown **bold** and [links](/url) supported)..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-300 font-sans leading-relaxed"
                />
              )}

              {block.type === 'list' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-[11px] text-zinc-400">
                      <input
                        type="checkbox"
                        checked={block.ordered || false}
                        onChange={(e) => updateBlock(idx, { ordered: e.target.checked })}
                        className="mr-1.5"
                      />
                      Numbered (Ordered) list
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={(block.items || []).join('\n')}
                    onChange={(e) =>
                      updateBlock(idx, {
                        items: e.target.value.split('\n').filter((l) => l.trim() !== ''),
                      })
                    }
                    placeholder="Enter each list item on a new line..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-300 font-mono"
                  />
                </div>
              )}

              {block.type === 'callout' && (
                <div className="space-y-2">
                  <select
                    value={block.style || 'info'}
                    onChange={(e) => updateBlock(idx, { style: e.target.value as any })}
                    className="px-2 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-300 mb-1"
                  >
                    <option value="info">Info Callout</option>
                    <option value="warning">Warning Alert</option>
                    <option value="success">Success Box</option>
                  </select>
                  <textarea
                    rows={2}
                    value={block.text || ''}
                    onChange={(e) => updateBlock(idx, { text: e.target.value })}
                    placeholder="Enter callout note text..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-300"
                  />
                </div>
              )}

              {block.type === 'code' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={block.language || 'typescript'}
                    onChange={(e) => updateBlock(idx, { language: e.target.value })}
                    placeholder="Language (e.g. typescript, bash, json)"
                    className="px-3 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-300 w-48"
                  />
                  <textarea
                    rows={4}
                    value={block.code || ''}
                    onChange={(e) => updateBlock(idx, { code: e.target.value })}
                    placeholder="Paste code snippet..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-300 font-mono"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. FAQS SECTION */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              3. Structured FAQ Schema (JSON-LD)
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Add Q&A pairs that automatically render in article schema and Google rich search snippets.
            </p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> + Add FAQ
          </button>
        </div>

        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-400">Question {idx + 1}</span>
              <button
                type="button"
                onClick={() => removeFaq(idx)}
                className="text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={faq.question}
              onChange={(e) => updateFaq(idx, 'question', e.target.value)}
              placeholder="e.g. Is ChatCV completely free to use?"
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-100 font-bold"
            />
            <textarea
              rows={2}
              value={faq.answer}
              onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
              placeholder="e.g. Yes, you can generate your initial resume and download the compiled LaTeX PDF for free."
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-300"
            />
          </div>
        ))}
      </div>

      {/* 4. SEO & SEARCH AUDIT METADATA */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
          4. Search Engine Optimization (SEO)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Custom Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder={title || 'Leave blank to use article title'}
              className="w-full px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Focus Search Keyword
            </label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="e.g. best ai resume builder"
              className="w-full px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
            Custom Meta Description
          </label>
          <textarea
            rows={2}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder={excerpt || 'Leave blank to use excerpt'}
            className="w-full px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-100"
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded border-zinc-700"
            />
            <span>Highlight as Featured Article</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={noIndex}
              onChange={(e) => setNoIndex(e.target.checked)}
              className="rounded border-zinc-700"
            />
            <span>Exclude from Search Crawlers (noindex)</span>
          </label>
        </div>
      </div>
    </form>
  );
}
