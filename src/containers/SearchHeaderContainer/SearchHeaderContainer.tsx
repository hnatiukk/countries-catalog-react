import { useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { SearchInput } from '@/components/SearchInput';
import { ToggleButtonGroup } from '@/components/ToggleButtonGroup';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setSearchType,
  type SearchType,
} from '@/features/countries/countriesSlice';
import { selectSearchType } from '@/features/countries/selectors';
import { searchCountries } from '@/features/countries/thunks';
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
  const searchRequestRef = useRef<{ abort: () => void } | null>(null);

  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length > 0;

  const handleSearchTypeChange = (value: SearchType) => {
    dispatch(setSearchType(value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSearch) {
      return;
    }

    searchRequestRef.current?.abort();
    searchRequestRef.current = dispatch(
      searchCountries({ query: trimmedQuery, searchType }),
    );
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
          <Button type="submit" disabled={!canSearch}>
            Search
          </Button>
        </ControlsRow>
      </SearchForm>
    </Header>
  );
}
