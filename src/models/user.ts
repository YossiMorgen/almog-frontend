import { z } from 'zod';

export const PermissionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string()
});

export const RoleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string()
});

export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  email: z.string().email(),
  name: z.string().max(200).optional(),
  picture: z.string().url().optional(),
  language: z.enum(['en', 'he']).default('en'),
  permissions: z.array(PermissionSchema).optional(),
  roles: z.array(RoleSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
