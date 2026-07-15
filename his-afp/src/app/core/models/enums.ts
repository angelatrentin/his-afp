export type UserRole = 'DOC' | 'INF' | 'AMM';

export const UserRoleLabel: Record<UserRole, string> = {
  DOC: 'Medico',
  INF: 'Infermiere',
  AMM: 'Amministrativo',
};
