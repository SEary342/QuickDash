/// <reference types="vitest/config" />
import { resolve } from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      '@src': resolve(import.meta.dirname, './src'),
      '@comp': resolve(import.meta.dirname, './src/components'),
    },
  },
  define: {
    'process.env': {},
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'src/tests/**',
        'vite.config.ts',
        'src/vite-env.d.ts',
        'coverage/**',
        'eslint.config.js',
        'scripts/**',
      ],
    },
  },
  build: {
    outDir: 'docs',
  },
})
