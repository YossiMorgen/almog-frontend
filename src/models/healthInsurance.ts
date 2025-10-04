import { z } from 'zod';

export const HealthInsuranceSchema = z.object({
  id: z.number().int().positive().optional(),
  tenant_id: z.string().uuid(),
  name: z.string().max(200).min(1),
  description: z.string().optional(),
  contact_phone: z.string().max(20).optional(),
  contact_email: z.string().email().optional(),
  website: z.string().url().optional(),
  is_active: z.boolean().default(true),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: z.number().int().positive().optional(),
});

export const CreateHealthInsuranceSchema = HealthInsuranceSchema.omit({
  id: true,
  tenant_id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateHealthInsuranceSchema = HealthInsuranceSchema.partial().omit({
  id: true,
  tenant_id: true,
  created_at: true,
  updated_at: true,
});

export type HealthInsurance = z.infer<typeof HealthInsuranceSchema>;
export type CreateHealthInsurance = z.infer<typeof CreateHealthInsuranceSchema>;
export type UpdateHealthInsurance = z.infer<typeof UpdateHealthInsuranceSchema>;



