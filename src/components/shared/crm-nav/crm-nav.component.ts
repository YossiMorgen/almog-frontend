import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-crm-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './crm-nav.component.html',
  styleUrls: ['./crm-nav.component.scss']
})
export class CrmNavComponent {
  @Input() currentUser: any = null;

  constructor(private authService: AuthService) {}

  signOut(): void {
    this.authService.logout();
  }
}


