import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface History {
  fn: () => void
  rollback: () => void
}

export const useHistoryStore = defineStore('history', () => {
  const history = ref<History[]>([])
  const historyIndex = ref<number>(-1)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  const canUndo = computed(() => historyIndex.value > -1)
  const historyLength = computed(() => history.value.length)

  const clearHistory = () => {
    history.value = []
    historyIndex.value = -1
  }

  const commitHistory = (fn: () => void, rollback: () => void) => {
    history.value.splice(historyIndex.value + 1)
    history.value[++historyIndex.value] = {
      fn,
      rollback
    }
    fn()
  }

  const redo = () => {
    if (canRedo.value) {
      history.value[++historyIndex.value].fn()
    }
  }

  const undo = () => {
    if (canUndo.value) {
      history.value[historyIndex.value--].rollback()
    }
  }

  return {
    clearHistory,
    commitHistory,
    redo,
    undo,
    canRedo,
    canUndo,
    historyLength
  }
})
