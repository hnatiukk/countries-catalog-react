import { useNavigate } from 'react-router-dom';
import { CountryGrid } from '@/components/CountryGrid';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectCountriesError,
  selectCountriesStatus,
  selectLastSearch,
  selectSortedCountries,
} from '@/features/countries/selectors';
import { searchCountries } from '@/features/countries/thunks';

export function CountryGridContainer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const countries = useAppSelector(selectSortedCountries);
  const status = useAppSelector(selectCountriesStatus);
  const error = useAppSelector(selectCountriesError);
  const lastSearch = useAppSelector(selectLastSearch);

  const handleRetry = () => {
    if (!lastSearch) {
      return;
    }
    void dispatch(searchCountries(lastSearch));
  };

  const handleCountryClick = (code: string) => {
    void navigate(`/country/${code}`);
  };

  if (status === 'loading') {
    return <LoadingState message="Loading countries…" />;
  }

  if (status === 'failed') {
    return (
      <ErrorState
        message={error ?? 'Something went wrong. Please try again.'}
        onRetry={handleRetry}
      />
    );
  }

  if (countries.length === 0) {
    return <EmptyState />;
  }

  return (
    <CountryGrid countries={countries} onCountryClick={handleCountryClick} />
  );
}
