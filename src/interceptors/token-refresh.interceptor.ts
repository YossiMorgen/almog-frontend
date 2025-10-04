import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { API_CONFIG } from '../config/api.config';
import { catchError, switchMap, throwError } from 'rxjs';
import { from } from 'rxjs';

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isApi = req.url.startsWith(API_CONFIG.BASE_URL);
  const isLoginEndpoint = req.url.includes('/api/auth/login');
  const isHealthEndpoint = req.url.includes('/health');
  const isAuthEndpoint = req.url.includes('/api/auth/');

  // Skip token refresh logic for non-API requests, login, health, and auth endpoints
  if (!isApi || isLoginEndpoint || isHealthEndpoint || isAuthEndpoint) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if it's a 419 Token Expired error (specific status for token expiration)
      if (error.status === 419) {
        console.log('🔄 419 Token Expired - attempting token refresh...');
        
        // Check if user is still logged in
        return from(authService.isLoggedIn()).pipe(
          switchMap(isLoggedIn => {
            if (!isLoggedIn) {
              console.log('❌ User not logged in - redirecting to login');
              router.navigate(['/login']);
              return throwError(() => error);
            }

            // Try to get a fresh token
            return from(authService.getFreshToken()).pipe(
              switchMap(freshToken => {
                if (!freshToken) {
                  console.log('❌ Failed to get fresh token - redirecting to login');
                  router.navigate(['/login']);
                  return throwError(() => error);
                }

                console.log('✅ Got fresh token - retrying request');
                
                // Clone the original request with the fresh token
                const retryReq = req.clone({
                  setHeaders: {
                    authorization: `Bearer ${freshToken}`
                  }
                });

                // Retry the request with the fresh token
                return next(retryReq);
              }),
              catchError(refreshError => {
                console.log('❌ Token refresh failed:', refreshError);
                router.navigate(['/login']);
                return throwError(() => error);
              })
            );
          }),
          catchError(refreshError => {
            console.log('❌ Auth check failed:', refreshError);
            router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }

      // For non-419 errors, just pass them through
      return throwError(() => error);
    })
  );
};
