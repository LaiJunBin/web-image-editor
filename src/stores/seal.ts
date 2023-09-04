import type { Seal } from '@/models/Seal'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSealStore = defineStore('seal', () => {
  const seals = ref<Seal[]>([])
  const currentSeal = ref<Seal>()

  const selectedSeal = (seal: Seal) => {
    currentSeal.value = seal
  }

  const addSeal = (seal: Seal) => {
    seals.value.push(seal)
    selectedSeal(seal)
  }

  const deleteSeal = (seal: Seal) => {
    const index = seals.value.indexOf(seal)
    if (index > -1) {
      seals.value.splice(index, 1)
    }
    if (currentSeal.value === seal) {
      currentSeal.value = undefined
    }
  }

  return {
    seals,
    currentSeal,
    selectedSeal,
    addSeal,
    deleteSeal
  }
})
