export type Location = "Konoha" | "Suna" | "Kiri" | "Iwa" | "Kumo";
export type HealthStatus = "Healthy" | "Injured" | "Critical";

export interface Character {
  id: string;
  name: string;
  location: Location;
  health: HealthStatus;
  power: number;
}

export interface TableState {
  selectedRows: Set<string>;
  viewedRows: Set<string>;
  healthFilters: Set<HealthStatus>;
  searchQuery: string;
  sortOrder: "asc" | "desc" | null;
}
