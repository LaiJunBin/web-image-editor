import { defineStore } from 'pinia'
import { Tool } from '@/models/Tool'
import { ref, type Ref } from 'vue'

export const useToolStore = defineStore('tool', () => {
  const tool = ref<Tool>() as Ref<Tool>
  const setTool = (newTool: Tool) => {
    tool.value = newTool
  }

  return { tool, setTool }
})
