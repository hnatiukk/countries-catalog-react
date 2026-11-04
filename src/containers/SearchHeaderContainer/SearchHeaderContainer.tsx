import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { SearchInput } from '@/components/SearchInput';
import { ToggleButtonGroup } from '@/components/ToggleButtonGroup';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearSearch,
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

function decodeRouteQuery(queryParam: string | undefined): string | null {
  if (queryParam === undefined) {
    return null;
  }

  try {
    return decodeURIComponent(queryParam);
  } catch {
    return queryParam;
  }
}

export function SearchHeaderContainer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { query: queryParam } = useParams<{ query?: string }>();
  const searchType = useAppSelector(selectSearchType);
  const routeQuery = decodeRouteQuery(queryParam);
  const [query, setQuery] = useState(routeQuery ?? '');
  const searchRequestRef = useRef<{ abort: () => void } | null>(null);

  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length > 0;

  useEffect(() => {
    if (routeQuery === null) {
      searchRequestRef.current?.abort();
      searchRequestRef.current = null;
      dispatch(clearSearch());
      return;
    }

    searchRequestRef.current?.abort();
    searchRequestRef.current = dispatch(
      searchCountries({ query: routeQuery, searchType }),
    );

    return () => {
      searchRequestRef.current?.abort();
    };
    // searchType intentionally omitted: type changes must not re-fetch until submit
    // eslint-disable-next-line react-hooks/exhaustive-deps -- route-driven search only
  }, [routeQuery, dispatch]);

  const handleSearchTypeChange = (value: SearchType) => {
    dispatch(setSearchType(value));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSearch) {
      return;
    }

    if (routeQuery !== trimmedQuery) {
      void navigate(`/search/${encodeURIComponent(trimmedQuery)}`);
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
