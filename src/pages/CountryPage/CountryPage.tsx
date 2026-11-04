import { CountryDetailsContainer } from '@/containers/CountryDetailsContainer';

export interface CountryPageProps {
  countryCode: string;
  onBack: () => void;
  onCountryClick: (code: string) => void;
}

export function CountryPage({
  countryCode,
  onBack,
  onCountryClick,
}: CountryPageProps) {
  return (
    <CountryDetailsContainer
      countryCode={countryCode}
      onBack={onBack}
      onCountryClick={onCountryClick}
    />
  );
}
