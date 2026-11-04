import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/test/test-utils';
import { NotFoundView } from './NotFoundView';

describe('NotFoundView', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(
      <NotFoundView onGoHome={() => undefined} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls onGoHome when the button is clicked', async () => {
    const user = userEvent.setup();
    const onGoHome = jest.fn();

    renderWithTheme(<NotFoundView onGoHome={onGoHome} />);

    await user.click(screen.getByRole('button', { name: 'Go to search' }));

    expect(onGoHome).toHaveBeenCalledTimes(1);
  });
});
