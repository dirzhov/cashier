import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      vue(),
      ...(env.ISTANBUL_COVERAGE
        ? [istanbul({
        include: 'src/**/*',
        exclude: ['node_modules', 'public', 'e2e'],
        extension: ['.js', '.ts', '.vue'],
        requireEnv: false
      })] : []),
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': env.VITE_API_URL || 'http://backend:3000'
      }
    },
    preview: {
      port: 4173
    },
    build: {
      sourcemap: !!env.ISTANBUL_COVERAGE, // Source maps are necessary for accurate coverage
    },
  }
})
