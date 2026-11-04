import { CountryFacts, type CountryFact } from '@/components/CountryFacts';
import { FlagImage } from '@/components/FlagImage';
import {
  Details,
  FlagWrap,
  HeroLayout,
  Highlight,
  HighlightLabel,
  HighlightRow,
  HighlightValue,
  RegionLine,
  Title,
} from './CountryHero.styles';

export interface CountryHeroProps {
  name: string;
  flagPng: string;
  flagAlt?: string;
  region: string;
  subregion: string;
  populationLabel: string;
  areaLabel: string;
  facts: CountryFact[];
}

export function CountryHero({
  name,
  flagPng,
  flagAlt,
  region,
  subregion,
  populationLabel,
  areaLabel,
  facts,
}: CountryHeroProps) {
  return (
    <HeroLayout>
      <FlagWrap>
        <FlagImage src={flagPng} alt={flagAlt} countryName={name} large />
      </FlagWrap>
      <Details>
        <Title>{name}</Title>
        <RegionLine>
          {region} · {subregion}
        </RegionLine>
        <HighlightRow>
          <Highlight>
            <HighlightLabel>Population</HighlightLabel>
            <HighlightValue>{populationLabel}</HighlightValue>
          </Highlight>
          <Highlight>
            <HighlightLabel>Area</HighlightLabel>
            <HighlightValue>{areaLabel}</HighlightValue>
          </Highlight>
        </HighlightRow>
        <CountryFacts facts={facts} />
      </Details>
    </HeroLayout>
  );
}
