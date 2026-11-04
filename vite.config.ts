import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_PROXY_PREFIX = '/api/countries';
const API_PROXY_TARGET = 'https://api.restcountries.com';

function vendorChunk(id: string): string | undefined {
  if (!id.includes('node_modules')) {
    return undefined;
  }

  if (id.includes('/react-dom/') || id.includes('/react/')) {
    return 'vendor-react';
  }

  if (id.includes('/@reduxjs/toolkit/') || id.includes('/react-redux/')) {
    return 'vendor-redux';
  }

  if (id.includes('/styled-components/')) {
    return 'vendor-styled';
  }

  return undefined;
}

function createApiProxy(apiKey: string) {
  return {
    [API_PROXY_PREFIX]: {
      target: API_PROXY_TARGET,
      changeOrigin: true,
      secure: true,
      rewrite: (requestPath: string) =>
        requestPath.replace(/^\/api/, ''),
      configure: (
        proxy: {
          on: (
            event: string,
            listener: (proxyReq: {
              setHeader: (name: string, value: string) => void;
              removeHeader: (name: string) => void;
            }) => void,
          ) => void;
        },
      ) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.removeHeader('origin');
          if (apiKey) {
            proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
          }
        });
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_API_KEY ?? '';
  const apiProxy = createApiProxy(apiKey);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      open: false,
      proxy: apiProxy,
    },
    preview: {
      port: 4173,
      proxy: apiProxy,
    },
    build: {
      sourcemap: !isProduction,
      minify: isProduction,
      // Vite 8 uses Rolldown; rollupOptions is accepted as an alias of rolldownOptions.
      rolldownOptions: {
        output: {
          manualChunks: vendorChunk,
          ...(isProduction
            ? {
                minify: {
                  compress: {
                    dropConsole: true,
                    dropDebugger: true,
                  },
                },
              }
            : {}),
        },
      },
    },
  };
});
