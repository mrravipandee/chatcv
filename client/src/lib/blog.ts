import fs from 'fs';
import path from 'path';
import { BlogPost, ProgrammaticResumeRole } from '../types/blog';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog/posts');
const ROLE_DIR = path.join(process.cwd(), 'src/content/resume-examples/roles');

// Helper to ensure directories exist (prevents build-time crashes if empty)
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Editorial Blog Utilities
 */

export function getAllPosts(): BlogPost[] {
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

    // Sort by publishDate descending (newest first)
    return posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } catch (error) {
    console.error('Error reading blog posts directory:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export function getFeaturedPost(): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.featured) || posts[0];
}

export function getLatestPosts(limit = 6): BlogPost[] {
  const posts = getAllPosts();
  return posts.slice(0, limit);
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set<string>();
  posts.forEach((p) => {
    if (p.category) {
      categories.add(p.category.trim());
    }
  });
  return Array.from(categories);
}

export function getTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => {
    p.tags.forEach((t) => tags.add(t.trim()));
  });
  return Array.from(tags);
}

export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  const normalizedCategory = category.toLowerCase().trim();
  return posts.filter((p) => p.category.toLowerCase().trim() === normalizedCategory);
}

export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts();
  const normalizedTag = tag.toLowerCase().trim();
  return posts.filter((p) => p.tags.some((t) => t.toLowerCase().trim() === normalizedTag));
}

export function getPostsByAuthor(authorSlug: string): BlogPost[] {
  const posts = getAllPosts();
  const normalizedAuthor = authorSlug.toLowerCase().trim();
  return posts.filter((p) => p.author.slug.toLowerCase().trim() === normalizedAuthor);
}

export function getRelatedPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  const allPosts = getAllPosts();
  
  // Exclude current post
  const otherPosts = allPosts.filter((p) => p.slug !== currentPost.slug);

  // Score posts based on matching tags or category
  const scoredPosts = otherPosts.map((post) => {
    let score = 0;
    
    // Explicit relation defined in post
    if (currentPost.relatedPostsSlugs?.includes(post.slug)) {
      score += 10;
    }
    
    // Same category
    if (post.category.toLowerCase() === currentPost.category.toLowerCase()) {
      score += 5;
    }
    
    // Intersecting tags
    const commonTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
    score += commonTags.length * 2;
    
    return { post, score };
  });

  // Filter out zero score, sort by score descending, and limit
  return scoredPosts
    .filter((sp) => sp.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((sp) => sp.post)
    .slice(0, limit);
}

export function searchPosts(query: string): BlogPost[] {
  if (!query) return getAllPosts();
  
  const posts = getAllPosts();
  const searchTerms = query.toLowerCase().split(/\s+/);
  
  return posts.filter((post) => {
    const searchString = `${post.title} ${post.subtitle} ${post.excerpt} ${post.category} ${post.tags.join(' ')} ${post.author.name}`.toLowerCase();
    return searchTerms.every((term) => searchString.includes(term));
  });
}

/**
 * Programmatic Resume Examples Utilities
 */

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
  
  // Score by industry similarity or explicit matching
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
