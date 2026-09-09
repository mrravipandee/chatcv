import fs from 'fs';
import path from 'path';
import { BlogPost, ProgrammaticResumeRole } from '../types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog/posts');
const ROLE_DIR = path.join(process.cwd(), 'src/content/resume-examples/roles');

// Helper to ensure directories exist (prevents build-time crashes if empty)
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ── Local Disk Fallback Helpers ─────────────────────────────────────────────

export function getLocalAllPosts(): BlogPost[] {
  ensureDirectoryExists(BLOG_DIR);
  try {
    const files = fs.readdirSync(BLOG_DIR);
    const posts: BlogPost[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
          const post: BlogPost = JSON.parse(fileContent);
          if (!post.draft) {
            posts.push(post);
          }
        } catch (e) {
          console.error(`Error parsing JSON in file ${file}:`, e);
        }
      }
    }

    return posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } catch (error) {
    console.error('Error reading local blog posts directory:', error);
    return [];
  }
}

export function getLocalPostBySlug(slug: string): BlogPost | undefined {
  const posts = getLocalAllPosts();
  return posts.find((p) => p.slug === slug);
}

// ── Production Dynamic API Loaders with Next.js ISR & Fallback ──────────────

export async function getAllPosts(options?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', String(options.page));
    if (options?.limit) params.set('limit', String(options.limit));
    else params.set('limit', '100');
    if (options?.category) params.set('category', options.category);
    if (options?.tag) params.set('tag', options.tag);
    if (options?.search) params.set('search', options.search);

    const url = `${API_BASE_URL}/api/blogs?${params.toString()}`;
    const res = await fetch(url, {
      next: { tags: ['blogs'], revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (error) {
    // Graceful fallback to local disk if backend is unreachable during build
    console.warn('[Blog] Backend API unavailable, using local fallback posts:', (error as any)?.message);
  }

  return getLocalAllPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const url = `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
      next: { tags: ['blogs', `blog-${slug}`], revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return json.data;
      }
    } else if (res.status === 404) {
      return undefined;
    }
  } catch (error) {
    console.warn(`[Blog] Backend API unavailable for slug '${slug}', using local fallback`);
  }

  return getLocalPostBySlug(slug);
}

export async function getFeaturedPost(): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs/featured`, {
      next: { tags: ['blogs'], revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (error) {}

  const posts = await getAllPosts();
  return posts.find((p) => p.featured) || posts[0];
}

export async function getLatestPosts(limit = 6): Promise<BlogPost[]> {
  const posts = await getAllPosts({ limit });
  return posts.slice(0, limit);
}

export async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs/meta/categories`, {
      next: { tags: ['blogs'], revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        return json.data.map((c: any) => (typeof c === 'string' ? c : c.name));
      }
    }
  } catch (error) {}

  const posts = await getAllPosts();
  const categories = new Set<string>();
  posts.forEach((p) => {
    if (p.category) categories.add(p.category.trim());
  });
  return Array.from(categories);
}

export async function getTags(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs/meta/tags`, {
      next: { tags: ['blogs'], revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        return json.data.map((t: any) => (typeof t === 'string' ? t : t.name));
      }
    }
  } catch (error) {}

  const posts = await getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => {
    p.tags?.forEach((t) => tags.add(t.trim()));
  });
  return Array.from(tags);
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs?category=${encodeURIComponent(category)}`, {
      next: { tags: ['blogs'], revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) return json.data;
    }
  } catch (error) {}

  const posts = await getAllPosts();
  const normalizedCategory = category.toLowerCase().trim();
  return posts.filter((p) => p.category?.toLowerCase().trim() === normalizedCategory);
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blogs?tag=${encodeURIComponent(tag)}`, {
      next: { tags: ['blogs'], revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) return json.data;
    }
  } catch (error) {}

  const posts = await getAllPosts();
  const normalizedTag = tag.toLowerCase().trim();
  return posts.filter((p) => p.tags?.some((t) => t.toLowerCase().trim() === normalizedTag));
}

export async function getPostsByAuthor(authorSlug: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const normalizedAuthor = authorSlug.toLowerCase().trim();
  return posts.filter((p) => p.author?.slug?.toLowerCase().trim() === normalizedAuthor);
}

export async function getRelatedPosts(currentPost: BlogPost, limit = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== currentPost.slug);

  const scoredPosts = otherPosts.map((post) => {
    let score = 0;
    if (currentPost.relatedPostsSlugs?.includes(post.slug)) {
      score += 10;
    }
    if (post.category?.toLowerCase() === currentPost.category?.toLowerCase()) {
      score += 5;
    }
    const commonTags = post.tags?.filter((tag) => currentPost.tags?.includes(tag)) || [];
    score += commonTags.length * 2;
    return { post, score };
  });

  return scoredPosts
    .filter((sp) => sp.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((sp) => sp.post)
    .slice(0, limit);
}

export async function searchPosts(query: string): Promise<BlogPost[]> {
  if (!query) return getAllPosts();

  const posts = await getAllPosts();
  const searchTerms = query.toLowerCase().split(/\s+/);

  return posts.filter((post) => {
    const searchString = `${post.title} ${post.subtitle || ''} ${post.excerpt} ${post.category} ${(post.tags || []).join(' ')} ${post.author?.name || ''}`.toLowerCase();
    return searchTerms.every((term) => searchString.includes(term));
  });
}

// ── Programmatic Resume Examples Utilities (Preserved Unchanged) ────────────

export function getAllResumeRoles(): ProgrammaticResumeRole[] {
  ensureDirectoryExists(ROLE_DIR);
  try {
    const files = fs.readdirSync(ROLE_DIR);
    const roles: ProgrammaticResumeRole[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(ROLE_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
          const roleData: ProgrammaticResumeRole = JSON.parse(fileContent);
          roles.push(roleData);
        } catch (e) {
          console.error(`Error parsing JSON in file ${file}:`, e);
        }
      }
    }

    return roles;
  } catch (error) {
    console.error('Error reading programmatic resume roles directory:', error);
    return [];
  }
}

export function getResumeRole(roleSlug: string): ProgrammaticResumeRole | undefined {
  const roles = getAllResumeRoles();
  const normalizedSlug = roleSlug.toLowerCase().trim();
  return roles.find((r) => r.role.toLowerCase().trim() === normalizedSlug);
}

export function getRelatedResumeRoles(currentRole: ProgrammaticResumeRole, limit = 4): ProgrammaticResumeRole[] {
  const allRoles = getAllResumeRoles();
  const otherRoles = allRoles.filter((r) => r.role !== currentRole.role);

  const scored = otherRoles.map((role) => {
    let score = 0;
    if (role.industry.toLowerCase() === currentRole.industry.toLowerCase()) {
      score += 5;
    }
    if (currentRole.relatedRoles?.includes(role.role)) {
      score += 10;
    }
    return { role, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map((s) => s.role)
    .slice(0, limit);
}
