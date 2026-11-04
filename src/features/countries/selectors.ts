import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Country } from './types';

export const selectCountriesItems = (state: RootState) => state.countries.items;
export const selectCountriesStatus = (state: RootState) =>
  state.countries.status;
export const selectCountriesError = (state: RootState) => state.countries.error;
export const selectHasSearched = (state: RootState) =>
  state.countries.hasSearched;
export const selectLastSearch = (state: RootState) => state.countries.lastSearch;
export const selectSearchType = (state: RootState) => state.countries.searchType;
export const selectSortBy = (state: RootState) => state.countries.sortBy;

export const selectDetails = (state: RootState) => state.countries.details;
export const selectDetailsEntity = (state: RootState) =>
  state.countries.details.entity;
export const selectDetailsStatus = (state: RootState) =>
  state.countries.details.status;
export const selectDetailsError = (state: RootState) =>
  state.countries.details.error;

export const selectRelatedItems = (state: RootState) =>
  state.countries.related.items;
export const selectRelatedStatus = (state: RootState) =>
  state.countries.related.status;
export const selectRelatedError = (state: RootState) =>
  state.countries.related.error;

/** Sorts the current result list by `sortBy` descending (population or area). */
export const selectSortedCountries = createSelector(
  [selectCountriesItems, selectSortBy],
  (items, sortBy): Country[] =>
    [...items].sort((a, b) => b[sortBy] - a[sortBy]),
);

/** Related countries sorted by the current sort toggle. */
export const selectSortedRelatedCountries = createSelector(
  [selectRelatedItems, selectSortBy],
  (items, sortBy): Country[] =>
    [...items].sort((a, b) => b[sortBy] - a[sortBy]),
);
