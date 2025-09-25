import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Subject, BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';

export interface User {
  id: number;
  firebaseUid: string;
  email: string;
  name: string;
  picture: string;
  verifiedEmail: boolean;
  roles: Array<{ id: number; name: string }>;
  permissions: Array<{ id: number; name: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public AuthSubject = new Subject<any>();

  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient
  ) { 
    this.loadUserFromStorage();
    this.setupAuthStateListener();
  }

  private setupAuthStateListener(): void {
    onAuthStateChanged(this.auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        console.log('Firebase user authenticated:', firebaseUser);
        await this.handleUserProfile(firebaseUser);
      } else {
        console.log('Firebase user signed out');
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
      }
    });
  }

  async login(): Promise<void> {
    try {
      console.log('Starting Firebase login flow...');
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(this.auth, provider);
      console.log('Login successful:', result.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        await this.http.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
          {},
        ).toPromise();
      }
    } catch (error) {
      console.error('Backend logout failed:', error);
    } finally {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
    }
  }

  getToken(): string | null {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return currentUser.accessToken;
    }
    return null;
  }

  get isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private async handleUserProfile(firebaseUser: User): Promise<void> {
    try {
      console.log('Handling user profile for Firebase user:', firebaseUser);
      
      const token = await firebaseUser.getIdToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
          {},
          { headers }
        )
      );

      console.log('Backend response:', response);

      if (response?.success && response.data) {
        console.log('Setting current user:', response.data);
        this.setCurrentUser(response.data);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Backend login failed:', error);
      throw error;
    }
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }
}