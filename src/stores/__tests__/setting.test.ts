import { toRaw, toRefs } from 'vue'
import { useSettingStore } from '../setting'

describe('setting store', () => {
  test('initSetting', () => {
    const { settings, initSettings } = useSettingStore()
    const width = 100
    const height = 100
    initSettings(width, height)
    expect(settings.width).toBe(width)
    expect(settings.height).toBe(height)
    expect(settings.scale).toBe(1)
  })

  test('color is reactive', () => {
    const { color, setColor } = toRefs(useSettingStore())
    const newColor = '#333'
    setColor.value(newColor)
    expect(toRaw(color.value)).toBe(newColor)
  })

  test('lineWidth is reactive', () => {
    const { lineWidth, setLineWidth } = toRefs(useSettingStore())
    const newLineWidth = 10
    setLineWidth.value(newLineWidth)
    expect(toRaw(lineWidth.value)).toBe(newLineWidth)
  })
})
