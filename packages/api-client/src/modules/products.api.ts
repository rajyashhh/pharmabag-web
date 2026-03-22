import { z } from 'zod';
import { api } from '../api';
import { PRODUCTS } from '@pharmabag/utils';

// ─── Schemas ────────────────────────────────────────

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  mrp: z.number().optional(),
  category: z.string().optional(),
  manufacturer: z.string().optional(),
  images: z.array(z.string()).optional(),
  stock: z.number().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const ProductListResponseSchema = z.object({
  data: z.array(ProductSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  subCategoryId: z.string().optional(),
  manufacturer: z.string().optional(),
  chemicalComposition: z.string().optional(),
  description: z.string().optional(),
  mrp: z.number().positive(),
  gstPercent: z.number().optional(),
  minimumOrderQuantity: z.number().int().positive().optional(),
  maximumOrderQuantity: z.number().int().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  expiryDate: z.string().optional(),
  images: z.array(z.string()).optional(),
  discountType: z.string().optional(),
  discountMeta: z.record(z.unknown()).optional(),
});

// ─── Types ──────────────────────────────────────────

export type Product = z.infer<typeof ProductSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;

// ─── Category Schema ────────────────────────────────

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  productCount: z.number().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

// ─── API Functions ──────────────────────────────────

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  subCategoryId?: string;
  manufacturer?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}): Promise<ProductListResponse> {
  try {
    const { data } = await api.get('/products', { params });
    return {
      data: data.data.products,
      total: data.data.meta.total,
      page: data.data.meta.page,
      limit: data.data.meta.limit,
    };
  } catch (error) {
    // Fallback to mock data when backend is unavailable
    console.warn('Backend unavailable, using mock products data');
    const mockProducts = PRODUCTS as any[];
    
    // Filter by search term if provided
    let filtered = mockProducts;
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.manufacturer?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by price range if provided
    if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
      filtered = filtered.filter(p => {
        const price = p.price;
        if (params.minPrice !== undefined && price < params.minPrice) return false;
        if (params.maxPrice !== undefined && price > params.maxPrice) return false;
        return true;
      });
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);
    
    return {
      data: paginatedData,
      total: filtered.length,
      page,
      limit,
    };
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  } catch (error) {
    // Fallback to mock data when backend is unavailable
    const mockProducts = PRODUCTS as any[];
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await api.get('/products/categories');
    return data.data;
  } catch (error) {
    // Fallback to mock categories when backend is unavailable
    console.warn('Backend unavailable, using default categories');
    return [
      { id: 'cat1', name: 'Tablets & Capsules', slug: 'tablets-capsules' },
      { id: 'cat2', name: 'Supplements', slug: 'supplements' },
      { id: 'cat3', name: 'Pain Relief', slug: 'pain-relief' },
      { id: 'cat4', name: 'Cold & Cough', slug: 'cold-cough' },
      { id: 'cat5', name: 'Digestive Health', slug: 'digestive' },
      { id: 'cat6', name: 'Vitamins', slug: 'vitamins' },
    ];
  }
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const body = CreateProductSchema.parse(input);
  const { data } = await api.post('/products', body);
  return data;
}

export async function updateProduct(id: string, input: Partial<CreateProductInput>): Promise<Product> {
  const { data } = await api.patch(`/products/${id}`, input);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
