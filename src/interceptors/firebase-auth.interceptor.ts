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
  console.log('req.url', req.url, isApi, isLoginEndpoint, isHealthEndpoint);
  

  if (isApi && !isLoginEndpoint && !isHealthEndpoint) {
    
    // Use Firebase token authentication for all frontend requests
    const tokenPromise = authService.getToken();
    const timeoutPromise = new Promise<undefined>((_, reject) => 
      setTimeout(() => reject(new Error('Token request timeout')), 5000)
    );
    
    return from(Promise.race([tokenPromise, timeoutPromise])).pipe(
      switchMap(token => {
        console.log('token', token);
        
        if (token) {
          const modified = req.clone({
            setHeaders: { authorization: `Bearer ${token}` }
          });
          return next(modified);
        }
        console.log('no token for url', req.url);
        return next(req);
      }),
      catchError(error => {
        console.log('error for url', req.url, error);
        return next(req);
      })
    );
  }
  
  return next(req);
};