import { CountryGridContainer } from '@/containers/CountryGridContainer';
import { ResultsBarContainer } from '@/containers/ResultsBarContainer';
import { SearchHeaderContainer } from '@/containers/SearchHeaderContainer';
import { PageShell } from '@/components/PageShell';

export function SearchPage() {
  return (
    <PageShell header={<SearchHeaderContainer />}>
      <ResultsBarContainer />
      <CountryGridContainer />
    </PageShell>
  );
}
