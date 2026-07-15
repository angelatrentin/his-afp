import { inject, Injectable, signal } from '@angular/core';
import { PatientAdmission, PatientAdmissionRes, Paziente, PazienteDTO } from './Pazienti.model';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../models/APIResponse.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PatientManager {
  timer_id = signal<number>(-1);
  #http = inject(HttpClient);
  readonly #router = inject(Router);

  #listaPZRaw = signal<PazienteDTO[]>([]);
  #listaPZ = signal<Paziente[]>([]);
  #listaPZFiltered = signal<Paziente[]>([]);
  listaPZ = this.#listaPZFiltered.asReadonly();

  public refreshPazienti() {
    if (this.timer_id() >= 0) return;
    const id = setInterval(() => this.fetchPazienti(), 1000);
    this.timer_id.set(id);
  }

  public stopRefreshPazienti() {
    clearInterval(this.timer_id());
    this.timer_id.set(-1);
  }

  public fetchPazienti() {
    this.#http.get<APIResponse<PazienteDTO[]>>(`/api/admissions`).subscribe({
      next: (res) => {
        this.#listaPZRaw.set(res.data);
        const pz = res.data.map((p) => this.mapPazienteDTOToPaziente(p));
        this.#listaPZ.set(pz);
        this.#listaPZFiltered.set(pz);
      },
      error: (err) => console.error('Errore fetch pazienti:', err),
    });
  }

  public admitPatient(pz: PatientAdmission) {
    const body = {
      nome: pz.anagrafica.nome,
      cognome: pz.anagrafica.cognome,
      dataNascita: pz.anagrafica.dataNascita,
      codiceFiscale: pz.anagrafica.codiceFiscale,
      sex: pz.anagrafica.sesso,
      patologiaCode: pz.sanitaria.patologia,
      codiceColore: pz.sanitaria.codiceColore,
      modalitaArrivoCode: pz.sanitaria.modArrivo,
      noteTriage: pz.sanitaria.noteTriage,
    };
    this.#http.post<APIResponse<PatientAdmissionRes>>(`/api/admissions`, body).subscribe({
      next: (res) => this.#router.navigate([`/modifica-pz/${res.data.id}`]),
      error: (err) => console.error("Errore ammissione paziente:", err),
    });
  }

  public updatePatientInfo(pzId: number, residenza: Pick<PatientAdmission, 'residenza'>) {
    this.#http
      .patch<APIResponse<PatientAdmissionRes>>(`/api/patients/${pzId}`, residenza)
      .subscribe({
        next: () => this.#router.navigate([`/lista-pz`]),
        error: (err) => console.error("Errore aggiornamento paziente:", err),
      });
  }

  /** Ricerca per Codice Fiscale esatto */
  public searchByCF(cf: string): PazienteDTO | undefined {
    return this.#listaPZRaw().find(
      (p) => p.codiceFiscale.toUpperCase() === cf.toUpperCase()
    );
  }

  /** Ricerca per Nome, Cognome e Data di Nascita */
  public searchByAnagraphics(nome: string, cognome: string, dataNascita: string): PazienteDTO[] {
    return this.#listaPZRaw().filter(
      (p) =>
        p.nome.toLowerCase() === nome.toLowerCase() &&
        p.cognome.toLowerCase() === cognome.toLowerCase() &&
        p.dataNascita.startsWith(dataNascita)
    );
  }

  public mapPazienteDTOToPaziente(pz: PazienteDTO): Paziente {
    return {
      id: pz.id.toString(),
      nome: pz.nome,
      cognome: pz.cognome,
      braccialetto: pz.braccialetto,
      codiceColore: pz.coloreCode,
      note: pz.noteTriage,
      patologia: pz.patologiaCode,
      eta: this.calcolaEta(pz.dataNascita),
    };
  }

  public calcolaEta(dataNascita: string): number {
    const today = new Date();
    const birthDate = new Date(dataNascita);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  public filterByName(name: string) {
    const filtered = this.#listaPZ().filter((p) => {
      const fullName = `${p.nome} ${p.cognome}`.toLowerCase();
      return fullName.includes(name.toLowerCase());
    });
    this.#listaPZFiltered.set(filtered);
  }
}