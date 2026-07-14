import { UserRole } from './enums';

export interface StaffMember {
  id: number;
  username: string;
  role: UserRole;
  isActive: boolean;
}

export interface CreateStaffRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface UsernameAvailability {
  available: boolean;
}
