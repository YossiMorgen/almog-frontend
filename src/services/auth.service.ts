import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser, onAuthStateChanged } from '@angular/fire/auth';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<FirebaseUser | null>(null);
  public AuthSubject = new Subject<any>();
  
  get firebaseUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }
  
  get firebaseUserObservable(): Observable<FirebaseUser | null> {
    return this.AuthSubject.asObservable();
  }

  get authState$(): Observable<FirebaseUser | null> {
    return this.authStateSubject.asObservable();
  }

  constructor(
    private auth: Auth,
    private router: Router
  ) { 
    this.initializeAuthState();
    this.loadUserFromStorage();
  }

  private initializeAuthState(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.authStateSubject.next(user);
      this.AuthSubject.next(user);
      if (user) {
        console.log('✅ Firebase auth state changed - user logged in:', user.uid);
      } else {
        console.log('ℹ️ Firebase auth state changed - user logged out');
      }
    });
  }


  async login(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      if (this.auth.currentUser?.uid) {
        return;
      }
      const result = await signInWithPopup(this.auth, provider);
      
      
      // Verify the user is actually logged in
      if (!this.auth.currentUser) {
        throw new Error('Authentication failed - no user found after login');
      }
      
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    localStorage.removeItem('currentUser');
    this.authStateSubject.next(null);
    this.AuthSubject.next(null);
    this.router.navigate(['/login']);
  }

  async getToken(): Promise<string | undefined> {
    try {
      await this.auth.authStateReady();
      const user = this.auth.currentUser;
      if (!user) {
        return undefined;
      }
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return undefined;
    }
  }

  async getFreshToken(): Promise<string | undefined> {
    try {
      await this.auth.authStateReady();
      const user = this.auth.currentUser;
      if (!user) {
        console.log('❌ No user found for token refresh');
        return undefined;
      }
      
      // Force refresh the token
      const freshToken = await user.getIdToken(true);
      console.log('✅ Successfully refreshed Firebase token');
      return freshToken;
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      return undefined;
    }
  }

  public async isLoggedIn(): Promise<boolean> {
    await this.auth.authStateReady();
    const user = this.auth.currentUser;
    return !!user && !!user.uid;
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
      } catch (error: any) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

}