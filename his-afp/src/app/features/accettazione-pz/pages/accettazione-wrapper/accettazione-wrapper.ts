import { Component, signal } from '@angular/core';
import { RicercaPzComponent } from '../../components/ricerca-pz/ricerca-pz';
import { AccettazionePz } from '../../accettazione-pz';
import { PazienteDTO } from '../../../../core/Pazienti/Pazienti.model';

@Component({
  selector: 'app-accettazione-wrapper',
  standalone: true,
  imports: [RicercaPzComponent, AccettazionePz],
  template: `
    <div class="p-6">
      <app-ricerca-pz (pazienteTrovato)="onPazienteTrovato($event)" />
      @if (mostraForm()) {
        <hr class="my-6" />
        <his-accettazione-pz [pazientePreselezionato]="pazienteSelezionato()" />
      }
    </div>
  `,
})
export class AccettazioneWrapperComponent {
  pazienteSelezionato = signal<PazienteDTO | null>(null);
  mostraForm = signal<boolean>(false);

  onPazienteTrovato(pz: PazienteDTO | null) {
    this.pazienteSelezionato.set(pz);
    this.mostraForm.set(true);
  }
}