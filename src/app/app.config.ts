import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from '@auth0/angular-jwt';

registerLocaleData(en);

export function tokenGetter() {
  // Si no hay window, devolvemos null (no hay token)
  if (typeof window === 'undefined') {
    return null;
  }

  const token = window.sessionStorage.getItem('token');
  // Solo devolvemos algo si es un JWT válido de 3 partes
  return token && token.split('.').length === 3 ? token : null;
}

export const appConfig: ApplicationConfig = {
    providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(),withInterceptorsFromDi()),provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()), importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['https://peruvian-transport-solutions-6ncr.onrender.com'],
          disallowedRoutes: ['https://peruvian-transport-solutions-6ncr.onrender.com/login/forget'],
        },
      })
    )],
};


