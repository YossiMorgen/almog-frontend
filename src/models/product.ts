import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number().int().positive().optional(),
  sku: z.string().max(100).min(1),
  name: z.string().max(200).min(1),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  price: z.number().positive(),
  tax_rate: z.number().min(0).max(100).default(0),
  stock_quantity: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  image_url: z.string().url().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: z.number().int().positive().optional(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateProductSchema = ProductSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
