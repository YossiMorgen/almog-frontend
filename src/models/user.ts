import { z } from 'zod';
import { PermissionSchema } from './permission';
import { RoleSchema } from './role';
import { UserTenantsSchema } from './tenant';

// Re-export the schemas with aliases to avoid conflicts
const UserPermissionSchema = PermissionSchema;
const UserRoleSchema = RoleSchema;

export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  email: z.string().email(),
  name: z.string().max(200).optional(),
  picture: z.string().url().optional(),
  language: z.enum(['en', 'he']).default('en'),
  settings: z.record(z.string(), z.any()).default({}),
  notes: z.string().optional(),
  permissions: z.array(UserPermissionSchema).optional(),
  tenants: z.array(UserTenantsSchema).optional(),
  roles: z.array(UserRoleSchema).optional(),
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

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
