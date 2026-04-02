import { z } from 'zod';
import { api } from '../api';

// ─── Schemas ────────────────────────────────────────

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string().optional(),
  content: z.string(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const BlogListResponseSchema = z.object({
  data: z.array(BlogSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

// ─── Types ──────────────────────────────────────────

export type Blog = z.infer<typeof BlogSchema>;
export type BlogListResponse = z.infer<typeof BlogListResponseSchema>;

// ─── API Functions ──────────────────────────────────

export async function getBlogs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}): Promise<BlogListResponse> {
  try {
    const { data } = await api.get('/blogs', { params });
    return {
      data: data.data?.blogs ?? data.data ?? [],
      total: data.data?.meta?.total ?? data.total ?? 0,
      page: data.data?.meta?.page ?? data.page ?? params?.page ?? 1,
      limit: data.data?.meta?.limit ?? data.limit ?? params?.limit ?? 10,
    };
  } catch (err) {
    console.warn('[Blogs] Failed to fetch blogs:', (err as any)?.response?.status, (err as any)?.message);
    return { data: [], total: 0, page: params?.page ?? 1, limit: params?.limit ?? 10 };
  }
}

export async function getBlogById(id: string): Promise<Blog> {
  try {
    const { data } = await api.get(`/blogs/${id}`);
    return data.data ?? data;
  } catch (err) {
    console.error('[Blogs] Failed to fetch blog by ID:', (err as any)?.response?.status, (err as any)?.message);
    throw err;
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  try {
    const { data } = await api.get(`/blogs/slug/${slug}`);
    return data.data ?? data;
  } catch (err) {
    console.error('[Blogs] Failed to fetch blog by slug:', (err as any)?.response?.status, (err as any)?.message);
    throw err;
  }
}
