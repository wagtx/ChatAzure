import { defineConfig } from 'vitest/config'

import vue from '@vitejs/plugin-vue'

import { fileURLToPath } from 'node:url'



export default defineConfig({

  plugins: [vue()],

  test: {

    environment: 'jsdom',

    coverage: {

      provider: 'c8',

      reporter: ['text', 'json', 'html'],

      exclude: [

        'coverage/**',

        'dist/**',

        '**/[.]**',

        'packages/*/test?(s)/**',

        '**/*.d.ts',

        '**/virtual:*',

        '**/__mocks__/*',

        '**/node_modules/**',

      ],

    },

  },

  resolve: {

    alias: {

      '@': fileURLToPath(new URL('./src', import.meta.url)),

    },

  },

}) 
