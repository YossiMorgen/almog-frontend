import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  public isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    // Check for saved theme preference or default to light theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme === 'dark');
    }
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkTheme.value;
    this.setTheme(newTheme);
  }

  setTheme(isDark: boolean): void {
    this.isDarkTheme.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Apply theme class to body
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
