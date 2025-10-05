import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SupportedLocale = 'en' | 'he';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private currentLocaleSubject = new BehaviorSubject<SupportedLocale>('en');
  public currentLocale$ = this.currentLocaleSubject.asObservable();

  constructor() {
    this.loadLocaleFromStorage();
  }

  getCurrentLocale(): SupportedLocale {
    return this.currentLocaleSubject.value;
  }

  setLocale(locale: SupportedLocale): void {
    this.currentLocaleSubject.next(locale);
    this.saveLocaleToStorage(locale);
    this.updateDocumentLanguage(locale);
  }

  setLocaleFromUser(userLanguage: SupportedLocale): void {
    this.setLocale(userLanguage);
  }

  setLocaleFromUserWithFallback(userLanguage: SupportedLocale | null, tenantLanguage?: SupportedLocale | null): void {
    // Fallback hierarchy: user language → tenant language → default ('en')
    let localeToSet: SupportedLocale = 'en'; // default fallback
    
    if (userLanguage) {
      localeToSet = userLanguage;
    } else if (tenantLanguage && ['en', 'he'].includes(tenantLanguage)) {
      localeToSet = tenantLanguage;
    }
    
    this.setLocale(localeToSet);
  }

  private loadLocaleFromStorage(): void {
    const savedLocale = localStorage.getItem('preferred-locale') as SupportedLocale;
    if (savedLocale && ['en', 'he'].includes(savedLocale)) {
      this.currentLocaleSubject.next(savedLocale);
      this.updateDocumentLanguage(savedLocale);
    }
  }

  private saveLocaleToStorage(locale: SupportedLocale): void {
    localStorage.setItem('preferred-locale', locale);
  }

  private updateDocumentLanguage(locale: SupportedLocale): void {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
  }

  isRTL(): boolean {
    return this.getCurrentLocale() === 'he';
  }

  getDirection(): 'ltr' | 'rtl' {
    return this.getCurrentLocale() === 'he' ? 'rtl' : 'ltr';
  }

  updateLocaleOnTenantChange(userLanguage: SupportedLocale | null, tenantLanguage?: SupportedLocale | null): void {
    // When tenant changes, re-evaluate locale with current user's language
    this.setLocaleFromUserWithFallback(userLanguage, tenantLanguage);
  }
}
