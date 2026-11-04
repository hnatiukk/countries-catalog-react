import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/test/test-utils';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(
      <ErrorState message="Something went wrong." onRetry={() => undefined} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the message and calls onRetry', async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();

    renderWithTheme(
      <ErrorState message="Request failed." onRetry={onRetry} />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Request failed.');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
