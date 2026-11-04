import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('matches snapshot with the default message', () => {
    const { container } = renderWithTheme(<EmptyState />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with a custom message', () => {
    const { container } = renderWithTheme(
      <EmptyState message="Country not found" />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('exposes the message via status role', () => {
    renderWithTheme(<EmptyState message="No results" />);

    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });
});
