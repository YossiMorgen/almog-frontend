import { z } from 'zod';

export const CourseEnrollmentSchema = z.object({
  id: z.number().int().positive().optional(),
  course_id: z.number().int().positive(),
  student_id: z.number().int().positive(),
  enrollment_date: z.date().default(() => new Date()),
  status: z.enum(['enrolled', 'waitlisted', 'dropped', 'completed']).default('enrolled'),
  notes: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: z.number().int().positive().optional(),
});

export const CreateCourseEnrollmentSchema = CourseEnrollmentSchema.omit({
  id: true,
  enrollment_date: true,
  created_at: true,
  updated_at: true,
});

export const UpdateCourseEnrollmentSchema = CourseEnrollmentSchema.partial().omit({
  id: true,
  course_id: true,
  student_id: true,
  enrollment_date: true,
  created_at: true,
  updated_at: true,
});

export type CourseEnrollment = z.infer<typeof CourseEnrollmentSchema>;
export type CreateCourseEnrollment = z.infer<typeof CreateCourseEnrollmentSchema>;
export type UpdateCourseEnrollment = z.infer<typeof UpdateCourseEnrollmentSchema>;
