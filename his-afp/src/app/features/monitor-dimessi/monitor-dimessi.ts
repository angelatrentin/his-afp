import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { APIResponse } from '../../core/models/APIResponse.model';
import { PazienteDTO } from '../../core/Pazienti/Pazienti.model';

@Component({
  selector: 'app-monitor-dimessi',
  standalone: true,
  imports: [TableModule, TagModule, ButtonModule, DatePipe],
  templateUrl: './monitor-dimessi.html',
  styleUrl: './monitor-dimessi.scss',
})
export class MonitorDimessi implements OnInit {
  private http = inject(HttpClient);

  private tuttiDimessi = signal<PazienteDTO[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  /** Filtra solo quelli dimessi nelle ultime 24h */
  dimessiUltime24h = computed(() => {
    const limite = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.tuttiDimessi().filter((p) => new Date(p.dataOraIngresso) >= limite);
  });

  ngOnInit(): void {
    this.caricaDimessi();
  }

  caricaDimessi(): void {
    this.loading.set(true);
    this.error.set(null);
    // L'API filtra già per stato attivo, proviamo con il parametro stato
    this.http.get<APIResponse<PazienteDTO[]>>('/api/admissions?stato=DIM').subscribe({
      next: (res) => {
        const dimessi = (res.data ?? []).filter((p) => p.stato === 'DIM');
        this.tuttiDimessi.set(dimessi);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossibile caricare i pazienti dimessi.');
        this.loading.set(false);
      },
    });
  }
}