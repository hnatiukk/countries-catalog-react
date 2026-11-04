import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Country } from './types';

export const selectCountriesItems = (state: RootState) => state.countries.items;
export const selectSearchType = (state: RootState) => state.countries.searchType;
export const selectSortBy = (state: RootState) => state.countries.sortBy;

/** Sorts the current result list by `sortBy` descending (population or area). */
export const selectSortedCountries = createSelector(
  [selectCountriesItems, selectSortBy],
  (items, sortBy): Country[] =>
    [...items].sort((a, b) => b[sortBy] - a[sortBy]),
);
