import { z } from 'zod';

export const CourseSchema = z.object({
  id: z.number().int().positive().optional(),
  season_id: z.number().int().positive(),
  course_code: z.string().max(50).min(1),
  name: z.string().max(200).min(1),
  description: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  age_group_min: z.number().int().positive().optional(),
  age_group_max: z.number().int().positive().optional(),
  max_students: z.number().int().positive().default(10),
  current_students: z.number().int().min(0).default(0),
  price: z.number().positive(),
  instructor_id: z.number().int().positive().optional(),
  location_id: z.number().int().positive(),
  day_of_week: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  start_date: z.date(),
  end_date: z.date(),
  status: z.enum(['draft', 'open', 'full', 'in_progress', 'completed', 'cancelled']).default('draft'),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: z.number().int().positive().optional(),
});

export const CreateCourseSchema = CourseSchema.omit({
  id: true,
  course_code: true,
  current_students: true,
  created_at: true,
  updated_at: true,
}).extend({
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  start_date: z.string(),
  end_date: z.string(),
});

export const UpdateCourseSchema = CourseSchema.partial().omit({
  id: true,
  course_code: true,
  current_students: true,
  created_at: true,
  updated_at: true,
  start_time: true,
  end_time: true,
  start_date: true,
  end_date: true,
}).extend({
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type Course = z.infer<typeof CourseSchema>;
export type CreateCourse = z.infer<typeof CreateCourseSchema>;
export type UpdateCourse = z.infer<typeof UpdateCourseSchema>;
