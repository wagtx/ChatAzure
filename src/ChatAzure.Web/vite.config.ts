import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

import { fileURLToPath, URL } from 'node:url'



export default defineConfig({

  plugins: [vue()],

  resolve: {

    alias: {

      '@': fileURLToPath(new URL('./src', import.meta.url))

    }

  },

  server: {

    proxy: {

      '/api': {

        target: 'https://localhost:7001',

        changeOrigin: true,

        secure: false

      },

      '/chatHub': {

        target: 'https://localhost:7001',

        changeOrigin: true,

        secure: false,

        ws: true

      }

    }

  }

}) 
