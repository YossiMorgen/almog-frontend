/**
 * Permissions Configuration
 * 
 * This file contains all available permissions in the system.
 * It serves as a single source of truth for permission names and provides
 * helper functions for common permission patterns.
 */

// =====================================================
// PERMISSION DEFINITIONS
// =====================================================

export const PERMISSIONS = {
  // User Management
  USERS: {
    CREATE: 'users.create',
    READ: 'users.read',
    UPDATE: 'users.update',
    DELETE: 'users.delete',
    MANAGE_ROLES: 'users.manage_roles'
  },

  // Student Management
  STUDENTS: {
    CREATE: 'students.create',
    READ: 'students.read',
    UPDATE: 'students.update',
    DELETE: 'students.delete'
  },

  // Course Management
  COURSES: {
    CREATE: 'courses.create',
    READ: 'courses.read',
    UPDATE: 'courses.update',
    DELETE: 'courses.delete',
    MANAGE_ENROLLMENTS: 'courses.manage_enrollments'
  },

  // Class Management
  CLASSES: {
    CREATE: 'classes.create',
    READ: 'classes.read',
    UPDATE: 'classes.update',
    DELETE: 'classes.delete',
    MARK_ATTENDANCE: 'classes.mark_attendance'
  },

  // Payment Management
  PAYMENTS: {
    CREATE: 'payments.create',
    READ: 'payments.read',
    UPDATE: 'payments.update',
    DELETE: 'payments.delete',
    PROCESS: 'payments.process'
  },

  // Product Management
  PRODUCTS: {
    CREATE: 'products.create',
    READ: 'products.read',
    UPDATE: 'products.update',
    DELETE: 'products.delete'
  },

  // Order Management
  ORDERS: {
    CREATE: 'orders.create',
    READ: 'orders.read',
    UPDATE: 'orders.update',
    DELETE: 'orders.delete'
  },

  // Season Management
  SEASONS: {
    CREATE: 'seasons.create',
    READ: 'seasons.read',
    UPDATE: 'seasons.update',
    DELETE: 'seasons.delete'
  }
} as const;

// =====================================================
// ROLE-BASED PERMISSION GROUPS
// =====================================================

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(PERMISSIONS).flat(),
} as const;

// =====================================================
// PERMISSION GROUPS BY FUNCTIONALITY
// =====================================================

export const PERMISSION_GROUPS = {
  // Student Management
  STUDENT_MANAGEMENT: [
    PERMISSIONS.STUDENTS.CREATE,
    PERMISSIONS.STUDENTS.READ,
    PERMISSIONS.STUDENTS.UPDATE,
    PERMISSIONS.STUDENTS.DELETE
  ],

  // Course Management
  COURSE_MANAGEMENT: [
    PERMISSIONS.COURSES.CREATE,
    PERMISSIONS.COURSES.READ,
    PERMISSIONS.COURSES.UPDATE,
    PERMISSIONS.COURSES.DELETE,
    PERMISSIONS.COURSES.MANAGE_ENROLLMENTS
  ],

  // Class Management
  CLASS_MANAGEMENT: [
    PERMISSIONS.CLASSES.CREATE,
    PERMISSIONS.CLASSES.READ,
    PERMISSIONS.CLASSES.UPDATE,
    PERMISSIONS.CLASSES.DELETE,
    PERMISSIONS.CLASSES.MARK_ATTENDANCE
  ],

  // User Management (Admin Only)
  USER_MANAGEMENT: [
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.READ,
    PERMISSIONS.USERS.UPDATE,
    PERMISSIONS.USERS.DELETE,
    PERMISSIONS.USERS.MANAGE_ROLES
  ],

  // Financial Management
  FINANCIAL_MANAGEMENT: [
    ...Object.values(PERMISSIONS.PAYMENTS),
    ...Object.values(PERMISSIONS.ORDERS),
    ...Object.values(PERMISSIONS.PRODUCTS)
  ],

  // Read-Only Access
  READ_ONLY: [
    PERMISSIONS.STUDENTS.READ,
    PERMISSIONS.COURSES.READ,
    PERMISSIONS.CLASSES.READ,
    PERMISSIONS.PAYMENTS.READ,
    PERMISSIONS.PRODUCTS.READ,
    PERMISSIONS.ORDERS.READ,
    PERMISSIONS.SEASONS.READ
  ]
} as const;

// =====================================================
// HELPER FUNCTIONS
// =====================================================
/**
 * Get permissions for a specific functionality group
 */
export function getPermissionGroup(groupName: keyof typeof PERMISSION_GROUPS): readonly string[] {
  return PERMISSION_GROUPS[groupName] as readonly string[] || [];
}

/**
 * Check if a permission is admin-only
 */
export function isAdminPermission(permission: string): boolean {
  return Object.values(PERMISSIONS.USERS).includes(permission as any);
}


/**
 * Get all CRUD permissions for a module
 */
export function getCrudPermissions(module: keyof typeof PERMISSIONS): readonly string[] {
  const modulePermissions = PERMISSIONS[module];
  return Object.values(modulePermissions);
}

/**
 * Get read permissions for multiple modules
 */
export function getReadPermissions(...modules: (keyof typeof PERMISSIONS)[]): readonly string[] {
  return modules.map(module => PERMISSIONS[module].READ);
}

/**
 * Get create permissions for multiple modules
 */
export function getCreatePermissions(...modules: (keyof typeof PERMISSIONS)[]): readonly string[] {
  return modules.map(module => PERMISSIONS[module].CREATE);
}

/**
 * Get update permissions for multiple modules
 */
export function getUpdatePermissions(...modules: (keyof typeof PERMISSIONS)[]): readonly string[] {
  return modules.map(module => PERMISSIONS[module].UPDATE);
}

/**
 * Get delete permissions for multiple modules
 */
export function getDeletePermissions(...modules: (keyof typeof PERMISSIONS)[]): readonly string[] {
  return modules.map(module => PERMISSIONS[module].DELETE);
}

// =====================================================
// COMMON PERMISSION PATTERNS
// =====================================================

export const COMMON_PATTERNS = {
  // Basic CRUD for any module
  STUDENT_CRUD: getCrudPermissions('STUDENTS'),
  COURSE_CRUD: getCrudPermissions('COURSES'),
  CLASS_CRUD: getCrudPermissions('CLASSES'),
  USER_CRUD: getCrudPermissions('USERS'),
  PRODUCT_CRUD: getCrudPermissions('PRODUCTS'),
  ORDER_CRUD: getCrudPermissions('ORDERS'),
  PAYMENT_CRUD: getCrudPermissions('PAYMENTS'),
  SEASON_CRUD: getCrudPermissions('SEASONS'),

  // Multi-role access patterns
  PAYMENT_OR_ADMIN: [
    PERMISSIONS.PAYMENTS.READ,
    PERMISSIONS.USERS.READ
  ],

  COURSE_OR_ADMIN: [
    PERMISSIONS.COURSES.READ,
    PERMISSIONS.USERS.READ
  ]
} as const;

// =====================================================
// PERMISSION VALIDATION
// =====================================================

/**
 * Validate that a permission exists in the system
 */
export function isValidPermission(permission: string): boolean {
  return Object.values(PERMISSIONS).flat().some(modulePermissions => 
    Object.values(modulePermissions).includes(permission as any)
  );
}

/**
 * Get all valid permissions
 */
export function getAllPermissions(): readonly string[] {
  return Object.values(PERMISSIONS).flatMap(modulePermissions => 
    Object.values(modulePermissions)
  ) as readonly string[];
}

/**
 * Get permission display name
 */
export function getPermissionDisplayName(permission: string): string {
  const permissionMap: Record<string, string> = {
    [PERMISSIONS.USERS.CREATE]: 'Create Users',
    [PERMISSIONS.USERS.READ]: 'View Users',
    [PERMISSIONS.USERS.UPDATE]: 'Update Users',
    [PERMISSIONS.USERS.DELETE]: 'Delete Users',
    [PERMISSIONS.USERS.MANAGE_ROLES]: 'Manage User Roles',
    
    [PERMISSIONS.STUDENTS.CREATE]: 'Create Students',
    [PERMISSIONS.STUDENTS.READ]: 'View Students',
    [PERMISSIONS.STUDENTS.UPDATE]: 'Update Students',
    [PERMISSIONS.STUDENTS.DELETE]: 'Delete Students',
    
    [PERMISSIONS.COURSES.CREATE]: 'Create Courses',
    [PERMISSIONS.COURSES.READ]: 'View Courses',
    [PERMISSIONS.COURSES.UPDATE]: 'Update Courses',
    [PERMISSIONS.COURSES.DELETE]: 'Delete Courses',
    [PERMISSIONS.COURSES.MANAGE_ENROLLMENTS]: 'Manage Course Enrollments',
    
    [PERMISSIONS.CLASSES.CREATE]: 'Create Classes',
    [PERMISSIONS.CLASSES.READ]: 'View Classes',
    [PERMISSIONS.CLASSES.UPDATE]: 'Update Classes',
    [PERMISSIONS.CLASSES.DELETE]: 'Delete Classes',
    [PERMISSIONS.CLASSES.MARK_ATTENDANCE]: 'Mark Attendance',
    
    [PERMISSIONS.PAYMENTS.CREATE]: 'Create Payments',
    [PERMISSIONS.PAYMENTS.READ]: 'View Payments',
    [PERMISSIONS.PAYMENTS.UPDATE]: 'Update Payments',
    [PERMISSIONS.PAYMENTS.DELETE]: 'Delete Payments',
    [PERMISSIONS.PAYMENTS.PROCESS]: 'Process Payments',
    
    [PERMISSIONS.PRODUCTS.CREATE]: 'Create Products',
    [PERMISSIONS.PRODUCTS.READ]: 'View Products',
    [PERMISSIONS.PRODUCTS.UPDATE]: 'Update Products',
    [PERMISSIONS.PRODUCTS.DELETE]: 'Delete Products',
    
    [PERMISSIONS.ORDERS.CREATE]: 'Create Orders',
    [PERMISSIONS.ORDERS.READ]: 'View Orders',
    [PERMISSIONS.ORDERS.UPDATE]: 'Update Orders',
    [PERMISSIONS.ORDERS.DELETE]: 'Delete Orders',
    
    [PERMISSIONS.SEASONS.CREATE]: 'Create Seasons',
    [PERMISSIONS.SEASONS.READ]: 'View Seasons',
    [PERMISSIONS.SEASONS.UPDATE]: 'Update Seasons',
    [PERMISSIONS.SEASONS.DELETE]: 'Delete Seasons'
  };
  
  return permissionMap[permission] || permission;
}

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]];
export type RoleName = keyof typeof ROLE_PERMISSIONS;
export type PermissionGroup = keyof typeof PERMISSION_GROUPS;
export type ModuleName = keyof typeof PERMISSIONS;
