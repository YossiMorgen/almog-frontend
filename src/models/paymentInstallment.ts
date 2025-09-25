import { z } from 'zod';

export const PaymentInstallmentSchema = z.object({
  id: z.number().int().positive().optional(),
  payment_id: z.number().int().positive(),
  installment_number: z.number().int().positive(),
  amount: z.number().positive(),
  payment_method: z.enum(['cash', 'check', 'credit_card', 'debit_card', 'bank_transfer', 'other']),
  payment_date: z.date(),
  transaction_reference: z.string().max(200).optional(),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled', 'refunded']).default('pending'),
  notes: z.string().optional(),
  processed_at: z.date().optional(),
  processed_by: z.number().int().positive().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreatePaymentInstallmentSchema = PaymentInstallmentSchema.omit({
  id: true,
  processed_at: true,
  created_at: true,
  updated_at: true,
});

export const UpdatePaymentInstallmentSchema = PaymentInstallmentSchema.partial().omit({
  id: true,
  payment_id: true,
  installment_number: true,
  created_at: true,
  updated_at: true,
});

export type PaymentInstallment = z.infer<typeof PaymentInstallmentSchema>;
export type CreatePaymentInstallment = z.infer<typeof CreatePaymentInstallmentSchema>;
export type UpdatePaymentInstallment = z.infer<typeof UpdatePaymentInstallmentSchema>;
