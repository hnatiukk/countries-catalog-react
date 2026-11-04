import {
  clearDetails,
  countriesReducer,
  initialCountriesState,
  setSearchType,
  setSortBy,
  type CountriesState,
} from './countriesSlice';
import {
  fetchCountryDetails,
  fetchRelatedCountries,
  searchCountries,
} from './thunks';
import type { Country, CountryDetails } from './types';

const sampleCountry: Country = {
  name: { common: 'Ukraine' },
  cca3: 'UKR',
  flags: {
    png: 'https://flags.restcountries.com/v5/w640/ua.png',
    svg: 'https://flags.restcountries.com/v5/svg/ua.svg',
  },
  region: 'Europe',
  population: 28700000,
  area: 603500,
};

const sampleDetails: CountryDetails = {
  ...sampleCountry,
  subregion: 'Eastern Europe',
  capital: ['Kyiv'],
  languages: { ukr: 'Ukrainian' },
  currencies: { UAH: { name: 'Ukrainian hryvnia', symbol: '₴' } },
};

describe('countriesSlice', () => {
  it('returns the default state', () => {
    expect(countriesReducer(undefined, { type: 'unknown' })).toEqual(
      initialCountriesState,
    );
  });

  it('handles setSearchType and setSortBy', () => {
    let state = countriesReducer(
      initialCountriesState,
      setSearchType('region'),
    );
    state = countriesReducer(state, setSortBy('area'));
    expect(state.searchType).toBe('region');
    expect(state.sortBy).toBe('area');
  });

  it('handles clearDetails', () => {
    const dirty: CountriesState = {
      ...initialCountriesState,
      details: {
        entity: sampleDetails,
        status: 'succeeded',
        error: null,
        code: 'UKR',
      },
      related: {
        items: [sampleCountry],
        status: 'succeeded',
        error: null,
      },
    };

    const state = countriesReducer(dirty, clearDetails());
    expect(state.details).toEqual(initialCountriesState.details);
    expect(state.related).toEqual(initialCountriesState.related);
  });

  describe('searchCountries', () => {
    it('sets loading and lastSearch on pending', () => {
      const state = countriesReducer(
        initialCountriesState,
        searchCountries.pending('req-1', {
          query: 'Ukraine',
          searchType: 'name',
        }),
      );

      expect(state.status).toBe('loading');
      expect(state.hasSearched).toBe(true);
      expect(state.error).toBeNull();
      expect(state.lastSearch).toEqual({
        query: 'Ukraine',
        searchType: 'name',
      });
    });

    it('stores items on fulfilled', () => {
      const pending = countriesReducer(
        initialCountriesState,
        searchCountries.pending('req-1', {
          query: 'Ukraine',
          searchType: 'name',
        }),
      );
      const state = countriesReducer(
        pending,
        searchCountries.fulfilled([sampleCountry], 'req-1', {
          query: 'Ukraine',
          searchType: 'name',
        }),
      );

      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual([sampleCountry]);
      expect(state.error).toBeNull();
    });

    it('stores error on rejected', () => {
      const pending = countriesReducer(
        initialCountriesState,
        searchCountries.pending('req-1', {
          query: 'Ukraine',
          searchType: 'name',
        }),
      );
      const state = countriesReducer(
        pending,
        searchCountries.rejected(
          new Error('boom'),
          'req-1',
          { query: 'Ukraine', searchType: 'name' },
          'Search failed hard',
        ),
      );

      expect(state.status).toBe('failed');
      expect(state.items).toEqual([]);
      expect(state.error).toBe('Search failed hard');
    });

    it('ignores aborted rejections', () => {
      const pending = countriesReducer(
        initialCountriesState,
        searchCountries.pending('req-1', {
          query: 'Ukraine',
          searchType: 'name',
        }),
      );
      const aborted = searchCountries.rejected(
        { name: 'AbortError', message: 'Aborted' },
        'req-1',
        { query: 'Ukraine', searchType: 'name' },
      );
      const state = countriesReducer(pending, aborted);

      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });
  });

  describe('fetchCountryDetails', () => {
    it('resets details and related on pending', () => {
      const dirty: CountriesState = {
        ...initialCountriesState,
        details: {
          entity: sampleDetails,
          status: 'succeeded',
          error: null,
          code: 'USA',
        },
        related: {
          items: [sampleCountry],
          status: 'succeeded',
          error: null,
        },
      };

      const state = countriesReducer(
        dirty,
        fetchCountryDetails.pending('d1', 'UKR'),
      );

      expect(state.details).toEqual({
        entity: null,
        status: 'loading',
        error: null,
        code: 'UKR',
      });
      expect(state.related).toEqual(initialCountriesState.related);
    });

    it('stores entity on fulfilled for matching code', () => {
      const pending = countriesReducer(
        initialCountriesState,
        fetchCountryDetails.pending('d1', 'UKR'),
      );
      const state = countriesReducer(
        pending,
        fetchCountryDetails.fulfilled(sampleDetails, 'd1', 'UKR'),
      );

      expect(state.details.status).toBe('succeeded');
      expect(state.details.entity).toEqual(sampleDetails);
    });

    it('ignores fulfilled for a stale code', () => {
      const pending = countriesReducer(
        initialCountriesState,
        fetchCountryDetails.pending('d2', 'USA'),
      );
      const state = countriesReducer(
        pending,
        fetchCountryDetails.fulfilled(sampleDetails, 'd1', 'UKR'),
      );

      expect(state.details.status).toBe('loading');
      expect(state.details.entity).toBeNull();
      expect(state.details.code).toBe('USA');
    });

    it('stores error on rejected', () => {
      const pending = countriesReducer(
        initialCountriesState,
        fetchCountryDetails.pending('d1', 'UKR'),
      );
      const state = countriesReducer(
        pending,
        fetchCountryDetails.rejected(
          new Error('fail'),
          'd1',
          'UKR',
          'Not available',
        ),
      );

      expect(state.details.status).toBe('failed');
      expect(state.details.error).toBe('Not available');
    });

    it('ignores aborted detail rejections', () => {
      const pending = countriesReducer(
        initialCountriesState,
        fetchCountryDetails.pending('d1', 'UKR'),
      );
      const aborted = fetchCountryDetails.rejected(
        { name: 'AbortError', message: 'Aborted' },
        'd1',
        'UKR',
      );
      const state = countriesReducer(pending, aborted);
      expect(state.details.status).toBe('loading');
    });
  });

  describe('fetchRelatedCountries', () => {
    it('handles pending, fulfilled, and rejected', () => {
      let state = countriesReducer(
        initialCountriesState,
        fetchRelatedCountries.pending('r1', {
          region: 'Europe',
          excludeCode: 'UKR',
        }),
      );
      expect(state.related.status).toBe('loading');

      state = countriesReducer(
        state,
        fetchRelatedCountries.fulfilled([sampleCountry], 'r1', {
          region: 'Europe',
          excludeCode: 'UKR',
        }),
      );
      expect(state.related.status).toBe('succeeded');
      expect(state.related.items).toEqual([sampleCountry]);

      state = countriesReducer(
        state,
        fetchRelatedCountries.rejected(
          new Error('fail'),
          'r2',
          { region: 'Europe', excludeCode: 'UKR' },
          'Related failed',
        ),
      );
      expect(state.related.status).toBe('failed');
      expect(state.related.error).toBe('Related failed');
      expect(state.related.items).toEqual([]);
    });

    it('ignores aborted related rejections', () => {
      const pending = countriesReducer(
        initialCountriesState,
        fetchRelatedCountries.pending('r1', {
          region: 'Europe',
          excludeCode: 'UKR',
        }),
      );
      const aborted = fetchRelatedCountries.rejected(
        { name: 'AbortError', message: 'Aborted' },
        'r1',
        { region: 'Europe', excludeCode: 'UKR' },
      );
      expect(countriesReducer(pending, aborted).related.status).toBe('loading');
    });
  });
});
