import { defineStore } from 'pinia'
import { Tool } from '@/models/Tool'
import { ref, toRaw, type Ref } from 'vue'

export const useToolStore = defineStore('tool', () => {
  const tool = ref<Tool>() as Ref<Tool>
  const setTool = (newTool: Tool) => {
    if (tool.value && toRaw(tool.value) !== newTool) {
      tool.value.beforeSwitch()
    }
    tool.value = newTool
  }

  return { tool, setTool }
})
