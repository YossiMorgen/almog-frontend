import { z } from 'zod';
import { PermissionSchema } from './permission';
import { RoleSchema } from './role';

export const TenantSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(200),
  domain: z.string().max(100).optional(),
  subdomain: z.string().max(100).optional(),
  roles: z.array(RoleSchema).optional(),
  permissions: z.array(PermissionSchema).optional(),
  roleCount: z.number().int().optional(),
  permissionCount: z.number().int().optional(),
});

export const UserTenantsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    tenants: z.array(TenantSchema),
    totalTenants: z.number().int(),
    user: z.object({
      id: z.number().int().positive(),
      email: z.string().email(),
      name: z.string().optional(),
    }),
  }),
});

export type Tenant = z.infer<typeof TenantSchema>;
export type UserTenantsResponse = z.infer<typeof UserTenantsResponseSchema>;
