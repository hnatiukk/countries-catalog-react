import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Main, Shell } from './PageShell.styles';

export interface PageShellProps {
  header: ReactNode;
  children: ReactNode;
}

export function PageShell({ header, children }: PageShellProps) {
  return (
    <Shell>
      {header}
      <Main>{children}</Main>
      <Footer />
    </Shell>
  );
}
