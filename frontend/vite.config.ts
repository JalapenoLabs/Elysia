// Copyright © 2024 Elysia

import { defineConfig } from 'vite'

// Node.js
import path from 'path'

// Plugins
import react from '@vitejs/plugin-react-swc'
// https://www.npmjs.com/package/vite-tsconfig-paths
import tsconfigPaths from 'vite-tsconfig-paths'
// https://www.npmjs.com/package/vite-plugin-svgr
import svgr from 'vite-plugin-svgr'
// https://www.npmjs.com/package/vite-plugin-full-reload
import fullReload from 'vite-plugin-full-reload'

// https://vitejs.dev/config/

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    // Absolute imports:
    tsconfigPaths(),
    // React language + JSX:
    react(),
    // Svgs:
    svgr(),
    // Full reload when i18next en/translation.json changes:
    fullReload(['public/locales/**/*.json']),
  ],
  server: {
    // This is necessary for HMR while dockerized:
    host: true,
    strictPort: true,
    watch: {
     usePolling: true,
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
        quietDeps: true,
        additionalData: `
          @use '@/sass/theme.sass' as *
          @use 'sass:color'
        `,
      },
      scss: {
        api: 'modern-compiler',
        quietDeps: true,
        additionalData: `
          @use '@/sass/theme.sass' as *;
          @use 'sass:color';
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  build: {
    sourcemap: process.env.SOURCEMAP === 'true' || process.env.NODE_ENV === 'development',
  }
})
