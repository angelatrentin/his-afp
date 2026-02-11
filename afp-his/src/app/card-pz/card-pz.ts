import { Component, input} from '@angular/core';
import { CardModule } from 'primeng/card';
import { Button } from "primeng/button";

export interface Paziente {
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
  paziente = input.required<Paziente>();

  setColoreDiStato() {
    switch (this.paziente().codiceColore) {
      case 'rosso':
        return 'border-red-600';
      case 'arancione':
        return 'border-orange-600';
      case 'azzurro':
        return 'border-blue-600';
      case 'verde':
        return 'border-green-600';
      case 'bianco':
        return 'border-gray-600';
      default:
        return '';
    }
  }
}
