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
