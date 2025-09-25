import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public currentUser: any = null;
  public profile: any = null;
  public showNavigation: boolean = true;
  public isLoggedIn: boolean = false;

  constructor(public themeService: ThemeService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.profile = this.authService.getCurrentUser();
  }

  signOut(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  signIn(): void {
    this.authService.login();
  }
}
