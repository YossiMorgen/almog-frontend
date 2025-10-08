import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { routes } from './app.routes';
import { firebaseAuthInterceptor } from '../interceptors/firebase-auth.interceptor';
import { tenantIdInterceptor } from '../interceptors/tenant-id.interceptor';
import { tokenRefreshInterceptor } from '../interceptors/token-refresh.interceptor';
import { firebaseConfig } from '../config/firebase.config';
import { LocaleService } from '../services/locale.service';
import { TenantService } from '../services/tenant.service';
import { SqlUserService } from '../services/sql-user.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch(), withInterceptors([firebaseAuthInterceptor, tenantIdInterceptor, tokenRefreshInterceptor])),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatDialogModule),
    importProvidersFrom(ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }))
  ]
};
