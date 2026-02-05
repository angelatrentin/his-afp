import { Component, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Button } from "primeng/button";

interface Paziente {
  id: string;
  nome: string;
  cognome: string;
  braccialetto: string;
  eta: number;
  codiceColore: string;
  note: string;
  patologia: string;
}

@Component({
  selector: 'his-card-pz',
  imports: [CardModule, Button],
  templateUrl: './card-pz.html',
  styleUrl: './card-pz.scss',
})
export class CardPz {
  // nome: string = 'Mario Rossi'; --> codice vecchio, ora uso i signal
  paziente = signal<Paziente>({
    id: '23',
    nome: 'Mario',
    cognome: 'Rossi',
    braccialetto: '123',
    eta: 25,
    codiceColore: 'rosso',
    note: 'Trauma',
    patologia: 'C19'
  });
  
  cambiaNome(){
    this.paziente.set('Lucio');
  }

}
