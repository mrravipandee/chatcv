import { ApiResponse } from './api';
import { BlogPost } from '@/types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const getHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

async function fetchAdminBlog<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers as any),
      },
    });

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        message: 'Unauthorized. Admin session expired or access forbidden.',
        code: 'UNAUTHORIZED',
      };
    }

    const data = (await response.json()) as ApiResponse<T>;
    return data;
  } catch (error) {
    console.error('[Blog Admin API Error]', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network failure connecting to admin server',
      code: 'NETWORK_ERROR',
    };
  }
}

export interface AdminBlogListResponse {
  blogs: BlogPost[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAdminBlogs(
  page: number = 1,
  limit: number = 20,
  status: string = 'all',
  search: string = ''
): Promise<ApiResponse<any>> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status,
    search,
  }).toString();

  return fetchAdminBlog(`/api/admin/blogs?${query}`);
}

export async function getAdminBlogById(id: string): Promise<ApiResponse<BlogPost>> {
  return fetchAdminBlog(`/api/admin/blogs/${id}`);
}

export async function createAdminBlog(payload: Partial<BlogPost>): Promise<ApiResponse<BlogPost>> {
  const res = await fetchAdminBlog<BlogPost>('/api/admin/blogs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // Trigger on-demand cache revalidation
  if (res.success) {
    revalidateBlogCache();
  }

  return res;
}

export async function updateAdminBlog(
  id: string,
  payload: Partial<BlogPost>
): Promise<ApiResponse<BlogPost>> {
  const res = await fetchAdminBlog<BlogPost>(`/api/admin/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (res.success) {
    revalidateBlogCache(payload.slug);
  }

  return res;
}

export async function updateAdminBlogStatus(
  id: string,
  status: 'draft' | 'published' | 'archived',
  slug?: string
): Promise<ApiResponse<BlogPost>> {
  const res = await fetchAdminBlog<BlogPost>(`/api/admin/blogs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  if (res.success) {
    revalidateBlogCache(slug);
  }

  return res;
}

export async function deleteAdminBlog(id: string, slug?: string): Promise<ApiResponse<{ id: string }>> {
  const res = await fetchAdminBlog<{ id: string }>(`/api/admin/blogs/${id}`, {
    method: 'DELETE',
  });

  if (res.success) {
    revalidateBlogCache(slug);
  }

  return res;
}

// Client helper to trigger Next.js cache revalidation
export async function revalidateBlogCache(slug?: string) {
  try {
    const url = slug ? `/api/revalidate?tag=blogs&slug=${slug}` : `/api/revalidate?tag=blogs`;
    await fetch(url, { method: 'POST' });
  } catch (err) {
    console.warn('[REVALIDATION_FAIL]', err);
  }
}
