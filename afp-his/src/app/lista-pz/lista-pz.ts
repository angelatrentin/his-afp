import { Component, computed, inject, model, signal } from '@angular/core';
import { CardPz, Paziente } from '../card-pz/card-pz';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { HttpClient } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { catchError, of } from 'rxjs';

interface Response<T> {
  status: string;
  data: T;
}

interface HealthStatus {
  service: string;
  database: string;
  uptime: number;
}

@Component({
  selector: 'his-lista-pz',
  imports: [CardPz, InputTextModule, FormsModule, ButtonModule, TagModule],
  templateUrl: './lista-pz.html',
  styleUrl: './lista-pz.scss',
})
export class ListaPz {
  nomePaziente = model <string>('');
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
      id: '26',
      nome: 'Matteo',
      cognome: 'Gialli',
      braccialetto: 'MG456',
      eta: 49,
      codiceColore: 'arancione',
      note: 'Trauma',
      patologia: 'C01'
      }
    ]);

  healthStatus = signal<HealthStatus | null>(null);

  filteredList= computed(()=> {
    return this.ListaPz().filter((pz: Paziente) => 
      pz.nome.toLowerCase().includes(this.nomePaziente().toLowerCase())
    );
  });
  readonly #http = inject(HttpClient);

  constructor() {
    this.getHealthStatus();
  }

  editNomePaziente(nomePaziente: string) {
    this.nomePaziente.set(nomePaziente);
  }

 getHealthStatus() {
    this.#http
      .get<Response<HealthStatus>>('http://localhost:3000/health')
      .pipe(
        catchError((error) => {
          console.error('Error fetching health status:', error.error.data);
          return of(error.error as Response<HealthStatus>); // Return the error response as an observable to keep the stream alive
        }),
      )
      .subscribe((res) => {
        console.table(res);
        console.log('DB status:', res.data.database);

        this.healthStatus.set(res?.data);
      });
  }
}
