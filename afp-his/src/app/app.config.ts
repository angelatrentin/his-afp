import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config'

import { routes } from './app.routes';
import { PatientManager } from './core/pazienti/patient-manager';
import { GestioneRisorse } from './core/risorse/gestione-risorse';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG( {
      theme: {
        preset: Aura,
        options: {
          ripple: true,
          darkModeSelector: '.my-app-dark',
        }
      }
    }),
    provideAppInitializer(() => inject(PatientManager).fetchPazienti()),
    provideAppInitializer(() => inject(GestioneRisorse).fetchRisorse()),
  ]
};
