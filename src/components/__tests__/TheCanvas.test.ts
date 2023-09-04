import { useSettingStore } from '@/stores/setting'
import TheCanvasVue from '../TheCanvas.vue'
import { toRefs } from 'vue'
import { mount } from '@vue/test-utils'
import { useLayerStore } from '@/stores/layer'

describe('TheCanvas', () => {
  test('should render with correct setting', () => {
    const { initSettings, settings } = toRefs(useSettingStore())
    const { initLayers } = toRefs(useLayerStore())

    initSettings.value(100, 100)
    initLayers.value('#333')

    const wrapper = mount(TheCanvasVue)

    const canvas = wrapper.get('canvas')
    expect(canvas.attributes('width')).toBe(settings.value.width.toString())
    expect(canvas.attributes('height')).toBe(settings.value.height.toString())
  })

  test('commit should clear canvas and write to current layer', () => {
    const { initSettings } = useSettingStore()
    const { recordLayer, currentLayer, initLayers } = toRefs(useLayerStore())

    initSettings(100, 100)
    initLayers.value('#333')

    const wrapper = mount(TheCanvasVue)
    const canvas = wrapper.find('canvas')
    const ctx = canvas.element.getContext('2d') as CanvasRenderingContext2D
    const imageData = ctx.createImageData(100, 100)
    imageData.data.fill(255)
    recordLayer.value!.ctx.getImageData = vi
      .fn(recordLayer.value!.ctx.getImageData)
      .mockReturnValueOnce(imageData)

    expect(currentLayer.value?.objects.length).toBe(0)
    recordLayer.value!.commit()
    expect(currentLayer.value?.objects.length).toBe(1)
    expect(currentLayer.value?.objects[0]).toStrictEqual(imageData)
    expect(
      recordLayer.value!.ctx.getImageData(0, 0, 100, 100).data.every((value) => value === 0)
    ).toBe(true)
  })
})
