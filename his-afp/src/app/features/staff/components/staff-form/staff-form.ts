import { Component, inject, input, OnChanges, output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Observable, map, debounceTime, switchMap, first } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { UserRoleLabel, UserRole } from '../../../../core/models/enums';
import { CreateStaffRequest } from '../../../../core/models/staff.model';
import { StaffService } from '../../services/staff';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, SelectModule, MessageModule],
  templateUrl: './staff-form.html',
  styleUrl: './staff-form.scss',
})
export class StaffFormComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private staffService = inject(StaffService);

  /** Se valorizzato, il form è in modalità modifica (futuro uso) */
  editId = input<number | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  roleOptions = Object.entries(UserRoleLabel).map(([value, label]) => ({ value, label }));

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)], [this.usernameValidator()]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    role: [null as UserRole | null, Validators.required],
  });

  ngOnChanges(): void {
    // Reset al cambio di editId
    this.form.reset();
  }

  private usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return control.valueChanges.pipe(
        debounceTime(400),
        switchMap((value: string) => this.staffService.checkUsername(value)),
        map((res) => (res.data?.available === false ? { usernameTaken: true } : null)),
        first()
      );
    };
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
  get role() { return this.form.get('role'); }

  onSubmit(): void {
    if (this.form.invalid) return;
    const payload = this.form.value as CreateStaffRequest;
    this.staffService.createStaff(payload).subscribe({
      next: () => {
        this.form.reset();
        this.saved.emit();
      },
    });
  }

  onCancel(): void {
    this.form.reset();
    this.cancelled.emit();
  }
}