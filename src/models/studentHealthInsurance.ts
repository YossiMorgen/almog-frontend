import { z } from 'zod';

export const StudentHealthInsuranceSchema = z.object({
  id: z.number().int().positive().optional(),
  tenant_id: z.string().uuid(),
  student_id: z.number().int().positive(),
  health_insurance_id: z.number().int().positive(),
  policy_number: z.string().max(100).optional(),
  group_number: z.string().max(100).optional(),
  effective_date: z.date().optional(),
  expiration_date: z.date().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: z.number().int().positive().optional(),
});

export const CreateStudentHealthInsuranceSchema = StudentHealthInsuranceSchema.omit({
  id: true,
  tenant_id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateStudentHealthInsuranceSchema = StudentHealthInsuranceSchema.partial().omit({
  id: true,
  tenant_id: true,
  student_id: true,
  health_insurance_id: true,
  created_at: true,
  updated_at: true,
});

export type StudentHealthInsurance = z.infer<typeof StudentHealthInsuranceSchema>;
export type CreateStudentHealthInsurance = z.infer<typeof CreateStudentHealthInsuranceSchema>;
export type UpdateStudentHealthInsurance = z.infer<typeof UpdateStudentHealthInsuranceSchema>;



