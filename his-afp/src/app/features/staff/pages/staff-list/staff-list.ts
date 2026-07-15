import { Component, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { StaffService } from '../../services/staff';
import { StaffFormComponent } from '../../components/staff-form/staff-form';
import { UserRoleLabel } from '../../../../core/models/enums';
import { StaffMember } from '../../../../core/models/staff.model';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, DialogModule, StaffFormComponent],
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.scss',
})
export class StaffListComponent implements OnInit {
  private staffService = inject(StaffService);

  staffList = this.staffService.staffList;
  loading = this.staffService.loading;
  error = this.staffService.error;

  showForm = signal(false);
  roleLabel = UserRoleLabel;

  ngOnInit(): void {
    this.staffService.loadStaff();
  }

  getRoleLabel(role: keyof typeof UserRoleLabel): string {
    return this.roleLabel[role] ?? role;
  }

  onToggleActive(member: StaffMember): void {
    this.staffService.toggleActive(member.id).subscribe();
  }

  onFormSaved(): void {
    this.showForm.set(false);
  }
}