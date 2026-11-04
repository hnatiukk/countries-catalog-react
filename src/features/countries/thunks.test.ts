import { configureStore } from '@reduxjs/toolkit';
import * as countriesApi from '@/api/countriesApi';
import { ApiError } from '@/api/types';
import { countriesReducer } from './countriesSlice';
import {
  fetchCountryDetails,
  fetchRelatedCountries,
  searchCountries,
} from './thunks';
import type { Country, CountryDetails } from './types';

jest.mock('@/api/countriesApi');

const mockedApi = countriesApi as jest.Mocked<typeof countriesApi>;

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

function createStore() {
  return configureStore({
    reducer: { countries: countriesReducer },
  });
}

describe('countries thunks', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('searchCountries calls name search and stores results', async () => {
    mockedApi.searchCountriesByName.mockResolvedValue([sampleCountry]);
    const store = createStore();

    await store.dispatch(
      searchCountries({ query: 'Ukraine', searchType: 'name' }),
    );

    expect(mockedApi.searchCountriesByName).toHaveBeenCalledWith(
      'Ukraine',
      expect.anything(),
    );
    expect(mockedApi.searchCountriesByRegion).not.toHaveBeenCalled();
    expect(store.getState().countries.items).toEqual([sampleCountry]);
    expect(store.getState().countries.status).toBe('succeeded');
    expect(store.getState().countries.hasSearched).toBe(true);
  });

  it('searchCountries calls region search', async () => {
    mockedApi.searchCountriesByRegion.mockResolvedValue([sampleCountry]);
    const store = createStore();

    await store.dispatch(
      searchCountries({ query: 'Europe', searchType: 'region' }),
    );

    expect(mockedApi.searchCountriesByRegion).toHaveBeenCalledWith(
      'Europe',
      expect.anything(),
    );
    expect(mockedApi.searchCountriesByName).not.toHaveBeenCalled();
  });

  it('searchCountries stores an empty list for empty results', async () => {
    mockedApi.searchCountriesByName.mockResolvedValue([]);
    const store = createStore();

    await store.dispatch(
      searchCountries({ query: 'zzzz', searchType: 'name' }),
    );

    expect(store.getState().countries.items).toEqual([]);
    expect(store.getState().countries.status).toBe('succeeded');
    expect(store.getState().countries.error).toBeNull();
  });

  it('searchCountries maps API errors into failed state', async () => {
    mockedApi.searchCountriesByName.mockRejectedValue(
      new ApiError('server', 'The countries service is temporarily unavailable. Please try again.', 500),
    );
    const store = createStore();

    await store.dispatch(
      searchCountries({ query: 'Ukraine', searchType: 'name' }),
    );

    expect(store.getState().countries.status).toBe('failed');
    expect(store.getState().countries.error).toMatch(/temporarily unavailable/);
    expect(store.getState().countries.items).toEqual([]);
  });

  it('searchCountries abort does not mark the slice as failed', async () => {
    mockedApi.searchCountriesByName.mockRejectedValue(
      new ApiError('aborted', 'Request was cancelled.', null),
    );
    const store = createStore();

    const action = store.dispatch(
      searchCountries({ query: 'Ukraine', searchType: 'name' }),
    );
    action.abort();
    await action;

    expect(store.getState().countries.status).not.toBe('failed');
    expect(store.getState().countries.error).toBeNull();
  });

  it('fetchCountryDetails stores entity or null', async () => {
    mockedApi.getCountryByCode.mockResolvedValue(sampleDetails);
    const store = createStore();

    await store.dispatch(fetchCountryDetails('UKR'));
    expect(store.getState().countries.details.entity).toEqual(sampleDetails);

    mockedApi.getCountryByCode.mockResolvedValue(null);
    await store.dispatch(fetchCountryDetails('ZZZ'));
    expect(store.getState().countries.details.entity).toBeNull();
    expect(store.getState().countries.details.status).toBe('succeeded');
  });

  it('fetchRelatedCountries stores related items', async () => {
    mockedApi.getRelatedCountries.mockResolvedValue([sampleCountry]);
    const store = createStore();

    await store.dispatch(
      fetchRelatedCountries({ region: 'Europe', excludeCode: 'DEU' }),
    );

    expect(mockedApi.getRelatedCountries).toHaveBeenCalledWith(
      'Europe',
      'DEU',
      expect.anything(),
    );
    expect(store.getState().countries.related.items).toEqual([sampleCountry]);
  });
});
