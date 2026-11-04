import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { theme } from '@/styles/theme';
import { ErrorBoundary } from './ErrorBoundary';

function ProblemChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Boom');
  }

  return <p>All good</p>;
}

function BoundaryHarness() {
  const [shouldThrow, setShouldThrow] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <ProblemChild shouldThrow={shouldThrow} />
      </ErrorBoundary>
      <button type="button" onClick={() => setShouldThrow(false)}>
        Fix cause
      </button>
    </ThemeProvider>
  );
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('shows the fallback when a child throws', () => {
    render(
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <ProblemChild shouldThrow />
        </ErrorBoundary>
      </ThemeProvider>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Something went wrong',
    );
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
  });

  it('re-renders children after Try again once the cause is removed', async () => {
    const user = userEvent.setup();

    render(<BoundaryHarness />);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Fix cause' }));
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByText('All good')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
