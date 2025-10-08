import { z } from 'zod';
import { PermissionSchema } from './permission';
import { RoleSchema } from './role';
import { UserTenantsSchema } from './tenant';

// Re-export the schemas with aliases to avoid conflicts
const UserPermissionSchema = PermissionSchema;
const UserRoleSchema = RoleSchema;

export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  firebase_uid: z.string().min(1).optional(),
  email: z.string().email(),
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  display_name: z.string().max(200).optional(),
  profile_picture_url: z.string().url().or(z.literal('')).optional(),
  phone: z.string().max(20).optional(),
  language: z.enum(['en', 'he']).optional().default('en'),
  settings: z.record(z.string(), z.any()).default({}),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
  last_login: z.date().optional(),
  permissions: z.array(UserPermissionSchema).optional(),
  tenants: z.array(UserTenantsSchema).optional(),
  roles: z.array(UserRoleSchema).optional(),
  roleIds: z.array(z.number().int().positive()).optional(),
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
  firebase_uid: true,
  created_at: true,
  updated_at: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
