import { shallowMount } from '@vue/test-utils'
import TheRecordLayerVue from '../TheRecordLayer.vue'
import { TestTool, TestToolComponent } from '@/tests/tool'
import { useToolStore } from '@/stores/tool'
import { useLayerStore } from '@/stores/layer'
import { toRefs } from 'vue'

describe('TheRecordLayer', () => {
  test('should dispatch mouse related events using tool', () => {
    const wrapper = shallowMount(TheRecordLayerVue)
    const testTool = new TestTool(TestToolComponent)
    const canvas = wrapper.find('canvas')
    const mouseEvents = ['mouseover', 'mousedown', 'mousemove', 'mouseout']

    const { setTool } = useToolStore()
    setTool(testTool)

    vi.spyOn(testTool, 'mouseover')
    vi.spyOn(testTool, 'mousedown')
    vi.spyOn(testTool, 'mousemove')
    vi.spyOn(testTool, 'mouseout')
    vi.spyOn(testTool, 'mouseup')

    mouseEvents.forEach((event) => {
      canvas.trigger(event)
    })
    window.dispatchEvent(new MouseEvent('mouseup'))

    expect(testTool.mouseover).toHaveBeenCalled()
    expect(testTool.mousedown).toHaveBeenCalled()
    expect(testTool.mousemove).toHaveBeenCalled()
    expect(testTool.mouseout).toHaveBeenCalled()
    expect(testTool.mouseup).toHaveBeenCalled()
  })

  test('when mouseup event is triggered, should call recordLayer commit', () => {
    shallowMount(TheRecordLayerVue)
    const { recordLayer, initLayers } = toRefs(useLayerStore())

    initLayers.value('#333')
    vi.spyOn(recordLayer.value!, 'commit')
    window.dispatchEvent(new MouseEvent('mouseup'))

    expect(recordLayer.value?.commit).toHaveBeenCalled()
  })

  test('when unmouted, should remove window mouseup event', () => {
    const wrapper = shallowMount(TheRecordLayerVue)
    const testTool = new TestTool(TestToolComponent)
    const { setTool } = useToolStore()

    setTool(testTool)
    vi.spyOn(testTool, 'mouseup')
    wrapper.unmount()

    window.dispatchEvent(new MouseEvent('mouseup'))
    expect(testTool.mouseup).not.toHaveBeenCalled()
  })
})
