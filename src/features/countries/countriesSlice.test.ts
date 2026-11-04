import {
  countriesReducer,
  setSearchType,
  setSortBy,
  type CountriesState,
} from './countriesSlice';

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
});
