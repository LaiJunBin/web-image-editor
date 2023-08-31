import { defineStore } from 'pinia'
import { Tool } from '@/models/Tool'
import { ref, type Ref } from 'vue'

export const toolStoreFactory = <T>() => {
  return defineStore('tool', () => {
    const tool = ref<Tool<T>>() as Ref<Tool<T>>
    const setTool = (newTool: Tool<T>) => {
      tool.value = newTool
    }

    return { tool, setTool }
  })
}
