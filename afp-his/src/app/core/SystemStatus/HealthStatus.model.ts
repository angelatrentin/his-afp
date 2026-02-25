export interface HealthStatus {
  service: string;
  database: string;
  uptime: number;
}

export const healthStatusMock: HealthStatus = {
  service: 'KO',
  database: 'OK',
  uptime: -1
};