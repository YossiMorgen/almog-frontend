import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of, timer, combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    // Wait a tick to let OAuth try-login complete on app start.
    // Adjust delay if needed (0–300ms is usually enough).
    return timer(0).pipe(
      switchMap(() =>
        // Use currentUser$ if you want to ensure the backend user is loaded.
        // If you only care about Google token, you can skip combineLatest and just check isLoggedIn.
        combineLatest([this.authService.currentUser$]).pipe(take(1))
      ),
      map(([user]) => {
        const hasToken = this.authService.isLoggedIn;

        // Option A (strict): require both Google token and backend user
        // if (hasToken && user) return true;

        // Option B (lenient): allow as soon as Google token is valid
        if (hasToken) return true;

        // Return a UrlTree instead of imperative navigation
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
