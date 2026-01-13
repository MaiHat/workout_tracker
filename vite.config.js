import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/workout_tracker/",
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // ←ブラウザ環境を再現
    setupFiles: './src/setupTests.js', // ←後で作る
  },
})
