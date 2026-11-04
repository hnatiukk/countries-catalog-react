import { BackToSearchButton } from '@/components/BackToSearchButton';
import { CountryGrid } from '@/components/CountryGrid';
import { CountryHero } from '@/components/CountryHero';
import { EmptyState } from '@/components/EmptyState';
import { Header } from '@/components/Header';
import { PageShell } from '@/components/PageShell';
import { SectionTitleBar } from '@/components/SectionTitleBar';
import { useAppSelector } from '@/app/hooks';
import { MOCK_COUNTRIES } from '@/features/countries/mockData';
import { selectSortBy } from '@/features/countries/selectors';
import { formatArea, formatNumber } from '@/utils/format';

export interface CountryDetailsContainerProps {
  countryCode: string;
  onBack: () => void;
  onCountryClick?: (code: string) => void;
}

export function CountryDetailsContainer({
  countryCode,
  onBack,
  onCountryClick,
}: CountryDetailsContainerProps) {
  const sortBy = useAppSelector(selectSortBy);
  const country = MOCK_COUNTRIES.find((item) => item.cca3 === countryCode);

  if (!country) {
    return (
      <PageShell header={<Header actions={<BackToSearchButton onClick={onBack} />} />}>
        <EmptyState message="Country not found" />
      </PageShell>
    );
  }

  const relatedCountries = [...MOCK_COUNTRIES]
    .filter(
      (item) => item.region === country.region && item.cca3 !== country.cca3,
    )
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const languages = Object.values(country.languages).join(', ');
  const currencies = Object.values(country.currencies)
    .map((currency) =>
      currency.symbol
        ? `${currency.name} (${currency.symbol})`
        : currency.name,
    )
    .join(', ');

  return (
    <PageShell
      header={
        <Header actions={<BackToSearchButton onClick={onBack} />}>
          <CountryHero
            name={country.name.common}
            flagPng={country.flags.png}
            flagAlt={country.flags.alt}
            region={country.region}
            subregion={country.subregion}
            populationLabel={formatNumber(country.population)}
            areaLabel={formatArea(country.area)}
            facts={[
              {
                label: 'Capital',
                value: country.capital.join(', ') || '—',
              },
              { label: 'Languages', value: languages || '—' },
              { label: 'Currencies', value: currencies || '—' },
            ]}
          />
        </Header>
      }
    >
      <SectionTitleBar
        prefix="More countries in the same region"
        emphasis={country.region}
      />
      {relatedCountries.length > 0 ? (
        <CountryGrid
          countries={relatedCountries}
          onCountryClick={onCountryClick}
          aria-label={`More countries in ${country.region}`}
        />
      ) : (
        <EmptyState message="No other countries in this region" />
      )}
    </PageShell>
  );
}
