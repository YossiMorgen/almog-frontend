import { z } from 'zod';

export const ClassSchema = z.object({
  id: z.number().int().positive().optional(),
  course_id: z.number().int().positive(),
  class_number: z.number().int().positive(),
  class_date: z.date(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  location_id: z.number().int().positive().optional(),
  instructor_id: z.number().int().positive().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'postponed']).default('scheduled'),
  notes: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreateClassSchema = ClassSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateClassSchema = ClassSchema.partial().omit({
  id: true,
  course_id: true,
  class_number: true,
  created_at: true,
  updated_at: true,
});

export type Class = z.infer<typeof ClassSchema>;
export type CreateClass = z.infer<typeof CreateClassSchema>;
export type UpdateClass = z.infer<typeof UpdateClassSchema>;
