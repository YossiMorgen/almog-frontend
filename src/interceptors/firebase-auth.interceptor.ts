import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { API_CONFIG } from '../config/api.config';
import { from, switchMap, catchError } from 'rxjs';

export const firebaseAuthInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  
  const isApi = req.url.startsWith(API_CONFIG.BASE_URL);
  const isLoginEndpoint = req.url.includes('/api/auth/login');
  const isHealthEndpoint = req.url.includes('/health');

  if (isApi && !isLoginEndpoint && !isHealthEndpoint) {
    
    const tokenPromise = authService.getToken();
    const timeoutPromise = new Promise<undefined>((_, reject) => 
      setTimeout(() => reject(new Error('Token request timeout')), 5000)
    );
    
    return from(Promise.race([tokenPromise, timeoutPromise])).pipe(
      switchMap(token => {
        if (token) {
          const modified = req.clone({
            setHeaders: { authorization: `Bearer ${token}` }
          });
          return next(modified);
        }
        return next(req);
      }),
      catchError(error => {
        return next(req);
      })
    );
  }
  
  return next(req);
};