import {
  countriesReducer,
  setItems,
  setSearchType,
  setSortBy,
  type CountriesState,
} from './countriesSlice';
import type { Country } from './types';

const sampleCountry: Country = {
  name: { common: 'Ukraine' },
  cca3: 'UKR',
  flags: {
    png: 'https://flagcdn.com/w320/ua.png',
    svg: 'https://flagcdn.com/ua.svg',
  },
  region: 'Europe',
  population: 44134693,
  area: 603500,
};

describe('countriesSlice', () => {
  const initialState: CountriesState = {
    items: [],
    status: 'idle',
    error: null,
    searchType: 'name',
    sortBy: 'population',
  };

  it('returns the default state', () => {
    expect(countriesReducer(undefined, { type: 'unknown' })).toEqual(
      initialState,
    );
  });

  it('handles setSearchType', () => {
    const state = countriesReducer(initialState, setSearchType('region'));

    expect(state.searchType).toBe('region');
  });

  it('handles setSortBy', () => {
    const state = countriesReducer(initialState, setSortBy('area'));

    expect(state.sortBy).toBe('area');
  });

  it('handles setItems', () => {
    const stateWithError: CountriesState = {
      ...initialState,
      status: 'failed',
      error: 'previous error',
    };

    const state = countriesReducer(stateWithError, setItems([sampleCountry]));

    expect(state.items).toEqual([sampleCountry]);
    expect(state.status).toBe('succeeded');
    expect(state.error).toBeNull();
  });
});
