import { createPinia, setActivePinia } from 'pinia'
import 'vitest-canvas-mock'

beforeEach(() => {
  setActivePinia(createPinia())
})
