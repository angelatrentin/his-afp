import { inject, Injectable, signal, computed } from '@angular/core';
import { Paziente, PazienteDTO } from './Pazienti.model';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../models/APIResponse.model';

@Injectable({
  providedIn: 'root'
})
export class PatientManager {
  #http = inject(HttpClient);
  #listaPz = signal<Paziente[]>([]);
  #ListaPZFiltered = signal<Paziente[]>(this.#listaPz());
  ListaPz=this.#ListaPZFiltered.asReadonly();

  constructor() {    
    this.fetchListaPz();
  }

  public fetchListaPz() {
    this.#http.get<APIResponse<PazienteDTO[]>>('http://localhost:3000/admissions').subscribe({
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