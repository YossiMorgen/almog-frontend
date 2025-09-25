import { z } from 'zod';

export const RolePermissionSchema = z.object({
  role_id: z.number().int().positive(),
  permission_id: z.number().int().positive(),
  created_at: z.date().optional(),
});

export const CreateRolePermissionSchema = RolePermissionSchema.omit({
  created_at: true,
});

export type RolePermission = z.infer<typeof RolePermissionSchema>;
export type CreateRolePermission = z.infer<typeof CreateRolePermissionSchema>;
