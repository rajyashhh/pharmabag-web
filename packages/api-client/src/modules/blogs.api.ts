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

// ─── Mock Data for Fallback ─────────────────────────

const MOCK_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'How to Manage Your Pharmacy Inventory Efficiently',
    slug: 'manage-pharmacy-inventory-efficiently',
    excerpt: 'Learn the best practices for tracking stock levels, managing expiry dates, and optimizing your procurement process.',
    content: `
      <p>Managing a pharmacy inventory is a complex task that requires precision, foresight, and a systematic approach. With hundreds of different medications, varying expiry dates, and fluctuating demand, pharmacy owners often find themselves overwhelmed.</p>
      <h2>1. Implement a First-Expiring-First-Out (FEFO) System</h2>
      <p>Unlike standard warehouse management where First-In-First-Out (FIFO) is the norm, pharmacies must prioritize expiry dates. Always arrange your stock so that products nearing their expiry are at the front of the shelf.</p>
      <h2>2. Use Automated Tracking Software</h2>
      <p>Manual spreadsheets are prone to human error. Utilizing a platform like PharmaBag allows you to track stock levels in real-time and get alerts before a product runs out or expires.</p>
      <h2>3. Regularly Audit Your Stock</h2>
      <p>Even with great software, a physical count once a month is essential to identify discrepancies due to breakage, theft, or misplacement.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=1200',
    author: 'Dr. Sarah Johnson',
    tags: ['Inventory', 'Management', 'Efficiency'],
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isPublished: true,
  },
  {
    id: 'blog-2',
    title: 'The Future of Digital Pharma Procurement in India',
    slug: 'future-digital-pharma-procurement-india',
    excerpt: 'Explore how B2B platforms are transforming the way retail pharmacies source their medicines from manufacturers.',
    content: `
      <p>The pharmaceutical supply chain in India has traditionally been fragmented, with multiple layers of distributors and wholesalers. However, the rise of digital B2B platforms is changing the landscape.</p>
      <p>By connecting retailers directly with manufacturers, platforms like PharmaBag are reducing lead times, ensuring authenticity, and providing better pricing to the end consumer.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=1200',
    author: 'Amit Sharma',
    tags: ['Digital Transformation', 'B2B', 'Procurement'],
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isPublished: true,
  }
];

// ─── API Functions ──────────────────────────────────

export async function getBlogs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}): Promise<BlogListResponse> {
  try {
    const { data } = await api.get('/blogs', { params });
    const blogs = data.data?.blogs ?? data.data;
    const total = data.data?.meta?.total ?? data.total;

    if (!Array.isArray(blogs)) throw new Error('Invalid response format');

    return {
      data: blogs,
      total: total ?? blogs.length,
      page: data.data?.meta?.page ?? data.page ?? params?.page ?? 1,
      limit: data.data?.meta?.limit ?? data.limit ?? params?.limit ?? 10,
    };
  } catch (err) {
    if ((err as any)?.response?.status === 404) {
      // Return mock blogs if backend endpoint is missing
      return {
        data: MOCK_BLOGS,
        total: MOCK_BLOGS.length,
        page: 1,
        limit: 10
      };
    }
    console.warn('[Blogs] Failed to fetch blogs:', (err as any)?.response?.status, (err as any)?.message);
    return { data: [], total: 0, page: params?.page ?? 1, limit: params?.limit ?? 10 };
  }
}

export async function getBlogById(id: string): Promise<Blog> {
  try {
    const { data } = await api.get(`/blogs/${id}`);
    return data.data ?? data;
  } catch (err) {
    if ((err as any)?.response?.status === 404) {
      const mock = MOCK_BLOGS.find(b => b.id === id);
      if (mock) return mock;
    }
    console.error('[Blogs] Failed to fetch blog by ID:', (err as any)?.response?.status, (err as any)?.message);
    throw err;
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  try {
    const { data } = await api.get(`/blogs/slug/${slug}`);
    return data.data ?? data;
  } catch (err) {
    if ((err as any)?.response?.status === 404) {
      const mock = MOCK_BLOGS.find(b => b.slug === slug);
      if (mock) return mock;
    }
    console.error('[Blogs] Failed to fetch blog by slug:', (err as any)?.response?.status, (err as any)?.message);
    throw err;
  }
}
