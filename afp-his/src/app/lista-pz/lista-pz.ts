import { Component, signal } from '@angular/core';
import { CardPz, Paziente } from '../card-pz/card-pz';

@Component({
  selector: 'his-lista-pz',
  imports: [CardPz],
  templateUrl: './lista-pz.html',
  styleUrl: './lista-pz.scss',
})
export class ListaPz {
  ListaPz = signal<Paziente[]>([
    {
      id: '23',
      nome: 'Mario',
      cognome: 'Rossi',
      braccialetto: 'MR123',
      eta: 25,
      codiceColore: 'rosso',
      note: 'caduta',
      patologia: 'C19'
    },
    {
      id: '24',
      nome: 'Giulia',
      cognome: 'Verdi',
      braccialetto: 'GV456',
      eta: 50,
      codiceColore: 'azzurro',
      note: 'Trauma',
      patologia: 'C01'
      },
      {
      id: '25',
      nome: 'Chiara',
      cognome: 'Bianchi',
      braccialetto: 'BC456',
      eta: 6,
      codiceColore: 'azzurro',
      note: 'Trauma',
      patologia: 'C01'
      },
          {
      id: '25',
      nome: 'Matteo',
      cognome: 'Gialli',
      braccialetto: 'MG456',
      eta: 49,
      codiceColore: 'arancione',
      note: 'Trauma',
      patologia: 'C01'
      }
    ]);
}
