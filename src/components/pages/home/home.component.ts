import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SqlUserService } from '../../../services/sql-user.service';
import { LocaleService } from '../../../services/locale.service';
import { User } from '../../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  subscription: Subscription | null = null;
  localeSubscription: Subscription | null = null;
  currentLocale: string = 'en';

  constructor(
    private sqlUserService: SqlUserService,
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.sqlUserService.getCurrentUserValue();

    this.subscription = this.sqlUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.localeSubscription = this.localeService.currentLocale$.subscribe((locale) => {
      this.currentLocale = locale;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.localeSubscription?.unsubscribe();
  }

  getDirection(): 'ltr' | 'rtl' {
    return this.localeService.getDirection();
  }
}

