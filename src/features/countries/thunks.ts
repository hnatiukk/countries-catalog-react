import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCountryByCode,
  getRelatedCountries,
  searchCountriesByName,
  searchCountriesByRegion,
} from '@/api/countriesApi';
import { ApiError } from '@/api/types';
import type { Country, CountryDetails, SearchType } from './types';

export interface SearchCountriesArg {
  query: string;
  searchType: SearchType;
}

export interface FetchRelatedCountriesArg {
  region: string;
  excludeCode: string;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof ApiError && error.kind === 'aborted') ||
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

export const searchCountries = createAsyncThunk<
  Country[],
  SearchCountriesArg,
  { rejectValue: string }
>(
  'countries/searchCountries',
  async ({ query, searchType }, { signal, rejectWithValue }) => {
    try {
      if (searchType === 'region') {
        return await searchCountriesByRegion(query, signal);
      }
      return await searchCountriesByName(query, signal);
    } catch (error) {
      if (isAbortError(error) || signal.aborted) {
        throw error;
      }
      return rejectWithValue(toErrorMessage(error));
    }
  },
);

export const fetchCountryDetails = createAsyncThunk<
  CountryDetails | null,
  string,
  { rejectValue: string }
>('countries/fetchCountryDetails', async (code, { signal, rejectWithValue }) => {
  try {
    return await getCountryByCode(code, signal);
  } catch (error) {
    if (isAbortError(error) || signal.aborted) {
      throw error;
    }
    return rejectWithValue(toErrorMessage(error));
  }
});

export const fetchRelatedCountries = createAsyncThunk<
  Country[],
  FetchRelatedCountriesArg,
  { rejectValue: string }
>(
  'countries/fetchRelatedCountries',
  async ({ region, excludeCode }, { signal, rejectWithValue }) => {
    try {
      return await getRelatedCountries(region, excludeCode, signal);
    } catch (error) {
      if (isAbortError(error) || signal.aborted) {
        throw error;
      }
      return rejectWithValue(toErrorMessage(error));
    }
  },
);
