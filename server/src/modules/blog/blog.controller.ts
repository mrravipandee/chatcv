import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as blogService from './blog.service';

// ── Public Controllers ──────────────────────────────────────────────────────

export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, category, tag, search, featured } = req.query;

  const result = await blogService.getPublishedBlogs({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    category: category as string,
    tag: tag as string,
    search: search as string,
    featured: featured !== undefined ? featured === 'true' : undefined,
  });

  res.status(200).json({
    success: true,
    data: result.blogs,
    meta: result.pagination,
  });
});

export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const { blog, relatedPosts } = await blogService.getPublishedBlogBySlug(slug);

  res.status(200).json({
    success: true,
    data: blog,
    relatedPosts,
  });
});

export const getFeaturedBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.getFeaturedBlog();

  res.status(200).json({
    success: true,
    data: blog,
  });
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await blogService.getBlogCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getTags = asyncHandler(async (req: Request, res: Response) => {
  const tags = await blogService.getBlogTags();

  res.status(200).json({
    success: true,
    data: tags,
  });
});

// ── Admin Controllers ───────────────────────────────────────────────────────

export const getAdminBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status, search } = req.query;

  const result = await blogService.getAdminBlogs({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    status: status as string,
    search: search as string,
  });

  res.status(200).json({
    success: true,
    data: result.blogs,
    meta: result.pagination,
  });
});

export const getAdminBlogById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const blog = await blogService.getBlogById(id);

  res.status(200).json({
    success: true,
    data: blog,
  });
});

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.createBlog(req.body);

  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    data: blog,
  });
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const blog = await blogService.updateBlog(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Blog updated successfully',
    data: blog,
  });
});

export const updateBlogStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const blog = await blogService.updateBlogStatus(id, status);

  res.status(200).json({
    success: true,
    message: `Blog status updated to ${status}`,
    data: blog,
  });
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await blogService.deleteBlog(id);

  res.status(200).json({
    success: true,
    message: result.message,
    data: { id: result.id },
  });
});
