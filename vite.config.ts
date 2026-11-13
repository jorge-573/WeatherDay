/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Formatters use local time; pin it so results match on every machine and in CI.
    env: { TZ: 'UTC' },
  },
})
