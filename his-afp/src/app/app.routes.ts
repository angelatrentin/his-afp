import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'lista-pz',
    loadComponent: () => import('./features/lista-pz/lista-pz').then((m) => m.ListaPz),
  },
  {
    path: 'accettazione-pz',
    loadComponent: () =>
      import('./features/accettazione-pz/accettazione-pz').then((m) => m.AccettazionePz),
  },
  {
    path: 'modifica-pz/:patientId',
    loadComponent: () => import('./features/modifica-pz/modifica-pz').then((m) => m.ModificaPz),
  },
  {
    path: 'stato-servizi',
    loadComponent: () =>
      import('./features/stato-servizi/stato-servizi').then((m) => m.StatoServizi),
  },
  // TASK 1 — Gestione Anagrafica Staff
  {
    path: 'staff',
    loadComponent: () =>
      import('./features/staff/pages/staff-list/staff-list').then((m) => m.StaffListComponent),
  },
  {
    path: '',
    redirectTo: 'lista-pz',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'stato-servizi',
    pathMatch: 'full',
  },
];