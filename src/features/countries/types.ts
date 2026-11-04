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

/** Compatible with REST Countries API v3.1 detail response shape. */
export interface CountryDetails extends Country {
  subregion: string;
  capital: string[];
  languages: Record<string, string>;
  currencies: Record<string, CountryCurrency>;
}
