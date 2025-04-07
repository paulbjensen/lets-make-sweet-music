import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), sentryVitePlugin({
    org: "anephenix",
    project: "lets-make-sweet-music"
  })],

  build: {
    sourcemap: true
  }
})