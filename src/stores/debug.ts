import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useDebugStore = defineStore('debug', () => {
  const offset = reactive({
    x: 0,
    y: 0
  })

  const center = reactive({
    x: 0,
    y: 0
  })

  return { offset, center }
})
