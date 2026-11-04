export type SearchType = 'name' | 'region';
export type SortBy = 'population' | 'area';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface Country {
  name: {
    common: string;
  };
  cca3: string;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  region: string;
  population: number;
  area: number;
  capital?: string[];
}

export interface CountryCurrency {
  name: string;
  symbol?: string;
}

/** Domain detail shape used by the UI (mapped from REST Countries v5). */
export interface CountryDetails extends Country {
  subregion: string;
  capital: string[];
  languages: Record<string, string>;
  currencies: Record<string, CountryCurrency>;
}
