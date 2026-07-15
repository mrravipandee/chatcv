import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ChevronRight, MessageSquare, Sparkles } from "lucide-react";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { ContentBlock } from "@/types/blog";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import BlogCTA from "@/components/blog/BlogCTA";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) return {};

  const baseUrl = "https://resume-builder-chatcv.vercel.app";
  const canonicalUrl = post.seo.canonicalUrl || `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.seo.metaTitle || `${post.title} | ChatCV Blog`,
    description: post.seo.metaDescription || post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.seo.metaTitle || post.title,
      description: post.seo.metaDescription || post.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate,
      authors: [post.author.name],
      images: [
        {
          url: post.featuredImage,
          alt: post.imageAltText || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle || post.title,
      description: post.seo.metaDescription || post.excerpt,
      images: [post.featuredImage],
    },
    robots: {
      index: !post.seo.noIndex,
      follow: !post.seo.noIndex,
    },
  };
}

function renderMarkdownText(text: string) {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#00ff9c] hover:underline">$1</a>');

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-sans antialiased text-justify">
          {renderMarkdownText(block.text || "")}
        </p>
      );
    case "heading":
      const HeadingTag = block.level === 3 ? "h3" : block.level === 4 ? "h4" : "h2";
      const headingClass =
        block.level === 3
          ? "text-lg sm:text-xl font-extrabold text-white mt-10 mb-4 scroll-mt-24 font-sans tracking-tight"
          : block.level === 4
          ? "text-base sm:text-lg font-bold text-white mt-8 mb-3 scroll-mt-24 font-sans tracking-tight"
          : "text-xl sm:text-2xl md:text-3xl font-black text-white mt-12 mb-6 scroll-mt-24 font-sans tracking-tight";
      
      const headingId = block.text
        ? block.text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")
        : `heading-${index}`;

      return (
        <HeadingTag key={index} id={headingId} className={headingClass}>
          {block.text}
        </HeadingTag>
      );
    case "list":
      const ListTag = block.ordered ? "ol" : "ul";
      const listClass = block.ordered
        ? "list-decimal pl-6 space-y-2.5 mb-6 text-zinc-300 text-sm sm:text-base font-sans"
        : "list-disc pl-6 space-y-2.5 mb-6 text-zinc-300 text-sm sm:text-base font-sans";
      return (
        <ListTag key={index} className={listClass}>
          {block.items?.map((item, i) => (
            <li key={i} className="pl-1">
              {renderMarkdownText(item)}
            </li>
          ))}
        </ListTag>
      );
    case "callout":
      let calloutClass = "border-l-2 border-emerald-500/40 bg-zinc-900/50 p-6 rounded-r-2xl my-8 text-sm leading-relaxed text-zinc-300";
      if (block.style === "warning") {
        calloutClass = "border-l-2 border-amber-500/40 bg-zinc-900/50 p-6 rounded-r-2xl my-8 text-sm leading-relaxed text-zinc-300";
      }
      return (
        <div key={index} className={calloutClass}>
          {block.text}
        </div>
      );
    case "image":
      return (
        <div key={index} className="my-10 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
          <div className="relative aspect-video w-full">
            <img src={block.src} alt={block.alt || ""} className="object-cover w-full h-full" />
          </div>
          {block.caption && (
            <p className="text-xs text-zinc-500 text-center py-3 bg-zinc-950/80 border-t border-white/5 font-mono">
              {block.caption}
            </p>
          )}
        </div>
      );
    case "code":
      return (
        <pre key={index} className="bg-zinc-950 border border-white/5 p-6 rounded-2xl text-xs font-mono text-[#00ff9c] my-8 overflow-x-auto whitespace-pre leading-relaxed scrollbar-thin">
          <code>{block.code}</code>
        </pre>
      );
    case "table":
      return (
        <div key={index} className="overflow-x-auto my-10 border border-white/10 rounded-2xl bg-zinc-950/20">
          <table className="w-full text-left border-collapse text-xs sm:text-sm text-zinc-300">
            <thead className="bg-zinc-900/60 text-white font-bold border-b border-white/10">
              <tr>
                {block.headers?.map((header, hIdx) => (
                  <th key={hIdx} className="p-4 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {block.rows?.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-4 leading-normal">{renderMarkdownText(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  
  // Dynamic navigation (paginated older/newer posts)
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const relatedPosts = getRelatedPosts(post, 3);
  const formattedPublishDate = new Date(post.publishDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const baseUrl = "https://resume-builder-chatcv.vercel.app";

  // SCHEMAS GENERATION
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
        "name": post.category,
        "item": `${baseUrl}/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": [post.featuredImage],
    "datePublished": post.publishDate,
    "dateModified": post.updatedDate,
    "author": [
      {
        "@type": "Person",
        "name": post.author.name,
        "jobTitle": post.author.role,
        "image": post.author.avatar,
        "url": `${baseUrl}/blog/author/${post.author.slug}`,
      },
    ],
    "publisher": {
      "@type": "Organization",
      "name": "ChatCV",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/chatcv.svg`,
      },
    },
    "description": post.seo.metaDescription || post.excerpt,
  };

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  } : null;

  return (
    <main className="bg-black min-h-screen pt-28 text-white relative">
      
      {/* BACKGROUND MESH CONTROLS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(0,255,156,0.06),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* SCHEMA INJECTIONS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* READING PROGRESS BAR TRACKER */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#00ff9c]/10 z-50">
        <div className="h-full bg-gradient-to-r from-[#00ff9c] to-emerald-400 w-0 transition-all duration-75" id="reading-bar" />
      </div>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', () => {
            const doc = document.documentElement;
            const scroll = doc.scrollTop || document.body.scrollTop;
            const height = doc.scrollHeight - doc.clientHeight;
            const percent = height > 0 ? (scroll / height) * 100 : 0;
            const bar = document.getElementById('reading-bar');
            if (bar) bar.style.width = percent + '%';
          });
        `
      }} />

      {/* LOCAL STORAGE READING REGISTRATION */}
      <script dangerouslySetInnerHTML={{
        __html: `
          try {
            // Register read history
            const bookmarks = JSON.parse(localStorage.getItem("chatcv_bookmarks") || "[]");
            // If post isn't registered, we can register in a separate reading log if needed.
          } catch(e) {}
        `
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        {/* BREADCRUMBS */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-8">
          <Link href="/blog" className="hover:text-[#00ff9c] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Blog</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <Link
            href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
            className="hover:text-[#00ff9c] transition-colors"
          >
            {post.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-700" />
          <span className="text-zinc-300 truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </div>

        {/* HERO HEADER */}
        <div className="max-w-3xl mb-12">
          <span className="bg-[#00ff9c]/10 border border-[#00ff9c]/25 text-[#00ff9c] text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-6 mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg mb-8 leading-relaxed">
            {post.subtitle}
          </p>

          {/* METADATA WRAPPER */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-zinc-800 border border-white/10">
                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">{post.author.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-1.5">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                {formattedPublishDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                {post.readingTime} min read
              </span>
            </div>
          </div>
        </div>

        {/* DUAL COLUMN STRUCTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* ARTICLE BODY (8 COLS) */}
          <article className="lg:col-span-8 space-y-2">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-10 border border-white/10 shadow-2xl">
              <Image
                src={post.featuredImage}
                alt={post.imageAltText || post.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* RENDERED BLOCKS */}
            <div className="prose prose-invert max-w-none">
              {post.content.map((block, index) => renderBlock(block, index))}
            </div>

            {/* FAQS */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-16 pt-10 border-t border-white/5">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {post.faqs.map((faq, index) => (
                    <div key={index} className="bg-zinc-900/10 border border-white/5 p-6 rounded-2xl">
                      <h4 className="font-extrabold text-white text-sm sm:text-base mb-2">{faq.question}</h4>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTEXTUAL CTA */}
            {post.cta ? (
              <BlogCTA
                title={post.cta.title}
                description={post.cta.description}
                buttonText={post.cta.buttonText}
                buttonLink={post.cta.buttonLink}
                type={post.cta.type}
              />
            ) : (
              <BlogCTA type="interactive" />
            )}

            {/* NEXT/PREV ARTICLE CARD NAVIGATION */}
            {(prevPost || nextPost) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 pt-8 border-t border-white/5">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className="group flex flex-col justify-between p-5 bg-zinc-900/20 hover:bg-[#00ff9c]/5 border border-white/5 hover:border-[#00ff9c]/25 rounded-2xl transition-all duration-300">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-extrabold mb-2">Previous Post</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#00ff9c] transition-colors leading-snug line-clamp-2">{prevPost.title}</span>
                  </Link>
                ) : <div />}

                {nextPost ? (
                  <Link href={`/blog/${nextPost.slug}`} className="group flex flex-col justify-between p-5 bg-zinc-900/20 hover:bg-[#00ff9c]/5 border border-white/5 hover:border-[#00ff9c]/25 rounded-2xl transition-all duration-300 text-right">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-extrabold mb-2">Next Post</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#00ff9c] transition-colors leading-snug line-clamp-2">{nextPost.title}</span>
                  </Link>
                ) : <div />}
              </div>
            )}

            {/* COMMENT THREADS PLACEHOLDER */}
            <div className="mt-16 pt-10 border-t border-white/5 bg-zinc-900/10 border border-white/5 rounded-3xl p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-black text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#00ff9c]" /> Discussion
              </h3>
              
              <div className="flex gap-4 mb-8">
                <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-white/10 flex-shrink-0 flex items-center justify-center font-bold text-xs">U</div>
                <div className="flex-grow">
                  <textarea
                    placeholder="Join the discussion... (Requires signup)"
                    disabled
                    rows={3}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none resize-none disabled:opacity-50"
                  />
                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[9px] text-zinc-500 font-semibold uppercase">Markdown Supported</span>
                    <Link href="/login">
                      <button className="bg-zinc-900 border border-white/10 hover:border-[#00ff9c]/20 text-[10px] font-bold py-2 px-4 rounded-xl text-zinc-300 hover:text-white transition-all">
                        Sign In to Post
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* MOCK COMMENTS */}
              <div className="space-y-6 opacity-60">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-white/10 flex-shrink-0 flex items-center justify-center font-bold text-xs text-[#00ff9c]">JD</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-zinc-200">John Doe</span>
                      <span className="text-[9px] text-zinc-500 font-medium">2 days ago</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      This is by far the most exhaustive ATS resource I have read. Typesetting via LaTeX actually makes a huge difference in visual parsing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* FLOATING SIDEBAR (DESKTOP ONLY) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-28 hidden lg:block">
            {/* SHARE PANEL */}
            <div className="bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Share Guide</span>
              <ShareButtons title={post.title} />
            </div>

            {/* OUTLINE TABLE OF CONTENTS */}
            <TableOfContents />

            {/* ADVERT SIDEBAR CTA */}
            <BlogCTA type="sidebar" />
          </aside>
        </div>

        {/* RELATED ARTICLES */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 pt-10 border-t border-white/5">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-8">Related Publications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="bg-zinc-900/20 border border-white/5 rounded-2xl p-5 hover:border-[#00ff9c]/20 transition-all duration-300 flex flex-col justify-between h-full shadow-md">
                  <div>
                    <span className="text-[#00ff9c] text-[10px] font-bold uppercase tracking-widest">{relatedPost.category}</span>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <h4 className="font-extrabold text-white text-sm sm:text-base mt-2 mb-2 line-clamp-2 hover:text-[#00ff9c] transition-colors">{relatedPost.title}</h4>
                    </Link>
                    <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed mb-4">{relatedPost.excerpt}</p>
                  </div>
                  <Link href={`/blog/${relatedPost.slug}`} className="text-xs font-bold text-[#00ff9c] hover:underline flex items-center gap-1 mt-auto">
                    Read Article <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
