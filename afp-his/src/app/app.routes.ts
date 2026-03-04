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
        component: ListaPz,
    },
    {
        path: 'accettazione-pz',
        component: AccettazionePz,
    },
    {
        path: 'modifica-pz',
        component: ModificaPz,
    },
        {
        path: 'modifica-pz:id',
        component: ModificaPz,
    },
    {
        path: 'stato-servizi',
        component: StatoServizi,
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
