import { CountryGrid } from '@/components/CountryGrid';
import { EmptyState } from '@/components/EmptyState';
import { useAppSelector } from '@/app/hooks';
import { selectSortedCountries } from '@/features/countries/selectors';

export interface CountryGridContainerProps {
  onCountryClick?: (code: string) => void;
}

export function CountryGridContainer({
  onCountryClick,
}: CountryGridContainerProps) {
  const countries = useAppSelector(selectSortedCountries);

  if (countries.length === 0) {
    return <EmptyState />;
  }

  return (
    <CountryGrid countries={countries} onCountryClick={onCountryClick} />
  );
}
