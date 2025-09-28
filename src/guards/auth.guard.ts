import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
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
          console.log('AuthGuard: Token found, allowing access');
          return true;
        } else {
          console.log('AuthGuard: No token found, redirecting to login');
          return this.router.createUrlTree(['/login']);
        }
      }),
      catchError(error => {
        console.log('AuthGuard: Error checking token, redirecting to login');
        return from([this.router.createUrlTree(['/login'])]);
      })
    );
  }
}
