import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { APIResponse } from '../../../core/models/APIResponse.model';
import { CreateStaffRequest, StaffMember, UsernameAvailability } from '../../../core/models/staff.model';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly baseUrl = '/api/users';

  readonly staffList = signal<StaffMember[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadStaff(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<APIResponse<StaffMember[]>>(this.baseUrl).subscribe({
      next: (res) => {
        this.staffList.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossibile caricare la lista del personale.');
        this.loading.set(false);
      },
    });
  }

  createStaff(payload: CreateStaffRequest): Observable<APIResponse<StaffMember>> {
    return this.http
      .post<APIResponse<StaffMember>>(this.baseUrl, payload)
      .pipe(tap(() => this.loadStaff()));
  }

  checkUsername(username: string): Observable<APIResponse<UsernameAvailability>> {
    return this.http.get<APIResponse<UsernameAvailability>>(
      `${this.baseUrl}/check/${username}`
    );
  }

  toggleActive(id: number): Observable<APIResponse<null>> {
    return this.http
      .patch<APIResponse<null>>(`${this.baseUrl}/${id}/deactivate`, {})
      .pipe(tap(() => this.loadStaff()));
  }
}