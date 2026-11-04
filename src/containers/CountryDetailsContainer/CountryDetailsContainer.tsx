import { useEffect, useRef } from 'react';
import { BackToSearchButton } from '@/components/BackToSearchButton';
import { CountryGrid } from '@/components/CountryGrid';
import { CountryHero } from '@/components/CountryHero';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Header } from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';
import { PageShell } from '@/components/PageShell';
import { SectionTitleBar } from '@/components/SectionTitleBar';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearDetails } from '@/features/countries/countriesSlice';
import {
  selectDetailsEntity,
  selectDetailsError,
  selectDetailsStatus,
  selectRelatedError,
  selectRelatedStatus,
  selectSortedRelatedCountries,
} from '@/features/countries/selectors';
import {
  fetchCountryDetails,
  fetchRelatedCountries,
} from '@/features/countries/thunks';
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
  const dispatch = useAppDispatch();
  const country = useAppSelector(selectDetailsEntity);
  const detailsStatus = useAppSelector(selectDetailsStatus);
  const detailsError = useAppSelector(selectDetailsError);
  const relatedCountries = useAppSelector(selectSortedRelatedCountries);
  const relatedStatus = useAppSelector(selectRelatedStatus);
  const relatedError = useAppSelector(selectRelatedError);
  const detailsRequestRef = useRef<{ abort: () => void } | null>(null);
  const relatedRequestRef = useRef<{ abort: () => void } | null>(null);

  useEffect(() => {
    detailsRequestRef.current?.abort();
    relatedRequestRef.current?.abort();
    detailsRequestRef.current = dispatch(fetchCountryDetails(countryCode));

    return () => {
      detailsRequestRef.current?.abort();
      relatedRequestRef.current?.abort();
      dispatch(clearDetails());
    };
  }, [countryCode, dispatch]);

  useEffect(() => {
    if (detailsStatus !== 'succeeded' || !country?.region) {
      return;
    }

    relatedRequestRef.current?.abort();
    relatedRequestRef.current = dispatch(
      fetchRelatedCountries({
        region: country.region,
        excludeCode: country.cca3,
      }),
    );

    return () => {
      relatedRequestRef.current?.abort();
    };
  }, [detailsStatus, country, dispatch]);

  const handleRetryDetails = () => {
    detailsRequestRef.current?.abort();
    detailsRequestRef.current = dispatch(fetchCountryDetails(countryCode));
  };

  const handleRetryRelated = () => {
    if (!country?.region) {
      return;
    }
    relatedRequestRef.current?.abort();
    relatedRequestRef.current = dispatch(
      fetchRelatedCountries({
        region: country.region,
        excludeCode: country.cca3,
      }),
    );
  };

  const header = (
    <Header actions={<BackToSearchButton onClick={onBack} />} />
  );

  if (detailsStatus === 'loading' || detailsStatus === 'idle') {
    return (
      <PageShell header={header}>
        <LoadingState message="Loading country…" />
      </PageShell>
    );
  }

  if (detailsStatus === 'failed') {
    return (
      <PageShell header={header}>
        <ErrorState
          message={detailsError ?? 'Failed to load country.'}
          onRetry={handleRetryDetails}
        />
      </PageShell>
    );
  }

  if (!country) {
    return (
      <PageShell header={header}>
        <EmptyState message="Country not found" />
      </PageShell>
    );
  }

  const languages = Object.values(country.languages).join(', ');
  const currencies = Object.values(country.currencies)
    .map((currency) =>
      currency.symbol
        ? `${currency.name} (${currency.symbol})`
        : currency.name,
    )
    .join(', ');

  let relatedContent;
  if (relatedStatus === 'loading' || relatedStatus === 'idle') {
    relatedContent = <LoadingState message="Loading related countries…" />;
  } else if (relatedStatus === 'failed') {
    relatedContent = (
      <ErrorState
        message={relatedError ?? 'Failed to load related countries.'}
        onRetry={handleRetryRelated}
      />
    );
  } else if (relatedCountries.length > 0) {
    relatedContent = (
      <CountryGrid
        countries={relatedCountries}
        onCountryClick={onCountryClick}
        aria-label={`More countries in ${country.region}`}
      />
    );
  } else {
    relatedContent = (
      <EmptyState message="No other countries in this region" />
    );
  }

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
      {relatedContent}
    </PageShell>
  );
}
