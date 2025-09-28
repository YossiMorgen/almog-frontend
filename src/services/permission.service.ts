import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SqlUserService } from '../services/sql-user.service';
import { User } from '../models/user';
import { 
  PERMISSIONS, 
  COMMON_PATTERNS, 
  isValidPermission, 
  getPermissionDisplayName,
  Permission,
  RoleName,
  PermissionGroup
} from '../config/permissions.config';

/**
 * Permission Service
 * 
 * Provides utility methods for checking user permissions in components and templates.
 * This service centralizes permission logic and provides type-safe permission checking.
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  
  constructor(private sqlUserService: SqlUserService) {}

  /**
   * Get the current user
   */
  getCurrentUser(): Observable<User | null> {
    return this.sqlUserService.currentUser$;
  }

  /**
   * Check if user is super admin
   */
  private isSuperAdmin(user: User | null): boolean {
    return user?.roles?.some(role => role.name === 'super_admin') || false;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: Permission): Observable<boolean> {
    return this.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!user || !user.permissions) {
          return false;
        }
        
        // Check if user is super admin - bypass all permission checks
        if (this.isSuperAdmin(user)) {
          return true;
        }
        
        return user.permissions.some(p => p.name === permission);
      })
    );
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: Permission[]): Observable<boolean> {
    return this.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!user || !user.permissions) {
          return false;
        }
        
        // Check if user is super admin - bypass all permission checks
        if (this.isSuperAdmin(user)) {
          return true;
        }
        
        const userPermissions = user.permissions.map(p => p.name);
        return permissions.some(permission => userPermissions.includes(permission));
      })
    );
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(permissions: Permission[]): Observable<boolean> {
    return this.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!user || !user.permissions) {
          return false;
        }
        
        // Check if user is super admin - bypass all permission checks
        if (this.isSuperAdmin(user)) {
          return true;
        }
        
        const userPermissions = user.permissions.map(p => p.name);
        return permissions.every(permission => userPermissions.includes(permission));
      })
    );
  }
  /**
   * Get user's role name (if available)
   */
  getUserRole(): Observable<string | null> {
    return this.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!user || !user.roles || user.roles.length === 0) {
          return null;
        }
        // Return the first role (assuming single role for now)
        return user.roles[0].name;
      })
    );
  }

  /**
   * Get all user permissions
   */
  getUserPermissions(): Observable<Permission[]> {
    return this.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!user || !user.permissions) {
          return [];
        }
        return user.permissions.map(p => p.name as Permission);
      })
    );
  }

  /**
   * Check if permission is valid
   */
  isValidPermission(permission: string): boolean {
    return isValidPermission(permission);
  }

  /**
   * Get display name for permission
   */
  getPermissionDisplayName(permission: Permission): string {
    return getPermissionDisplayName(permission);
  }

  /**
   * Get all available permissions
   */
  getAllPermissions(): Permission[] {
    return Object.values(PERMISSIONS).flat() as unknown as Permission[];
  }

  /**
   * Check if user has read access to a module
   */
  canRead(module: keyof typeof PERMISSIONS): Observable<boolean> {
    return this.hasPermission(PERMISSIONS[module].READ);
  }

  /**
   * Check if user has create access to a module
   */
  canCreate(module: keyof typeof PERMISSIONS): Observable<boolean> {
    return this.hasPermission(PERMISSIONS[module].CREATE);
  }

  /**
   * Check if user has update access to a module
   */
  canUpdate(module: keyof typeof PERMISSIONS): Observable<boolean> {
    return this.hasPermission(PERMISSIONS[module].UPDATE);
  }

  /**
   * Check if user has delete access to a module
   */
  canDelete(module: keyof typeof PERMISSIONS): Observable<boolean> {
    return this.hasPermission(PERMISSIONS[module].DELETE);
  }

  /**
   * Check if user has any CRUD access to a module
   */
  canManage(module: keyof typeof PERMISSIONS): Observable<boolean> {
    const crudPermissions = [
      PERMISSIONS[module].READ,
      PERMISSIONS[module].CREATE,
      PERMISSIONS[module].UPDATE,
      PERMISSIONS[module].DELETE
    ];
    return this.hasAnyPermission(crudPermissions);
  }
}
