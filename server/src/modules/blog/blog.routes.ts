import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createBlogSchema,
  updateBlogSchema,
  updateStatusSchema,
} from './blog.validation';
import {
  getBlogs,
  getBlogBySlug,
  getFeaturedBlog,
  getCategories,
  getTags,
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
} from './blog.controller';

// ── Public Blog Routes (/api/blogs) ─────────────────────────────────────────
export const publicBlogRouter = Router();

publicBlogRouter.get('/', getBlogs);
publicBlogRouter.get('/featured', getFeaturedBlog);
publicBlogRouter.get('/meta/categories', getCategories);
publicBlogRouter.get('/meta/tags', getTags);
publicBlogRouter.get('/:slug', getBlogBySlug);

// ── Admin Blog Routes (/api/admin/blogs) ─────────────────────────────────────
export const adminBlogRouter = Router();

// Protect all admin endpoints with auth and admin verification
adminBlogRouter.use(authMiddleware);
adminBlogRouter.use(adminMiddleware);

adminBlogRouter.get('/', getAdminBlogs);
adminBlogRouter.get('/:id', getAdminBlogById);
adminBlogRouter.post('/', validate(createBlogSchema), createBlog);
adminBlogRouter.put('/:id', validate(updateBlogSchema), updateBlog);
adminBlogRouter.patch('/:id/status', validate(updateStatusSchema), updateBlogStatus);
adminBlogRouter.delete('/:id', deleteBlog);
