import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('matches snapshot with the default message', () => {
    const { container } = renderWithTheme(<LoadingState />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with a custom message', () => {
    const { container } = renderWithTheme(
      <LoadingState message="Loading countries…" />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('exposes an accessible status', () => {
    renderWithTheme(<LoadingState />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Loading…');
    expect(status).toHaveAttribute('aria-busy', 'true');
  });
});
