import { Metadata } from "next";
import Link from "next/link";
import { getCategories, getPostsByCategory } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((cat) => ({
    category: cat.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedCategory = decodeURIComponent(resolvedParams.category)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const baseUrl = "https://resume-builder-chatcv.vercel.app";
  const canonicalUrl = `${baseUrl}/blog/category/${resolvedParams.category}`;

  return {
    title: `${decodedCategory} Articles | ChatCV Blog`,
    description: `Read the latest articles, guides, and career resources under the ${decodedCategory} category on the ChatCV blog.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${decodedCategory} Articles | ChatCV Blog`,
      description: `Read the latest articles, guides, and career resources under the ${decodedCategory} category on the ChatCV blog.`,
      url: canonicalUrl,
      type: "website",
      siteName: "ChatCV",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedCategory} Articles | ChatCV Blog`,
      description: `Read the latest articles, guides, and career resources under the ${decodedCategory} category on the ChatCV blog.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const rawCategory = resolvedParams.category;
  
  // Find category matching slugified param
  const allCategories = getCategories();
  const matchedCategory = allCategories.find(
    (c) => c.toLowerCase().replace(/\s+/g, "-") === rawCategory
  ) || rawCategory;

  const posts = getPostsByCategory(matchedCategory);

  const baseUrl = "https://resume-builder-chatcv.vercel.app";
  const canonicalUrl = `${baseUrl}/blog/category/${rawCategory}`;
  
  // Title capitalized properly
  const decodedCategory = matchedCategory
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Schema declarations
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
        "name": "Categories",
        "item": `${baseUrl}/blog/category`,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": decodedCategory,
        "item": canonicalUrl,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${decodedCategory} Articles | ChatCV Blog`,
    "description": `Read the latest articles, guides, and career resources under the ${decodedCategory} category on the ChatCV blog.`,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.map((post, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${baseUrl}/blog/${post.slug}`,
        "name": post.title,
      })),
    },
  };

  return (
    <main className="bg-black min-h-screen pt-28 pb-20 text-white">
      {/* Schema Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-zinc-500 hover:text-[#00ff9c] text-xs font-bold flex items-center gap-1 mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Blog</span>
        </Link>

        <div className="mb-12">
          <span className="text-xs text-[#00ff9c] uppercase font-black tracking-widest bg-[#00ff9c]/10 px-3 py-1 rounded-full border border-[#00ff9c]/20">
            Category Archive
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-4 capitalize">
            {matchedCategory}
          </h1>
          <p className="text-zinc-400 text-sm mt-3">
            Showing {posts.length} {posts.length === 1 ? "article" : "articles"} in this category
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
            <p className="text-zinc-400">No posts found in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
