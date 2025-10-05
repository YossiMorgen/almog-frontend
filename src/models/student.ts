import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.number().int().positive().optional(),
  student_code: z.string().max(50).optional(),
  first_name: z.string().max(100).min(1),
  last_name: z.string().max(100).min(1),
  date_of_birth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  emergency_contact_name: z.string().max(200).optional(),
  emergency_contact_phone: z.string().max(20).optional(),
  medical_notes: z.string().optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  postal_code: z.string().max(20).optional(),
  parent_name: z.string().max(200).optional(),
  parent_email: z.string().email().optional(),
  parent_phone: z.string().max(20).optional(),
  language: z.enum(['en', 'he']).optional().default('he'),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: z.number().int().positive().optional(),
});

export const CreateStudentSchema = StudentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateStudentSchema = StudentSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type Student = z.infer<typeof StudentSchema>;
export type CreateStudent = z.infer<typeof CreateStudentSchema>;
export type UpdateStudent = z.infer<typeof UpdateStudentSchema>;
