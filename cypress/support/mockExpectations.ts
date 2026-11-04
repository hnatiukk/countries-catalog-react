/**
 * Central place for mock-derived e2e expectations.
 * Task 5 can replace these helpers with cy.intercept fixtures.
 */
import { MOCK_COUNTRIES } from '../../src/features/countries/mockData';
import type { CountryDetails } from '../../src/features/countries/types';

export { MOCK_COUNTRIES };

export function filterByName(query: string): CountryDetails[] {
  const normalized = query.trim().toLowerCase();
  return MOCK_COUNTRIES.filter((country) =>
    country.name.common.toLowerCase().includes(normalized),
  );
}

export function filterByRegion(region: string): CountryDetails[] {
  const normalized = region.trim().toLowerCase();
  return MOCK_COUNTRIES.filter(
    (country) => country.region.toLowerCase() === normalized,
  );
}

export function namesSortedBy(
  countries: CountryDetails[],
  sortBy: 'population' | 'area',
): string[] {
  return [...countries]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .map((country) => country.name.common);
}

export const NAME_QUERY = 'United';
export const REGION_QUERY = 'Europe';
export const AMERICAS_REGION = 'Americas';
export const NO_MATCH_QUERY = 'zzzz-no-such-country';

export const nameSearchResults = filterByName(NAME_QUERY);
export const regionSearchResults = filterByRegion(REGION_QUERY);
export const americasResults = filterByRegion(AMERICAS_REGION);

export const nameSearchCount = nameSearchResults.length;
export const regionSearchCount = regionSearchResults.length;

export const americasNamesByPopulation = namesSortedBy(
  americasResults,
  'population',
);
export const americasNamesByArea = namesSortedBy(americasResults, 'area');

export const detailCountry = MOCK_COUNTRIES.find(
  (country) => country.cca3 === 'UKR',
)!;
