import { FactLabel, FactRow, FactsList, FactValue } from './CountryFacts.styles';

export interface CountryFact {
  label: string;
  value: string;
}

export interface CountryFactsProps {
  facts: CountryFact[];
}

export function CountryFacts({ facts }: CountryFactsProps) {
  return (
    <FactsList>
      {facts.map((fact) => (
        <FactRow key={fact.label}>
          <FactLabel>{fact.label}</FactLabel>
          <FactValue>{fact.value}</FactValue>
        </FactRow>
      ))}
    </FactsList>
  );
}
