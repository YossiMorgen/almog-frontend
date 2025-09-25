import { z } from 'zod';

export const PaymentSchema = z.object({
  id: z.number().int().positive().optional(),
  payment_number: z.string().max(50).min(1),
  order_id: z.number().int().positive(),
  total_amount: z.number().positive(),
  paid_amount: z.number().min(0).default(0),
  remaining_amount: z.number().min(0).optional(),
  payment_status: z.enum(['pending', 'partial', 'completed', 'overdue', 'cancelled', 'refunded']).default('pending'),
  due_date: z.date().optional(),
  notes: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: z.number().int().positive().optional(),
});

export const CreatePaymentSchema = PaymentSchema.omit({
  id: true,
  paid_amount: true,
  remaining_amount: true,
  created_at: true,
  updated_at: true,
});

export const UpdatePaymentSchema = PaymentSchema.partial().omit({
  id: true,
  payment_number: true,
  order_id: true,
  total_amount: true,
  remaining_amount: true,
  created_at: true,
  updated_at: true,
});

export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePayment = z.infer<typeof CreatePaymentSchema>;
export type UpdatePayment = z.infer<typeof UpdatePaymentSchema>;
