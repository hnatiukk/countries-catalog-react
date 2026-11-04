import { initialCountriesState } from '@/features/countries/countriesSlice';
import type { CountriesState } from '@/features/countries/countriesSlice';
import type { Country, CountryDetails } from '@/features/countries/types';

export const ukraine: CountryDetails = {
  name: { common: 'Ukraine' },
  cca3: 'UKR',
  flags: {
    png: 'https://flags.restcountries.com/v5/w640/ua.png',
    svg: 'https://flags.restcountries.com/v5/svg/ua.svg',
    alt: 'The flag of Ukraine',
  },
  region: 'Europe',
  subregion: 'Eastern Europe',
  population: 28700000,
  area: 603500,
  capital: ['Kyiv'],
  languages: { ukr: 'Ukrainian' },
  currencies: { UAH: { name: 'Ukrainian hryvnia', symbol: '₴' } },
};

export const germany: Country = {
  name: { common: 'Germany' },
  cca3: 'DEU',
  flags: {
    png: 'https://flags.restcountries.com/v5/w640/de.png',
    svg: 'https://flags.restcountries.com/v5/svg/de.svg',
  },
  region: 'Europe',
  population: 83298787,
  area: 357114,
  capital: ['Berlin'],
};

export const france: Country = {
  name: { common: 'France' },
  cca3: 'FRA',
  flags: {
    png: 'https://flags.restcountries.com/v5/w640/fr.png',
    svg: 'https://flags.restcountries.com/v5/svg/fr.svg',
  },
  region: 'Europe',
  population: 67391582,
  area: 551695,
  capital: ['Paris'],
};

export const unitedStates: Country = {
  name: { common: 'United States' },
  cca3: 'USA',
  flags: {
    png: 'https://flags.restcountries.com/v5/w640/us.png',
    svg: 'https://flags.restcountries.com/v5/svg/us.svg',
  },
  region: 'Americas',
  population: 341784857,
  area: 9372610,
  capital: ['Washington, D.C.'],
};

export function countriesState(
  overrides: Partial<CountriesState> = {},
): CountriesState {
  return {
    ...initialCountriesState,
    ...overrides,
    details: {
      ...initialCountriesState.details,
      ...overrides.details,
    },
    related: {
      ...initialCountriesState.related,
      ...overrides.related,
    },
  };
}
