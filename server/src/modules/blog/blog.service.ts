import { Blog, IBlog } from './blog.model';
import { AppError } from '../../errors/AppError';

export interface BlogFilterOptions {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
}

export const calculateReadingTime = (content: any[] = []): number => {
  let wordCount = 0;
  for (const block of content) {
    if (block.text) {
      wordCount += block.text.split(/\s+/).filter(Boolean).length;
    }
    if (Array.isArray(block.items)) {
      for (const item of block.items) {
        wordCount += item.split(/\s+/).filter(Boolean).length;
      }
    }
  }
  // Average adult reading speed: ~200 words per minute
  return Math.max(1, Math.ceil(wordCount / 200));
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ── Public Service Methods ──────────────────────────────────────────────────

export const getPublishedBlogs = async (options: BlogFilterOptions = {}) => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 10));
  const skip = (page - 1) * limit;

  const query: any = { status: 'published' };

  if (options.category) {
    // Case-insensitive regex matching for category
    query.category = { $regex: new RegExp(`^${options.category}$`, 'i') };
  }

  if (options.tag) {
    // Case-insensitive match in tags array
    query.tags = { $elemMatch: { $regex: new RegExp(`^${options.tag}$`, 'i') } };
  }

  if (options.featured !== undefined) {
    query.featured = options.featured;
  }

  if (options.search) {
    const searchRegex = new RegExp(options.search, 'i');
    query.$or = [
      { title: searchRegex },
      { subtitle: searchRegex },
      { excerpt: searchRegex },
      { category: searchRegex },
      { tags: searchRegex },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query),
  ]);

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
};

export const getPublishedBlogBySlug = async (slug: string) => {
  const normalizedSlug = slug.toLowerCase().trim();
  const blog = await Blog.findOne({ slug: normalizedSlug, status: 'published' });

  if (!blog) {
    throw new AppError(404, 'NOT_FOUND', `Blog post not found: ${slug}`);
  }

  // Increment views count asynchronously without changing updatedAt timestamp
  Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }, { timestamps: false }).exec().catch(() => {});

  // Fetch related posts (same category or common tags, excluding current post)
  let relatedPosts: IBlog[] = [];
  if (blog.relatedPostsSlugs && blog.relatedPostsSlugs.length > 0) {
    relatedPosts = await Blog.find({
      slug: { $in: blog.relatedPostsSlugs },
      status: 'published',
    })
      .limit(3)
      .lean();
  }

  if (relatedPosts.length < 3) {
    const needed = 3 - relatedPosts.length;
    const existingSlugs = [blog.slug, ...relatedPosts.map((p) => p.slug)];
    const additional = await Blog.find({
      slug: { $nin: existingSlugs },
      status: 'published',
      $or: [{ category: blog.category }, { tags: { $in: blog.tags } }],
    })
      .sort({ publishDate: -1 })
      .limit(needed)
      .lean();

    relatedPosts = [...relatedPosts, ...additional];
  }

  return { blog, relatedPosts };
};

export const getFeaturedBlog = async () => {
  let featured = await Blog.findOne({ status: 'published', featured: true })
    .sort({ publishDate: -1 })
    .lean();

  if (!featured) {
    featured = await Blog.findOne({ status: 'published' })
      .sort({ publishDate: -1 })
      .lean();
  }

  return featured;
};

export const getBlogCategories = async () => {
  const categories = await Blog.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ]);

  return categories.map((c) => ({
    name: c._id,
    count: c.count,
    slug: slugify(c._id),
  }));
};

export const getBlogTags = async () => {
  const tags = await Blog.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } },
  ]);

  return tags.map((t) => ({
    name: t._id,
    count: t.count,
    slug: slugify(t._id),
  }));
};

// ── Admin Service Methods ───────────────────────────────────────────────────

export const getAdminBlogs = async (options: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
  const skip = (page - 1) * limit;

  const query: any = {};

  if (options.status && options.status !== 'all') {
    query.status = options.status;
  }

  if (options.search) {
    const searchRegex = new RegExp(options.search, 'i');
    query.$or = [
      { title: searchRegex },
      { slug: searchRegex },
      { category: searchRegex },
      { 'author.name': searchRegex },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query),
  ]);

  return {
    blogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getBlogById = async (id: string) => {
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new AppError(404, 'NOT_FOUND', `Blog not found with ID: ${id}`);
  }
  return blog;
};

export const createBlog = async (data: Partial<IBlog>) => {
  const slug = data.slug ? slugify(data.slug) : slugify(data.title || '');

  // Check unique slug
  const existing = await Blog.findOne({ slug });
  if (existing) {
    throw new AppError(409, 'CONFLICT_ERROR', `A blog with slug '${slug}' already exists`);
  }

  const readingTime = data.readingTime || calculateReadingTime(data.content || []);

  const blog = await Blog.create({
    ...data,
    slug,
    readingTime,
    publishDate: data.publishDate || (data.status === 'published' ? new Date() : undefined),
    updatedDate: new Date(),
  });

  return blog;
};

export const updateBlog = async (id: string, data: Partial<IBlog>) => {
  const existing = await Blog.findById(id);
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', `Blog not found with ID: ${id}`);
  }

  if (data.slug && data.slug !== existing.slug) {
    const cleanSlug = slugify(data.slug);
    const slugCollision = await Blog.findOne({ slug: cleanSlug, _id: { $ne: id } });
    if (slugCollision) {
      throw new AppError(409, 'CONFLICT_ERROR', `Slug '${cleanSlug}' is already used by another post`);
    }
    data.slug = cleanSlug;
  }

  if (data.content && !data.readingTime) {
    data.readingTime = calculateReadingTime(data.content);
  }

  data.updatedDate = new Date();

  // If transitioning to published for first time and no publishDate was set
  if (data.status === 'published' && existing.status !== 'published' && !existing.publishDate) {
    data.publishDate = new Date();
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return updatedBlog;
};

export const updateBlogStatus = async (id: string, status: 'draft' | 'published' | 'archived') => {
  const existing = await Blog.findById(id);
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', `Blog not found with ID: ${id}`);
  }

  const updatePayload: any = {
    status,
    updatedDate: new Date(),
  };

  if (status === 'published' && (!existing.publishDate || existing.status !== 'published')) {
    updatePayload.publishDate = new Date();
  }

  const updated = await Blog.findByIdAndUpdate(id, updatePayload, { new: true });
  return updated;
};

export const deleteBlog = async (id: string) => {
  const existing = await Blog.findById(id);
  if (!existing) {
    throw new AppError(404, 'NOT_FOUND', `Blog not found with ID: ${id}`);
  }

  await Blog.findByIdAndDelete(id);
  return { id, message: 'Blog deleted successfully' };
};
