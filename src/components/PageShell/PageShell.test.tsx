import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { PageShell } from './PageShell';

describe('PageShell', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(
      <PageShell header={<header>Header</header>}>
        <p>Main content</p>
      </PageShell>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders header, main content, and footer logo', () => {
    renderWithTheme(
      <PageShell header={<header>Header</header>}>
        <p>Main content</p>
      </PageShell>,
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('countriescatalog')).toBeInTheDocument();
  });
});
