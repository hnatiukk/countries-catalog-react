import type { Country, CountryCurrency, CountryDetails } from '@/features/countries/types';
import type { CountryDto } from './types';

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function mapCapitalNames(dto: CountryDto): string[] {
  if (!Array.isArray(dto.capitals)) {
    return [];
  }

  return dto.capitals
    .map((capital) => asString(capital?.name).trim())
    .filter((name) => name.length > 0);
}

function mapLanguages(dto: CountryDto): Record<string, string> {
  if (!Array.isArray(dto.languages)) {
    return {};
  }

  const result: Record<string, string> = {};
  dto.languages.forEach((language, index) => {
    const name = asString(language?.name).trim();
    if (!name) {
      return;
    }
    const key =
      asString(language?.iso639_3).trim() ||
      asString(language?.bcp47).trim() ||
      asString(language?.iso639_1).trim() ||
      `lang_${index}`;
    result[key] = name;
  });
  return result;
}

function mapCurrencies(dto: CountryDto): Record<string, CountryCurrency> {
  if (!Array.isArray(dto.currencies)) {
    return {};
  }

  const result: Record<string, CountryCurrency> = {};
  dto.currencies.forEach((currency, index) => {
    const name = asString(currency?.name).trim();
    if (!name) {
      return;
    }
    const code = asString(currency?.code).trim() || `cur_${index}`;
    const symbol = asString(currency?.symbol).trim();
    result[code] = symbol ? { name, symbol } : { name };
  });
  return result;
}

export function mapCountry(dto: CountryDto | null | undefined): Country {
  const safe = dto ?? {};
  const capitals = mapCapitalNames(safe);

  return {
    name: {
      common: asString(safe.names?.common, 'Unknown'),
    },
    cca3: asString(safe.codes?.alpha_3).toUpperCase(),
    flags: {
      png: asString(safe.flag?.url_png),
      svg: asString(safe.flag?.url_svg),
      ...(asString(safe.flag?.description)
        ? { alt: asString(safe.flag?.description) }
        : {}),
    },
    region: asString(safe.region),
    population: asNumber(safe.population),
    area: asNumber(safe.area?.kilometers),
    ...(capitals.length > 0 ? { capital: capitals } : {}),
  };
}

export function mapCountryDetails(
  dto: CountryDto | null | undefined,
): CountryDetails {
  const base = mapCountry(dto);
  const safe = dto ?? {};
  const capitals = mapCapitalNames(safe);

  return {
    ...base,
    subregion: asString(safe.subregion),
    capital: capitals,
    languages: mapLanguages(safe),
    currencies: mapCurrencies(safe),
  };
}

export function mapCountries(dtos: CountryDto[]): Country[] {
  return dtos.map(mapCountry);
}
