import { CountryCard } from '@/components/CountryCard';
import type { Country } from '@/features/countries/types';
import { Grid, GridSection } from './CountryGrid.styles';

export interface CountryGridProps {
  countries: Country[];
  onCountryClick?: (code: string) => void;
  'aria-label'?: string;
}

export function CountryGrid({
  countries,
  onCountryClick,
  'aria-label': ariaLabel = 'Countries',
}: CountryGridProps) {
  return (
    <GridSection aria-label={ariaLabel}>
      <Grid>
        {countries.map((country) => (
          <CountryCard
            key={country.cca3}
            name={country.name.common}
            flagPng={country.flags.png}
            flagAlt={country.flags.alt}
            population={country.population}
            region={country.region}
            onClick={() => onCountryClick?.(country.cca3)}
          />
        ))}
      </Grid>
    </GridSection>
  );
}
