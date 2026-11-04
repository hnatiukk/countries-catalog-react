import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

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
