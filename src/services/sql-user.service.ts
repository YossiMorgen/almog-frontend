import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { User, CreateUser, UpdateUser } from '../models/user';
import { AuthService } from './auth.service';
import { LocaleService } from './locale.service';

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

@Injectable({
  providedIn: 'root'
})
export class SqlUserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isLoadingUser = false;
  private userLoadPromise: Promise<User | null> | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private localeService: LocaleService
  ) {}

  getCurrentUser(token: string): Observable<UserResponse> {
    if (!token) {
      return new Observable(observer => observer.error('No token'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.USER_DETAILS}`,
      { headers }
    );
  }

  loginOrCreateUser(firebaseUser: any): Observable<UserResponse> {
    return new Observable(observer => {
      // Run Firebase calls within Angular zone
      
        firebaseUser.getIdToken().then((token: string) => {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          
          this.makeLoginRequest(headers, observer);
        }).catch((error: any) => {
          observer.error(error);
        });
      
    });
  }

  private makeLoginRequest(headers: HttpHeaders, observer: any): void {
    this.http.post<UserResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
      {},
      { headers }
    ).pipe(
      timeout(10000) // 10 second timeout
    ).subscribe({
      next: (response) => {
        if (response?.success && response.data) {
          this.currentUserSubject.next(response.data);
          
          // Set user's preferred language
          if (response.data.language) {
            this.localeService.setLocaleFromUser(response.data.language);
          }
        }
        observer.next(response);
        observer.complete();
      },
      error: (error) => {
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          name: error.name
        });
        observer.error(error);
      }
    });
  }

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${API_CONFIG.BASE_URL}/api/users`);
  }

  getUser(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${API_CONFIG.BASE_URL}/api/users/${id}`);
  }

  createUser(userData: CreateUser): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${API_CONFIG.BASE_URL}/api/users`, userData);
  }

  updateUser(id: number, userData: UpdateUser): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${API_CONFIG.BASE_URL}/api/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${API_CONFIG.BASE_URL}/api/users/${id}`);
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
    this.isLoadingUser = false;
    this.userLoadPromise = null;
  }

  async checkUserAndLogin(): Promise<User | null> {
    try {
      const currentUser = this.getCurrentUserValue();
      
      if (currentUser) {
        console.log('SqlUserService: Using cached user');
        return currentUser;
      }

      // If already loading, return the existing promise
      if (this.isLoadingUser && this.userLoadPromise) {
        console.log('SqlUserService: User load already in progress, waiting...');
        return await this.userLoadPromise;
      }

      console.log('SqlUserService: No cached user, checking Firebase auth state');
      
      // Wait for Firebase auth state to be ready
      const isLoggedIn = await this.authService.isLoggedIn();
      if (!isLoggedIn) {
        console.log('SqlUserService: User not logged in to Firebase');
        return null;
      }

      console.log('SqlUserService: Firebase user authenticated, getting token');
      
      // Set loading state and create promise
      this.isLoadingUser = true;
      this.userLoadPromise = this.loadUserDetails();
      
      const result = await this.userLoadPromise;
      
      // Reset loading state
      this.isLoadingUser = false;
      this.userLoadPromise = null;
      
      return result;
    } catch (error) {
      console.error('SqlUserService: Error in checkUserAndLogin:', error);
      this.isLoadingUser = false;
      this.userLoadPromise = null;
      return null;
    }
  }

  private async loadUserDetails(): Promise<User | null> {
    try {
      // Add timeout to prevent hanging
      const tokenPromise = this.authService.getToken();
      const timeoutPromise = new Promise<undefined>((_, reject) => 
        setTimeout(() => reject(new Error('Token request timeout')), 5000)
      );
      
      const token = await Promise.race([tokenPromise, timeoutPromise]);
      
      if (!token) {
        console.log('SqlUserService: No token available');
        return null;
      }

      console.log('SqlUserService: Token obtained, fetching user details');
      const userResponse = await firstValueFrom(this.getCurrentUser(token));
      
      if (userResponse?.success && userResponse.data) {
        console.log('SqlUserService: User details fetched successfully');
        this.setCurrentUser(userResponse.data);
        
        // Set user's preferred language
        if (userResponse.data.language) {
          this.localeService.setLocaleFromUser(userResponse.data.language);
        }
        
        return userResponse.data;
      }

      console.log('SqlUserService: Failed to fetch user details');
      return null;
    } catch (error) {
      console.error('SqlUserService: Error loading user details:', error);
      return null;
    }
  }
}
