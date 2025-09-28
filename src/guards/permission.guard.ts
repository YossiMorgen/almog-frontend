import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { map, take, switchMap, catchError, timeout } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SqlUserService } from '../services/sql-user.service';
import { User } from '../models/user';
import { PERMISSIONS, isValidPermission, getPermissionDisplayName } from '../config/permissions.config';

export interface PermissionGuardConfig {
  permissions: string[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  redirectTo?: string; // Where to redirect if access denied
}

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private sqlUserService: SqlUserService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const config = route.data['permissions'] as PermissionGuardConfig;
    
    if (!config || !config.permissions || config.permissions.length === 0) {
      console.warn('PermissionGuard: No permissions configured for route');
      return of(true);
    }

    // Validate permissions exist in config
    const invalidPermissions = config.permissions.filter(p => !isValidPermission(p));
    if (invalidPermissions.length > 0) {
      console.error('PermissionGuard: checkPermissions: Invalid permissions found:', invalidPermissions);
      return of(this.handleAccessDenied(config));
    }

    return this.checkAuthentication().pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return of(this.router.createUrlTree(['/login']));
        }

        return this.checkPermissions(config);
      })
    );
  }

  private checkAuthentication(): Observable<boolean> {
    return new Observable(observer => {
      // Wait for Firebase auth state to be ready before checking
      this.authService.isLoggedIn().then(isAuthenticated => {
        observer.next(isAuthenticated);
        observer.complete();
      }).catch(error => {
        console.error('PermissionGuard: Error checking authentication:', error);
        observer.next(false);
        observer.complete();
      });
    });
  }

  private checkPermissions(config: PermissionGuardConfig): Observable<boolean | UrlTree> {
    return from(this.sqlUserService.checkUserAndLogin()).pipe(
      map(user => {
        console.log('PermissionGuard: User check result:', user ? 'User found' : 'No user');
        
        if (!user) {
          console.log('PermissionGuard: No user found, redirecting to unauthorized');
          return this.handleAccessDenied(config);
        }

        // Check if user is super admin - bypass all permission checks
        const isSuperAdmin = user.roles?.some(role => role.name === 'super_admin');
        if (isSuperAdmin) {
          console.log('PermissionGuard: Super admin detected, allowing access');
          return true;
        }

        const userPermissions = this.getUserPermissions(user);
        console.log('PermissionGuard: User permissions:', userPermissions);
        console.log('PermissionGuard: Required permissions:', config.permissions);

        const hasAccess = this.checkPermissionAccess(userPermissions, config.permissions, config.requireAll);
        
        if (hasAccess) {
          console.log('PermissionGuard: Access granted');
          return true;
        } else {
          console.log('PermissionGuard: Access denied - insufficient permissions');
          return this.handleAccessDenied(config);
        }
      }),
      catchError(error => {
        console.error('PermissionGuard: Error checking permissions:', error);
        console.error('PermissionGuard: Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        return of(this.router.createUrlTree(['/login']));
      }),
      timeout(15000) // Increased to 15 second timeout
    );
  }

  private getUserPermissions(user: User): string[] {
    if (!user.permissions) {
      return [];
    }
    return user.permissions.map(permission => permission.name);
  }

  private checkPermissionAccess(userPermissions: string[], requiredPermissions: string[], requireAll: boolean = true): boolean {
    if (requireAll) {
      // User must have ALL required permissions
      return requiredPermissions.every(permission => userPermissions.includes(permission));
    } else {
      // User must have ANY of the required permissions
      return requiredPermissions.some(permission => userPermissions.includes(permission));
    }
  }

  private handleAccessDenied(config: PermissionGuardConfig): UrlTree {
    const redirectTo = config.redirectTo || '/unauthorized';
    console.log('PermissionGuard: Handling access denied, redirecting to:', redirectTo);
    return this.router.createUrlTree([redirectTo]);
  }
}

// Helper function to create permission guard data
export function requirePermissions(permissions: readonly string[], options?: Partial<PermissionGuardConfig>): PermissionGuardConfig {
  // Validate permissions
  const invalidPermissions = permissions.filter(p => !isValidPermission(p));
  if (invalidPermissions.length > 0) {
    console.warn('PermissionGuard: requirePermissions: Invalid permissions detected:', invalidPermissions);
  }

  return {
    permissions: [...permissions], // Convert readonly array to mutable
    requireAll: true,
    redirectTo: '/unauthorized',
    ...options
  };
}

// Helper function for "any" permission (user needs at least one)
export function requireAnyPermission(permissions: readonly string[], options?: Partial<PermissionGuardConfig>): PermissionGuardConfig {
  // Validate permissions
  const invalidPermissions = permissions.filter(p => !isValidPermission(p));
  if (invalidPermissions.length > 0) {
    console.warn('PermissionGuard: requireAnyPermission: Invalid permissions detected:', invalidPermissions);
  }

  return {
    permissions: [...permissions], // Convert readonly array to mutable
    requireAll: false,
    redirectTo: '/unauthorized',
    ...options
  };
}
