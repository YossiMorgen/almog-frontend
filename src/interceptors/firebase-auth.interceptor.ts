import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { API_CONFIG } from '../config/api.config';
import { from, switchMap, catchError } from 'rxjs';

export const firebaseAuthInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  
  const isApi = req.url.startsWith(API_CONFIG.BASE_URL);
  const isHealthEndpoint = req.url.includes('/health');
  
  console.log('🔐 Firebase Auth Interceptor - URL:', req.url, 'isApi:', isApi, 'isHealth:', isHealthEndpoint);

  // Skip token attachment for non-API requests, health endpoints
  if (!isApi || isHealthEndpoint) {
    return next(req);
  }

  // Use Firebase token authentication for all other API requests
  const tokenPromise = authService.getToken();
  const timeoutPromise = new Promise<undefined>((_, reject) => 
    setTimeout(() => reject(new Error('Token request timeout')), 5000)
  );
  
  return from(Promise.race([tokenPromise, timeoutPromise])).pipe(
    switchMap(token => {
      if (token) {
        console.log('✅ Attaching Firebase token to request:', req.url);
        const modified = req.clone({
          setHeaders: { authorization: `Bearer ${token}` }
        });
        return next(modified);
      }
      
      console.log('⚠️ No token available for request:', req.url);
      return next(req);
    }),
    catchError(error => {
      console.log('❌ Token retrieval failed for:', req.url, error);
      return next(req);
    })
  );
};