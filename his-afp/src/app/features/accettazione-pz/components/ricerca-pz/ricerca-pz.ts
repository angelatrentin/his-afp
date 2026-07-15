import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePipe } from '@angular/common';
import { PazienteDTO } from '../../../../core/Pazienti/Pazienti.model';
import { PatientManager } from '../../../../core/Pazienti/patient-manager';

type SearchMode = 'cf' | 'anagrafica';

@Component({
  selector: 'app-ricerca-pz',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    MessageModule,
    SelectButtonModule,
    DatePipe,
  ],
  templateUrl: './ricerca-pz.html',
  styleUrl: './ricerca-pz.scss',
})
export class RicercaPzComponent {
  private fb = inject(FormBuilder);
  private patientManager = inject(PatientManager);

  pazienteTrovato = output<PazienteDTO | null>();

  readonly maxDate = new Date();
  searchMode = signal<SearchMode>('cf');
  risultati = signal<PazienteDTO[]>([]);
  cercato = signal<boolean>(false);
  nessunRisultato = signal<boolean>(false);

  modeOptions = [
    { label: 'Codice Fiscale', value: 'cf' },
    { label: 'Nome / Cognome / Data', value: 'anagrafica' },
  ];

  formCF = this.fb.group({
    codiceFiscale: [
      '',
      [
        Validators.required,
        Validators.pattern('[A-Za-z]{6}\\d{2}[A-Za-z]\\d{2}[A-Za-z]\\d{3}[A-Za-z]'),
      ],
    ],
  });

  formAnagrafica = this.fb.group({
    nome: ['', Validators.required],
    cognome: ['', Validators.required],
    dataNascita: [null as Date | null, Validators.required],
  });

  onModeChange(mode: string) {
    this.searchMode.set(mode as SearchMode);
    this.risultati.set([]);
    this.cercato.set(false);
    this.nessunRisultato.set(false);
    this.formCF.reset();
    this.formAnagrafica.reset();
  }

  onCercaCF() {
    if (this.formCF.invalid) {
      this.formCF.markAllAsTouched();
      return;
    }
    this.patientManager.fetchPazienti();
    const cf = this.formCF.value.codiceFiscale!;
    const trovato = this.patientManager.searchByCF(cf);
    this.cercato.set(true);
    if (trovato) {
      this.risultati.set([trovato]);
      this.nessunRisultato.set(false);
    } else {
      this.risultati.set([]);
      this.nessunRisultato.set(true);
    }
  }

  onCercaAnagrafica() {
    if (this.formAnagrafica.invalid) {
      this.formAnagrafica.markAllAsTouched();
      return;
    }
    this.patientManager.fetchPazienti();
    const { nome, cognome, dataNascita } = this.formAnagrafica.value;
    const dataISO = (dataNascita as Date).toISOString().split('T')[0];
    const trovati = this.patientManager.searchByAnagraphics(nome!, cognome!, dataISO);
    this.cercato.set(true);
    this.risultati.set(trovati);
    this.nessunRisultato.set(trovati.length === 0);
  }

  selezionaPaziente(pz: PazienteDTO) {
    this.pazienteTrovato.emit(pz);
  }

  nuovoPaziente() {
    this.pazienteTrovato.emit(null);
  }
}