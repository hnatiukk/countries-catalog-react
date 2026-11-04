import { renderWithTheme } from '@/test/test-utils';
import { CountryFacts } from './CountryFacts';

describe('CountryFacts', () => {
  it('matches snapshot with facts', () => {
    const { container } = renderWithTheme(
      <CountryFacts
        facts={[
          { label: 'Capital', value: 'Kyiv' },
          { label: 'Languages', value: 'Ukrainian' },
        ]}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with an empty list', () => {
    const { container } = renderWithTheme(<CountryFacts facts={[]} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
