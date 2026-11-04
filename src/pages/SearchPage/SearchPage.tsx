import { useParams } from 'react-router-dom';
import { CountryGridContainer } from '@/containers/CountryGridContainer';
import { ResultsBarContainer } from '@/containers/ResultsBarContainer';
import { SearchHeaderContainer } from '@/containers/SearchHeaderContainer';
import { PageShell } from '@/components/PageShell';

export function SearchPage() {
  const { query } = useParams<{ query?: string }>();

  return (
    <PageShell header={<SearchHeaderContainer key={query ?? ''} />}>
      <ResultsBarContainer />
      <CountryGridContainer />
    </PageShell>
  );
}
