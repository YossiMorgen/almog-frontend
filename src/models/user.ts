import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  google_id: z.string().min(1),
  email: z.string().email(),
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  display_name: z.string().max(200).optional(),
  profile_picture_url: z.string().url().optional(),
  phone: z.string().max(20).optional(),
  is_active: z.boolean().default(true),
  last_login: z.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  google_id: true,
  created_at: true,
  updated_at: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
