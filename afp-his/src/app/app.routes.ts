import { Routes } from '@angular/router';
import { ListaPz } from './fetures/lista-pz/lista-pz';
import { AccettazionePz } from './fetures/accettazione-pz/accettazione-pz';
import { StatoServizi } from './fetures/stato-servizi/stato-servizi';
import { Component } from '@angular/core';
import { ModificaPz } from './fetures/modifica-pz/modifica-pz';

export const routes: Routes = [
    //ORDINE DELLE ROTTE NON è CASUALE
    //1.rotte popolate
    {
        path: 'lista-pz',
        //component: ListaPz,
        loadComponent: () => import('./fetures/lista-pz/lista-pz').then(m => m.ListaPz),
    },
    {
        path: 'accettazione-pz',
        // component: AccettazionePz,
        loadComponent: () => import('./fetures/accettazione-pz/accettazione-pz').then(m => m.AccettazionePz),
    },
    {
        path: 'modifica-pz',
        // component: ModificaPz,
        loadComponent: () => import('./fetures/modifica-pz/modifica-pz').then(m => m.ModificaPz),

    },
    {
    // /modifica-pz?id=2
    path: 'modifica-pz/:patientId',
    loadComponent: () => import('./fetures/modifica-pz/modifica-pz').then((m) => m.ModificaPz),
    },
    {
        path: 'stato-servizi',
        //component: StatoServizi,
        loadComponent: () => import('./fetures/stato-servizi/stato-servizi').then(m => m.StatoServizi),
    },


    //2.rotta vuota
    {
        path: '',
        redirectTo: 'lista-pz',
        pathMatch: 'full',
    },


    //3.rotta per qualsiasi altro caso
    {
        path: '**',
        redirectTo: 'lista-pz',
        pathMatch: 'full',
    }
    
];
