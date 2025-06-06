// Copyright © 2025 Jalapeno Labs

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./tests/vitest.setup.ts'],
    reporters: 'verbose',
    globals: true,
    environment: 'node',
  },
})
