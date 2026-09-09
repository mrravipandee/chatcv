import { z } from 'zod';

const ContentBlockSchema = z.object({
  type: z.enum(['paragraph', 'heading', 'list', 'image', 'code', 'callout', 'table']),
  level: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  text: z.string().optional(),
  items: z.array(z.string()).optional(),
  ordered: z.boolean().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  code: z.string().optional(),
  language: z.string().optional(),
  style: z.enum(['info', 'warning', 'success']).optional(),
  headers: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())).optional(),
});

const BlogAuthorSchema = z.object({
  name: z.string().min(1, 'Author name is required'),
  slug: z.string().min(1, 'Author slug is required'),
  role: z.string().default('Author'),
  avatar: z.string().default(''),
  bio: z.string().default(''),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
});

const FAQItemSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

const PostCTASchema = z.object({
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
  buttonLink: z.string(),
  type: z.enum(['banner', 'card', 'sidebar', 'interactive']).default('banner'),
});

const SEODataSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  focusKeyword: z.string().optional(),
  secondaryKeywords: z.array(z.string()).optional(),
  searchIntent: z.enum(['informational', 'transactional', 'commercial', 'navigational']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  contentType: z.enum(['pillar', 'supporting', 'comparison', 'guide']).optional(),
  canonicalUrl: z.string().optional(),
  noIndex: z.boolean().optional(),
});

export const createBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be URL-safe (lowercase letters, numbers, hyphens)'),
  subtitle: z.string().optional(),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  tags: z.array(z.string()).default([]),
  author: BlogAuthorSchema,
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishDate: z.string().optional(),
  readingTime: z.number().int().positive().optional(),
  featuredImage: z.string().min(1, 'Featured image is required'),
  imageAltText: z.string().optional(),
  content: z.array(ContentBlockSchema).min(1, 'Content must have at least one block'),
  faqs: z.array(FAQItemSchema).optional(),
  cta: PostCTASchema.optional(),
  relatedPostsSlugs: z.array(z.string()).optional(),
  seo: SEODataSchema.optional(),
  featured: z.boolean().default(false),
  language: z.string().default('en'),
});

export const updateBlogSchema = createBlogSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']),
});
