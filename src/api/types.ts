/** REST Countries v5 DTO types (discovered shapes). */

export interface CountryNamesDto {
  common?: string | null;
  official?: string | null;
}

export interface CountryCodesDto {
  alpha_2?: string | null;
  alpha_3?: string | null;
}

export interface CountryFlagDto {
  url_png?: string | null;
  url_svg?: string | null;
  description?: string | null;
}

export interface CountryCapitalDto {
  name?: string | null;
}

export interface CountryAreaDto {
  kilometers?: number | null;
  miles?: number | null;
}

export interface CountryLanguageDto {
  bcp47?: string | null;
  iso639_1?: string | null;
  iso639_2b?: string | null;
  iso639_2t?: string | null;
  iso639_3?: string | null;
  name?: string | null;
  native_name?: string | null;
}

export interface CountryCurrencyDto {
  code?: string | null;
  name?: string | null;
  symbol?: string | null;
}

/** Country object as returned by list/read endpoints (fields may be trimmed). */
export interface CountryDto {
  names?: CountryNamesDto | null;
  codes?: CountryCodesDto | null;
  flag?: CountryFlagDto | null;
  region?: string | null;
  subregion?: string | null;
  capitals?: CountryCapitalDto[] | null;
  population?: number | null;
  area?: CountryAreaDto | null;
  languages?: CountryLanguageDto[] | null;
  currencies?: CountryCurrencyDto[] | null;
}

export interface ApiMeta {
  total: number;
  count: number;
  limit: number;
  offset: number;
  more: boolean;
  request_id?: string;
  duration?: number;
}

export interface ApiEnvelope<T> {
  data: {
    objects: T[];
    meta?: ApiMeta;
  };
}

export interface ApiErrorBody {
  errors?: Array<{
    message?: string;
    code?: string;
  }>;
}

export type ApiErrorKind =
  | 'network'
  | 'unauthorized'
  | 'rateLimited'
  | 'notFound'
  | 'server'
  | 'invalidResponse'
  | 'aborted';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;

  constructor(kind: ApiErrorKind, message: string, status: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

export const LIST_RESPONSE_FIELDS = [
  'names.common',
  'codes.alpha_3',
  'flag.url_png',
  'flag.url_svg',
  'flag.description',
  'region',
  'population',
  'area',
  'capitals',
].join(',');

export const DETAIL_RESPONSE_FIELDS = [
  'names.common',
  'codes.alpha_3',
  'flag.url_png',
  'flag.url_svg',
  'flag.description',
  'region',
  'subregion',
  'capitals',
  'population',
  'area',
  'languages',
  'currencies',
].join(',');

export const PAGE_LIMIT = 100;
