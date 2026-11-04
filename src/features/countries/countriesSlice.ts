import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Country,
  CountryDetails,
  RequestStatus,
  SearchType,
  SortBy,
} from './types';
import {
  fetchCountryDetails,
  fetchRelatedCountries,
  searchCountries,
  type SearchCountriesArg,
} from './thunks';

export type { SearchType, SortBy, RequestStatus };

export interface DetailsState {
  entity: CountryDetails | null;
  status: RequestStatus;
  error: string | null;
  code: string | null;
}

export interface RelatedState {
  items: Country[];
  status: RequestStatus;
  error: string | null;
}

export interface CountriesState {
  items: Country[];
  status: RequestStatus;
  error: string | null;
  searchType: SearchType;
  sortBy: SortBy;
  hasSearched: boolean;
  lastSearch: SearchCountriesArg | null;
  details: DetailsState;
  related: RelatedState;
}

const initialDetails: DetailsState = {
  entity: null,
  status: 'idle',
  error: null,
  code: null,
};

const initialRelated: RelatedState = {
  items: [],
  status: 'idle',
  error: null,
};

export const initialCountriesState: CountriesState = {
  items: [],
  status: 'idle',
  error: null,
  searchType: 'name',
  sortBy: 'population',
  hasSearched: false,
  lastSearch: null,
  details: initialDetails,
  related: initialRelated,
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState: initialCountriesState,
  reducers: {
    setSearchType(state, action: PayloadAction<SearchType>) {
      state.searchType = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
    },
    clearDetails(state) {
      state.details = initialDetails;
      state.related = initialRelated;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCountries.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.hasSearched = true;
        state.lastSearch = action.meta.arg;
      })
      .addCase(searchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(searchCountries.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.status = 'failed';
        state.items = [];
        state.error =
          action.payload ?? action.error.message ?? 'Search failed.';
      })
      .addCase(fetchCountryDetails.pending, (state, action) => {
        state.details = {
          entity: null,
          status: 'loading',
          error: null,
          code: action.meta.arg,
        };
        state.related = initialRelated;
      })
      .addCase(fetchCountryDetails.fulfilled, (state, action) => {
        if (state.details.code !== action.meta.arg) {
          return;
        }
        state.details.status = 'succeeded';
        state.details.entity = action.payload;
        state.details.error = null;
      })
      .addCase(fetchCountryDetails.rejected, (state, action) => {
        if (action.meta.aborted || state.details.code !== action.meta.arg) {
          return;
        }
        state.details.status = 'failed';
        state.details.entity = null;
        state.details.error =
          action.payload ?? action.error.message ?? 'Failed to load country.';
      })
      .addCase(fetchRelatedCountries.pending, (state) => {
        state.related.status = 'loading';
        state.related.error = null;
      })
      .addCase(fetchRelatedCountries.fulfilled, (state, action) => {
        state.related.status = 'succeeded';
        state.related.items = action.payload;
        state.related.error = null;
      })
      .addCase(fetchRelatedCountries.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.related.status = 'failed';
        state.related.items = [];
        state.related.error =
          action.payload ??
          action.error.message ??
          'Failed to load related countries.';
      });
  },
});

export const { setSearchType, setSortBy, clearDetails } =
  countriesSlice.actions;
export const countriesReducer = countriesSlice.reducer;
