import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { PatientManager } from './core/Pazienti/patient-manager';
import { GestioneRisorse } from './core/Risorse/gestione-risorse';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jWTHeaderInterceptor } from './core/auth/jwtheader-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([jWTHeaderInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          ripple: true,
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    provideAppInitializer(() => inject(PatientManager).fetchPazienti()),
    provideAppInitializer(() => inject(GestioneRisorse).fetchRisorse()),
  ],
};
