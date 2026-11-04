import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Country } from './types';

export type SearchType = 'name' | 'region';
export type SortBy = 'population' | 'area';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface CountriesState {
  items: Country[];
  status: RequestStatus;
  error: string | null;
  searchType: SearchType;
  sortBy: SortBy;
}

const initialState: CountriesState = {
  items: [],
  status: 'idle',
  error: null,
  searchType: 'name',
  sortBy: 'population',
};

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setSearchType(state, action: PayloadAction<SearchType>) {
      state.searchType = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
    },
    setItems(state, action: PayloadAction<Country[]>) {
      state.items = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
  },
});

export const { setSearchType, setSortBy, setItems } = countriesSlice.actions;
export const countriesReducer = countriesSlice.reducer;
