import { Flag } from './FlagImage.styles';

export interface FlagImageProps {
  src: string;
  alt?: string;
  countryName: string;
  large?: boolean;
}

export function FlagImage({
  src,
  alt,
  countryName,
  large = false,
}: FlagImageProps) {
  const resolvedAlt = alt?.trim() ? alt : `Flag of ${countryName}`;

  return <Flag src={src} alt={resolvedAlt} $large={large} loading="lazy" />;
}
