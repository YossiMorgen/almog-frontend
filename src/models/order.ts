import { z } from 'zod';

export const OrderSchema = z.object({
  id: z.number().int().positive().optional(),
  order_number: z.string().max(50).optional(),
  student_id: z.number().int().positive(),
  order_date: z.date().default(() => new Date()),
  subtotal: z.number().min(0).default(0),
  tax_amount: z.number().min(0).default(0),
  discount_amount: z.number().min(0).default(0),
  total_amount: z.number().min(0),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'refunded']).default('pending'),
  notes: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: z.number().int().positive().optional(),
});

export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  order_date: true,
  created_at: true,
  updated_at: true,
});

export const UpdateOrderSchema = OrderSchema.partial().omit({
  id: true,
  order_number: true,
  student_id: true,
  order_date: true,
  created_at: true,
  updated_at: true,
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
