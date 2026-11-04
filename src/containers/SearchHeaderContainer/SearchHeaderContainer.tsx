import { useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { SearchInput } from '@/components/SearchInput';
import { ToggleButtonGroup } from '@/components/ToggleButtonGroup';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setItems,
  setSearchType,
  type SearchType,
} from '@/features/countries/countriesSlice';
import { MOCK_COUNTRIES } from '@/features/countries/mockData';
import { selectSearchType } from '@/features/countries/selectors';
import {
  ControlsRow,
  Heading,
  SearchForm,
} from './SearchHeaderContainer.styles';

const SEARCH_TYPE_OPTIONS = [
  { value: 'name' as const, label: 'Name' },
  { value: 'region' as const, label: 'Region' },
];

export function SearchHeaderContainer() {
  const dispatch = useAppDispatch();
  const searchType = useAppSelector(selectSearchType);
  const [query, setQuery] = useState('');

  const handleSearchTypeChange = (value: SearchType) => {
    dispatch(setSearchType(value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO(Task 5): replace with API request
    const normalized = query.trim().toLowerCase();
    const results =
      normalized.length === 0
        ? []
        : MOCK_COUNTRIES.filter((country) => {
            if (searchType === 'name') {
              return country.name.common.toLowerCase().includes(normalized);
            }

            return country.region.toLowerCase() === normalized;
          });

    dispatch(setItems(results));
  };

  return (
    <Header>
      <Heading>Find your country</Heading>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Enter country name or region"
          label="Search countries"
        />
        <ControlsRow>
          <ToggleButtonGroup
            label="Search by"
            options={SEARCH_TYPE_OPTIONS}
            value={searchType}
            onChange={handleSearchTypeChange}
            variant="accent"
          />
          <Button type="submit">Search</Button>
        </ControlsRow>
      </SearchForm>
    </Header>
  );
}
