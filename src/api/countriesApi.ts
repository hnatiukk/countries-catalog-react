import type { Country, CountryDetails } from '@/features/countries/types';
import { apiGet } from './httpClient';
import { mapCountries, mapCountryDetails } from './mappers';
import {
  DETAIL_RESPONSE_FIELDS,
  LIST_RESPONSE_FIELDS,
  PAGE_LIMIT,
  type CountryDto,
} from './types';

async function fetchAllPages(
  query: Record<string, string | number>,
  signal?: AbortSignal,
): Promise<CountryDto[]> {
  const objects: CountryDto[] = [];
  let offset = 0;
  let more = true;

  while (more) {
    const envelope = await apiGet<CountryDto>({
      query: {
        ...query,
        limit: PAGE_LIMIT,
        offset,
        response_fields: LIST_RESPONSE_FIELDS,
      },
      signal,
    });

    objects.push(...envelope.data.objects);
    more = Boolean(envelope.data.meta?.more);
    offset += PAGE_LIMIT;

    if (!envelope.data.meta) {
      more = false;
    }
  }

  return objects;
}

export async function searchCountriesByName(
  query: string,
  signal?: AbortSignal,
): Promise<Country[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const objects = await fetchAllPages({ q: trimmed }, signal);
  return mapCountries(objects);
}

export async function searchCountriesByRegion(
  region: string,
  signal?: AbortSignal,
): Promise<Country[]> {
  const trimmed = region.trim();
  if (!trimmed) {
    return [];
  }

  const objects = await fetchAllPages({ region: trimmed }, signal);
  return mapCountries(objects);
}

export async function getCountryByCode(
  code: string,
  signal?: AbortSignal,
): Promise<CountryDetails | null> {
  const trimmed = code.trim();
  if (!trimmed) {
    return null;
  }

  const envelope = await apiGet<CountryDto>({
    path: `/codes.alpha_3/${encodeURIComponent(trimmed)}`,
    query: {
      response_fields: DETAIL_RESPONSE_FIELDS,
    },
    signal,
  });

  const first = envelope.data.objects[0];
  if (!first) {
    return null;
  }

  return mapCountryDetails(first);
}

export async function getRelatedCountries(
  region: string,
  excludeCode: string,
  signal?: AbortSignal,
): Promise<Country[]> {
  const trimmedRegion = region.trim();
  if (!trimmedRegion) {
    return [];
  }

  const countries = await searchCountriesByRegion(trimmedRegion, signal);
  const exclude = excludeCode.trim().toUpperCase();

  return countries
    .filter((country) => country.cca3.toUpperCase() !== exclude)
    .sort((a, b) => b.population - a.population)
    .slice(0, 6);
}
