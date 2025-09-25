import { z } from 'zod';

export const RoleSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().max(50).min(1),
  description: z.string().optional(),
  is_system: z.boolean().default(false),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const CreateRoleSchema = RoleSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateRoleSchema = RoleSchema.partial().omit({
  id: true,
  is_system: true,
  created_at: true,
  updated_at: true,
});

export type Role = z.infer<typeof RoleSchema>;
export type CreateRole = z.infer<typeof CreateRoleSchema>;
export type UpdateRole = z.infer<typeof UpdateRoleSchema>;
