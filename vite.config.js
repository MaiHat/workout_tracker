import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/workout_tracker/",
  test: {
    globals: true,
    environment: 'jsdom', // ←ブラウザ環境を再現
    setupFiles: './src/setupTests.js', // ←後で作る
  },
})
