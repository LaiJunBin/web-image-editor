import { shallowMount } from '@vue/test-utils'
import TheControlsVue from '../TheControls.vue'
import { TestTool, TestToolComponent } from '@/tests/tool'
import TestControl from '@/tests/control'

describe('test TheControls', () => {
  test('render properly controls', () => {
    const tool = new TestTool(TestToolComponent, [TestControl])
    const wrapper = shallowMount(TheControlsVue, {
      props: {
        tool
      }
    })

    for (const control of tool.controls) {
      expect(wrapper.getComponent(control.component))
    }
  })
})
