import { z } from 'zod';

export const UserRoleSchema = z.object({
  user_id: z.number().int().positive(),
  role_id: z.number().int().positive(),
  assigned_at: z.date().optional(),
  assigned_by: z.number().int().positive().optional(),
});

export const CreateUserRoleSchema = UserRoleSchema.omit({
  assigned_at: true,
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type CreateUserRole = z.infer<typeof CreateUserRoleSchema>;
