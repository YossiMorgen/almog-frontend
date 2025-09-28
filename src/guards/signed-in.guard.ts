import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class SignedInGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const tokenPromise = this.authService.getToken();
    const timeoutPromise = new Promise<undefined>((_, reject) => 
      setTimeout(() => reject(new Error('Token request timeout')), 5000)
    );
    
    return from(Promise.race([tokenPromise, timeoutPromise])).pipe(
      map(token => {
        if (token) {
          if (this.router.url === '/login') {
            console.log('SignedInGuard: Token found, redirecting to dashboard');
            return this.router.createUrlTree(['/home']);
          }
          console.log('SignedInGuard: Token found, allowing access to route');
          return true;
        } else {
          console.log('SignedInGuard: No token found, allowing access to login');
          return true;
        }
      }),
      catchError(error => {
        console.log('SignedInGuard: Error checking token, allowing access to login');
        return from([true]);
      })
    );
  }
}
