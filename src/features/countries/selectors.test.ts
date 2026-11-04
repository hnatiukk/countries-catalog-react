import type { RootState } from '@/app/store';
import { initialCountriesState, type CountriesState } from './countriesSlice';
import type { Country } from './types';
import {
  selectCountriesError,
  selectCountriesItems,
  selectCountriesStatus,
  selectDetails,
  selectHasSearched,
  selectLastSearch,
  selectRelatedItems,
  selectSearchType,
  selectSortBy,
  selectSortedCountries,
  selectSortedRelatedCountries,
} from './selectors';

function createCountry(
  overrides: Partial<Country> & Pick<Country, 'cca3' | 'name'>,
): Country {
  return {
    flags: {
      png: `https://flagcdn.com/w320/${overrides.cca3.toLowerCase()}.png`,
      svg: `https://flagcdn.com/${overrides.cca3.toLowerCase()}.svg`,
    },
    region: 'Europe',
    population: 1,
    area: 1,
    ...overrides,
  };
}

function createState(
  countriesOverrides: Partial<CountriesState> = {},
): RootState {
  return {
    countries: {
      ...initialCountriesState,
      ...countriesOverrides,
    },
  };
}

describe('countries selectors', () => {
  const alpha = createCountry({
    name: { common: 'Alpha' },
    cca3: 'ALP',
    population: 100,
    area: 50,
  });
  const beta = createCountry({
    name: { common: 'Beta' },
    cca3: 'BET',
    population: 300,
    area: 10,
  });
  const gamma = createCountry({
    name: { common: 'Gamma' },
    cca3: 'GAM',
    population: 200,
    area: 90,
  });

  it('selects basic slice fields', () => {
    const state = createState({
      items: [alpha],
      searchType: 'region',
      sortBy: 'area',
      status: 'succeeded',
      error: null,
      hasSearched: true,
      lastSearch: { query: 'Europe', searchType: 'region' },
    });

    expect(selectCountriesItems(state)).toEqual([alpha]);
    expect(selectSearchType(state)).toBe('region');
    expect(selectSortBy(state)).toBe('area');
    expect(selectCountriesStatus(state)).toBe('succeeded');
    expect(selectCountriesError(state)).toBeNull();
    expect(selectHasSearched(state)).toBe(true);
    expect(selectLastSearch(state)).toEqual({
      query: 'Europe',
      searchType: 'region',
    });
    expect(selectDetails(state)).toEqual(initialCountriesState.details);
    expect(selectRelatedItems(state)).toEqual([]);
  });

  it('sorts by population descending', () => {
    const state = createState({
      items: [alpha, beta, gamma],
      sortBy: 'population',
    });

    expect(selectSortedCountries(state).map((c) => c.cca3)).toEqual([
      'BET',
      'GAM',
      'ALP',
    ]);
  });

  it('sorts by area descending', () => {
    const state = createState({
      items: [alpha, beta, gamma],
      sortBy: 'area',
    });

    expect(selectSortedCountries(state).map((c) => c.cca3)).toEqual([
      'GAM',
      'ALP',
      'BET',
    ]);
  });

  it('sorts related countries by the active sort key', () => {
    const state = createState({
      sortBy: 'population',
      related: {
        items: [alpha, beta, gamma],
        status: 'succeeded',
        error: null,
      },
    });

    expect(selectSortedRelatedCountries(state).map((c) => c.cca3)).toEqual([
      'BET',
      'GAM',
      'ALP',
    ]);
  });

  it('returns an empty list when there are no items', () => {
    const state = createState();

    expect(selectSortedCountries(state)).toEqual([]);
  });

  it('keeps a stable order for equal sort values', () => {
    const first = createCountry({
      name: { common: 'First' },
      cca3: 'FST',
      population: 100,
      area: 10,
    });
    const second = createCountry({
      name: { common: 'Second' },
      cca3: 'SND',
      population: 100,
      area: 20,
    });
    const state = createState({
      items: [first, second],
      sortBy: 'population',
    });

    expect(selectSortedCountries(state).map((c) => c.cca3)).toEqual([
      'FST',
      'SND',
    ]);
  });

  it('does not mutate the input items array', () => {
    const items = [alpha, beta, gamma];
    const state = createState({ items, sortBy: 'population' });

    selectSortedCountries(state);

    expect(items.map((c) => c.cca3)).toEqual(['ALP', 'BET', 'GAM']);
  });
});
