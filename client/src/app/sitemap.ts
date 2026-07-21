import { MetadataRoute } from "next";
import { getAllPosts, getCategories, getTags, getAllResumeRoles } from "../lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://resumebuilder-chatcv.vercel.app";

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/subscribe`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume-examples`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/category`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/tag`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/author`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 2. Dynamic Blog Posts
  const posts = getAllPosts();
  const blogSitemaps: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate || post.publishDate),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Categories Archive Pages
  const categories = getCategories();
  const categorySitemaps: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // 4. Tags Archive Pages
  const tags = getTags();
  const tagSitemaps: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${baseUrl}/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  // 5. Author Pages
  const authors = Array.from(new Set(posts.map((p) => p.author.slug)));
  const authorSitemaps: MetadataRoute.Sitemap = authors.map((authorSlug) => ({
    url: `${baseUrl}/blog/author/${authorSlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  // 6. Programmatic Resume Roles
  const roles = getAllResumeRoles();
  const roleSitemaps: MetadataRoute.Sitemap = roles.map((role) => ({
    url: `${baseUrl}/resume-examples/${role.role}`,
    lastModified: new Date(role.updatedDate),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...blogSitemaps,
    ...categorySitemaps,
    ...tagSitemaps,
    ...authorSitemaps,
    ...roleSitemaps,
  ];
}
