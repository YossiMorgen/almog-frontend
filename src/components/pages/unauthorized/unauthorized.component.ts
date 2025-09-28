import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-unauthorized',
  imports: [MatIconModule, MatButtonModule, MatCardModule],
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 via-red-50 via-orange-50 to-yellow-50 p-6 relative overflow-hidden">
      <!-- Animated background elements with more colors -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-10 animate-pulse" style="animation-delay: 2s;"></div>
        <div class="absolute top-20 left-20 w-60 h-60 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-15 animate-pulse" style="animation-delay: 3s;"></div>
        <div class="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-br from-teal-200 to-blue-200 rounded-full opacity-15 animate-pulse" style="animation-delay: 4s;"></div>
      </div>
      

      
      <!-- Main content centered -->
      <div class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center justify-center w-full pl-20 pr-20 shadow-2xl rounded-3xl p-20 text-center transform transition-all duration-500 hover:shadow-3xl hover:scale-105 relative z-10 backdrop-blur-sm bg-white/95 relative">
              <!-- Top navigation with Go Back button -->
            <button 
            mat-fab
            color="primary"
            (click)="goBack()"
            class="transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
            style="background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); color: white; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);"
            >
            <mat-icon style="font-size: 28px;">arrow_back</mat-icon>
            </button>

        <div class="mb-12">
            <div class="mx-auto w-32 h-32 bg-gradient-to-br from-red-100 via-pink-200 to-purple-300 rounded-full flex items-center justify-center mb-8 animate-bounce shadow-2xl">
              <mat-icon class="text-red-600" style="font-size: 64px; width: 64px; height: 64px;">warning</mat-icon>
            </div>
          </div>
          
          <h1 class="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-red-600 via-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse" i18n="@@unauthorized.title">
            Access Denied
          </h1>
          
          <p class="text-gray-600 mb-12 text-xl leading-relaxed max-w-lg mx-auto" i18n="@@unauthorized.message">
            You don't have the required permissions to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <div class="flex flex-col space-y-6 mb-12">
            <button 
              mat-raised-button
              color="accent"
              (click)="goHome()"
              class="w-full py-6 px-12 rounded-2xl font-semibold text-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style="background: linear-gradient(135deg, #FF9800, #F57C00, #FF5722, #E91E63); color: white; box-shadow: 0 12px 35px rgba(255, 152, 0, 0.4);"
            >
              <mat-icon class="mr-4" style="font-size: 16px;">home</mat-icon>
              <span i18n="@@unauthorized.goToDashboard">Go to Dashboard</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
