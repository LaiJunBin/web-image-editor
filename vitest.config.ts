import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      deps: {
        optimizer: {
          web: {
            include: ['vitest-canvas-mock']
          }
        }
      },
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      setupFiles: ['./src/setupTests.ts'],
      coverage: {
        exclude: ['src/tests/*']
      }
    }
  })
)
