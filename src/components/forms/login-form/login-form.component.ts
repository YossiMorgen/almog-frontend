import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  constructor(public authService: AuthService) {}
  @Output() googleSignIn = new EventEmitter<void>();
  
  isLoading = false;
  errorMessage = '';

  onGoogleSignIn(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.googleSignIn.emit();
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  setError(message: string): void {
    this.errorMessage = message;
  }
}
