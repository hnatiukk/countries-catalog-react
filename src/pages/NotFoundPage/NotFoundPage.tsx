import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { NotFoundView } from '@/components/NotFoundView';
import { PageShell } from '@/components/PageShell';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageShell header={<Header />}>
      <NotFoundView onGoHome={() => navigate('/')} />
    </PageShell>
  );
}
