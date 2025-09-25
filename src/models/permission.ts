import { z } from 'zod';

export const PermissionSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().max(100).min(1),
  module: z.string().max(50).min(1),
  action: z.string().max(50).min(1),
  description: z.string().optional(),
  created_at: z.date().optional(),
});

export const CreatePermissionSchema = PermissionSchema.omit({
  id: true,
  created_at: true,
});

export const UpdatePermissionSchema = PermissionSchema.partial().omit({
  id: true,
  created_at: true,
});

export type Permission = z.infer<typeof PermissionSchema>;
export type CreatePermission = z.infer<typeof CreatePermissionSchema>;
export type UpdatePermission = z.infer<typeof UpdatePermissionSchema>;
