import { z } from 'zod';
import { PermissionSchema } from './permission';
import { RoleSchema } from './role';

export const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(200),
  domain: z.string().max(100).optional(),
  subdomain: z.string().max(100).optional(),
  language: z.enum(['en', 'he']).default('he'),
  roles: z.array(RoleSchema).optional(),
  permissions: z.array(PermissionSchema).optional(),
  roleCount: z.number().int().optional(),
  permissionCount: z.number().int().optional(),
});

export const CreateTenantSchema = z.object({
  name: z.string().min(1, 'Tenant name is required').max(200, 'Tenant name too long'),
  domain: z.string().max(100, 'Domain too long').optional(),
  subdomain: z.string().max(50, 'Subdomain too long').optional(),
  language: z.enum(['en', 'he']).default('he').optional(),
  settings: z.record(z.string(), z.unknown()).optional().default({})
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
export const UserTenantsSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(200),
});

export const CreateTenantResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    tenant: TenantSchema,
    message: z.string()
  })
});

export type Tenant = z.infer<typeof TenantSchema>;
export type CreateTenant = z.infer<typeof CreateTenantSchema>;
export type UserTenantsResponse = z.infer<typeof UserTenantsResponseSchema>;
export type CreateTenantResponse = z.infer<typeof CreateTenantResponseSchema>;
export type UserTenants = z.infer<typeof UserTenantsSchema>;
