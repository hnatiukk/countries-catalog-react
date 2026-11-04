import { PageShell } from '@/components/PageShell';
import { CountryGridContainer } from '@/containers/CountryGridContainer';
import { ResultsBarContainer } from '@/containers/ResultsBarContainer';
import { SearchHeaderContainer } from '@/containers/SearchHeaderContainer';

export interface SearchPageProps {
  onCountryClick: (code: string) => void;
}

export function SearchPage({ onCountryClick }: SearchPageProps) {
  return (
    <PageShell header={<SearchHeaderContainer />}>
      <ResultsBarContainer />
      <CountryGridContainer onCountryClick={onCountryClick} />
    </PageShell>
  );
}
