import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../forms/login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: LoginFormComponent;
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.authService.initConfiguration();
    
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.loginForm.setLoading(true);
    this.loginForm.setError('');

    try {
      await this.authService.login();
    } catch (error) {
      this.errorMessage = 'Failed to sign in. Please try again.';
      this.loginForm.setError(this.errorMessage);
      console.error('Sign-in error:', error);
      this.isLoading = false;
      this.loginForm.setLoading(false);
    }
  }
}
