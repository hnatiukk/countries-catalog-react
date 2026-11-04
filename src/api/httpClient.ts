import { config } from '@/utils/config';
import {
  ApiError,
  type ApiEnvelope,
  type ApiErrorBody,
  type ApiErrorKind,
} from './types';

export type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions {
  path?: string;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

function buildQueryString(query?: Record<string, QueryValue>): string {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    params.set(key, String(value));
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

function buildUrl(path = '', query?: Record<string, QueryValue>): string {
  const base = config.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path
    ? path.startsWith('/')
      ? path
      : `/${path}`
    : '';
  return `${base}${normalizedPath}${buildQueryString(query)}`;
}

function messageForStatus(status: number): string {
  if (status === 401) {
    return 'Authentication failed. Check that VITE_API_KEY is set correctly in .env.local.';
  }
  if (status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (status === 404) {
    return 'The requested resource was not found.';
  }
  if (status >= 500) {
    return 'The countries service is temporarily unavailable. Please try again.';
  }
  return 'Something went wrong while talking to the countries service.';
}

function kindForStatus(status: number): ApiErrorKind {
  if (status === 401) {
    return 'unauthorized';
  }
  if (status === 429) {
    return 'rateLimited';
  }
  if (status === 404) {
    return 'notFound';
  }
  if (status >= 500) {
    return 'server';
  }
  return 'server';
}

function parseErrorMessage(body: unknown, status: number): string {
  if (status === 401) {
    return messageForStatus(401);
  }
  if (status === 429) {
    return messageForStatus(429);
  }

  if (body && typeof body === 'object' && 'errors' in body) {
    const errors = (body as ApiErrorBody).errors;
    const first = errors?.[0]?.message;
    if (typeof first === 'string' && first.trim() !== '') {
      return first;
    }
  }

  return messageForStatus(status);
}

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

export async function apiGet<T>(
  options: RequestOptions = {},
): Promise<ApiEnvelope<T>> {
  const url = buildUrl(options.path, options.query);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      signal: options.signal,
    });
  } catch (error) {
    if (isAbortError(error) || options.signal?.aborted) {
      throw new ApiError('aborted', 'Request was cancelled.', null);
    }
    throw new ApiError(
      'network',
      'Unable to reach the countries service. Check your connection and try again.',
      null,
    );
  }

  if (options.signal?.aborted) {
    throw new ApiError('aborted', 'Request was cancelled.', null);
  }

  let body: unknown = null;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      kindForStatus(response.status),
      parseErrorMessage(body, response.status),
      response.status,
    );
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !('data' in body) ||
    !(body as ApiEnvelope<T>).data ||
    !Array.isArray((body as ApiEnvelope<T>).data.objects)
  ) {
    throw new ApiError(
      'invalidResponse',
      'Received an unexpected response from the countries service.',
      response.status,
    );
  }

  return body as ApiEnvelope<T>;
}

/** Exported for unit tests. */
export const __test__ = { buildUrl, buildQueryString, messageForStatus, kindForStatus };
