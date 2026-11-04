import { FlagImage } from '@/components/FlagImage';
import { formatNumber } from '@/utils/format';
import {
  Card,
  CardBody,
  CardRow,
  CountryName,
  Population,
  Region,
} from './CountryCard.styles';

export interface CountryCardProps {
  name: string;
  flagPng: string;
  flagAlt?: string;
  population: number;
  region: string;
  onClick?: () => void;
}

export function CountryCard({
  name,
  flagPng,
  flagAlt,
  population,
  region,
  onClick,
}: CountryCardProps) {
  return (
    <Card type="button" onClick={onClick} aria-label={name}>
      <FlagImage src={flagPng} alt={flagAlt} countryName={name} />
      <CardBody>
        <CardRow>
          <CountryName>{name}</CountryName>
          <Population>{formatNumber(population)}</Population>
        </CardRow>
        <Region>{region}</Region>
      </CardBody>
    </Card>
  );
}
