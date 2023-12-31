import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useSettingStore = defineStore('setting', () => {
  const settings = reactive({
    width: 0,
    height: 0,
    scale: 1,
    translateX: 0,
    translateY: 0
  })

  const color = ref('rgba(0, 0, 0, 255)')
  const lineWidth = ref(5)

  const initSettings = (width: number, height: number) => {
    settings.width = width
    settings.height = height
    settings.scale = 100
    settings.translateX = 0
    settings.translateY = 0
  }

  const setColor = (newColor: string) => {
    color.value = newColor
  }

  const setLineWidth = (newLineWidth: number) => {
    lineWidth.value = newLineWidth
  }

  return { settings, initSettings, color, setColor, lineWidth, setLineWidth }
})
