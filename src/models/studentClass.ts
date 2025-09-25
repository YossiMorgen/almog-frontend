import { z } from 'zod';

export const StudentClassSchema = z.object({
  id: z.number().int().positive().optional(),
  class_id: z.number().int().positive(),
  student_id: z.number().int().positive(),
  attendance_status: z.enum(['present', 'absent', 'late', 'excused']).default('present'),
  notes: z.string().optional(),
  marked_at: z.date().optional(),
  marked_by: z.number().int().positive().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreateStudentClassSchema = StudentClassSchema.omit({
  id: true,
});

export const UpdateStudentClassSchema = StudentClassSchema.partial().omit({
  id: true,
  class_id: true,
  student_id: true,
});

export type StudentClass = z.infer<typeof StudentClassSchema>;
export type CreateStudentClass = z.infer<typeof CreateStudentClassSchema>;
export type UpdateStudentClass = z.infer<typeof UpdateStudentClassSchema>;
