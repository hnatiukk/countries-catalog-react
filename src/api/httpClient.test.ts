import { config } from '@/utils/config';
import { apiGet, __test__ } from './httpClient';
import { ApiError } from './types';

describe('httpClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('buildUrl', () => {
    it('builds a path with query params and skips empty values', () => {
      expect(
        __test__.buildUrl('', {
          q: 'ukraine',
          limit: 100,
          offset: 0,
          empty: '',
          missing: undefined,
        }),
      ).toBe('/api/countries/v5?q=ukraine&limit=100&offset=0');
    });

    it('appends a nested path', () => {
      expect(__test__.buildUrl('/codes.alpha_3/UKR', { limit: 1 })).toBe(
        '/api/countries/v5/codes.alpha_3/UKR?limit=1',
      );
    });
  });

  describe('apiGet', () => {
    it('sends Authorization header and never puts the key in the URL', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          data: { objects: [], meta: { total: 0, count: 0, limit: 100, offset: 0, more: false } },
        }),
      });
      globalThis.fetch = fetchMock as unknown as typeof fetch;

      await apiGet({ query: { q: 'ukraine' } });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toContain('/api/countries/v5');
      expect(url).not.toContain(config.apiKey);
      expect(url.toLowerCase()).not.toContain('authorization');
      expect((init.headers as Record<string, string>).Authorization).toBe(
        `Bearer ${config.apiKey}`,
      );
    });

    it('returns a valid envelope', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({
          data: {
            objects: [{ names: { common: 'Ukraine' } }],
            meta: { total: 1, count: 1, limit: 100, offset: 0, more: false },
          },
        }),
      }) as unknown as typeof fetch;

      const result = await apiGet<{ names: { common: string } }>({
        query: { q: 'ukraine' },
      });

      expect(result.data.objects).toHaveLength(1);
      expect(result.data.objects[0]?.names.common).toBe('Ukraine');
    });

    it('throws unauthorized for 401', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
        json: async () => ({
          errors: [{ message: 'No matching authorization key found.', code: 'authKeyNotFound' }],
        }),
      }) as unknown as typeof fetch;

      await expect(apiGet()).rejects.toMatchObject({
        kind: 'unauthorized',
        status: 401,
      });
      await expect(apiGet()).rejects.toThrow(/Authentication failed/);
    });

    it('throws rateLimited for 429', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 429,
        headers: { get: () => 'application/json' },
        json: async () => ({
          errors: [{ message: 'Rate limit exceeded.', code: 'rateLimited' }],
        }),
      }) as unknown as typeof fetch;

      await expect(apiGet()).rejects.toMatchObject({
        kind: 'rateLimited',
        status: 429,
      });
    });

    it('throws notFound for 404', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: { get: () => 'application/json' },
        json: async () => ({ errors: [{ message: 'Not found' }] }),
      }) as unknown as typeof fetch;

      await expect(apiGet()).rejects.toMatchObject({
        kind: 'notFound',
        status: 404,
      });
    });

    it('throws server for 500', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        headers: { get: () => 'application/json' },
        json: async () => ({
          errors: [{ message: 'Internal server error.', code: 'serverError' }],
        }),
      }) as unknown as typeof fetch;

      await expect(apiGet()).rejects.toMatchObject({
        kind: 'server',
        status: 500,
      });
    });

    it('throws invalidResponse when objects is missing', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ data: { meta: {} } }),
      }) as unknown as typeof fetch;

      await expect(apiGet()).rejects.toMatchObject({
        kind: 'invalidResponse',
      });
    });

    it('throws network when fetch rejects', async () => {
      globalThis.fetch = jest
        .fn()
        .mockRejectedValue(new TypeError('Failed to fetch'));

      await expect(apiGet()).rejects.toMatchObject({
        kind: 'network',
      });
    });

    it('throws aborted when the signal is aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      globalThis.fetch = jest.fn().mockImplementation(() => {
        const error = new DOMException('Aborted', 'AbortError');
        return Promise.reject(error);
      }) as unknown as typeof fetch;

      await expect(apiGet({ signal: controller.signal })).rejects.toMatchObject({
        kind: 'aborted',
      });
    });

    it('exposes ApiError kind helpers', () => {
      expect(__test__.kindForStatus(401)).toBe('unauthorized');
      expect(__test__.kindForStatus(429)).toBe('rateLimited');
      expect(__test__.kindForStatus(404)).toBe('notFound');
      expect(__test__.kindForStatus(503)).toBe('server');
      expect(__test__.messageForStatus(401)).toMatch(/Authentication failed/);
      expect(() => {
        throw new ApiError('server', 'boom', 500);
      }).toThrow(ApiError);
    });
  });
});
