import { inject, Injectable, signal, computed } from '@angular/core';
import { PatientAdmission, PatientAdmissionRes, Paziente, PazienteDTO } from './Pazienti.model';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../models/APIResponse.model';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PatientManager {
  #http = inject(HttpClient);
  #listaPz = signal<Paziente[]>([]);
  #ListaPZFiltered = signal<Paziente[]>(this.#listaPz());
  ListaPz=this.#ListaPZFiltered.asReadonly();
  readonly #router = inject(Router);
  constructor() {    
    this.fetchListaPz();
  }

  public admitPatient(Paziente: PatientAdmission) {
    this.#http
    .post<APIResponse<PatientAdmissionRes>>(`${environment.apiUrl}/admissions`, Paziente)
    .subscribe({
      next: (res) => { 
        this.#router.navigate([`/modifica-pz/${res.data.id}`]);
      },
      error: (err) => {
        console.error("Errore durante l'ammissione del paziente", err);
      },
    })
  }

  public updatePatientInfo(pzId:number, residenza: Pick<PatientAdmission, 'residenza'>) {
    this.#http.patch<APIResponse<PatientAdmissionRes>> (
      '${environment.apiUrl}/patients/${pzId}', residenza)
      .subscribe({
        next: () => {
          this.#router.navigate(['/lista-pz']);
        },
        error: (err) => {
          console.error( "errore durante l'aggiornamento delle informazioni del paziente:", err);
        },
      });
  }

  public fetchListaPz() {
    this.#http.get<APIResponse<PazienteDTO[]>>(`${environment.apiUrl}/admissions`).subscribe({
      next: (res) => {
        const pazienti = res.data.map((pazienteDTO) => this.mapPazienteDTOToPaziente(pazienteDTO));
        this.#listaPz.set(pazienti);
      },
      error: (err) => {
        console.error(err)
        this.#listaPz.set([]);
      },
    });
  } 

  public mapPazienteDTOToPaziente(Paziente: PazienteDTO): Paziente {
    return { 
      id: Paziente.id.toString(),
      nome: Paziente.nome,
      cognome: Paziente.cognome,
      braccialetto: Paziente.braccialetto,
      eta: this.calcolaeta(Paziente.dataNascita),
      codiceColore: Paziente.coloreCode,
      note: Paziente.noteTriage,
      patologia: Paziente.patologiaCode,    
    };
  }

  public calcolaeta(dataNascita: string): number {
    const oggi = new Date();
    const nascita = new Date(dataNascita);
    let eta = oggi.getFullYear() - nascita.getFullYear();
    const m = oggi.getMonth() - nascita.getMonth();
    if (m < 0 || (m === 0 && oggi.getDate() < nascita.getDate())) {
        eta--;
    }
    return eta;
  }

  public filterByName(nome: string) {
    const filtered = this.#listaPz().filter((paziente) => {
      const fullName = `${paziente.nome} ${paziente.cognome}`.toLowerCase();
      return fullName.includes(nome.toLowerCase());
    });
    this.#ListaPZFiltered.set(filtered); 
  }
}