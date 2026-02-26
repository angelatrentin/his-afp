import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { CardPz} from '../card-pz/card-pz';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { HttpClient } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { catchError, of } from 'rxjs';
import { SystemStatus } from '../core/SystemStatus/SystemStatus';
import { HealthStatus } from '../core/SystemStatus/HealthStatus.model';
import { StatoAPI } from "../ui/statoAPI/statoAPI";
import { Paziente } from '../core/pazienti/Pazienti.model';
import { PatientManager } from '../core/pazienti/patient-manager';

@Component({
  selector: 'his-lista-pz',
  imports: [CardPz, InputTextModule, FormsModule, ButtonModule, TagModule, StatoAPI],
  templateUrl: './lista-pz.html',
  styleUrl: './lista-pz.scss',
})
export class ListaPz {
  readonly PatientManager = inject(PatientManager);
  nomePaziente = model <string>('');
  ListaPz = this.PatientManager.ListaPz;

  editNomePaziente(nomePaziente: string) {
    this.nomePaziente.set(nomePaziente);
    this.PatientManager.filterByName(nomePaziente);
  }

  constructor() {
    effect(() => {
      this.PatientManager.filterByName(this.nomePaziente());
    });
  }
}
