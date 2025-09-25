import { z } from 'zod';

export const OrderItemSchema = z.object({
  id: z.number().int().positive().optional(),
  order_id: z.number().int().positive(),
  item_type: z.enum(['course', 'product']),
  item_id: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
  unit_price: z.number().positive(),
  discount_amount: z.number().min(0).default(0),
  tax_amount: z.number().min(0).default(0),
  total_price: z.number().min(0),
  notes: z.string().optional(),
  created_at: z.date().optional(),
});

export const CreateOrderItemSchema = OrderItemSchema.omit({
  id: true,
  created_at: true,
});

export const UpdateOrderItemSchema = OrderItemSchema.partial().omit({
  id: true,
  order_id: true,
  created_at: true,
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type CreateOrderItem = z.infer<typeof CreateOrderItemSchema>;
export type UpdateOrderItem = z.infer<typeof UpdateOrderItemSchema>;
