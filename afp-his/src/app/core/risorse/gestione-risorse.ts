import { Injectable, signal } from '@angular/core';
import { ArrivalMode, Pathology, TriageColor } from './risorse.model';

@Injectable({
  providedIn: 'root',
})
export class GestioneRisorse {
  readonly #triageColors = signal<TriageColor[]>([]);
  readonly #pathologies = signal<Pathology[]>([]);
  readonly #arrivalModes = signal<ArrivalMode[]>([]);

  public fetchRisorse() {
    this.fetchTriageColors();
    this.fetchPathologies();
    this.fetchArrivalModes();
  }

  private fetchTriageColors() {}
  private fetchPathologies() {}
  private fetchArrivalModes() {}
}
