// src/types.ts
export interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PopulationData {
  year: number;
  value: number;
}

export interface Population {
  total: PopulationData[];
  young: PopulationData[];
  working: PopulationData[];
  elderly: PopulationData[];
}
