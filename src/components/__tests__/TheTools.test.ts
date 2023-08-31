import { shallowMount } from '@vue/test-utils'
import TheToolsVue from '../TheTools.vue'
import { TestTool, TestToolComponent, type TestToolOptions } from '@/tests/tool'
import { toolStoreFactory } from '@/stores/tool'
import { toRaw, toRefs } from 'vue'

describe('test TheTools', () => {
  test('render properly tools', () => {
    const tool = new TestTool(TestToolComponent)
    const wrapper = shallowMount(TheToolsVue<TestToolOptions>, {
      props: {
        tools: [tool]
      }
    })

    expect(wrapper.getComponent(tool.component))
  })

  test('render properly tools with active', async () => {
    const activeClass = '\\!bg-neutral-500'
    const tools = [new TestTool(TestToolComponent), new TestTool(TestToolComponent)]
    const wrapper = shallowMount(TheToolsVue<TestToolOptions>, {
      props: {
        tools
      }
    })

    const useToolStore = toolStoreFactory<TestToolOptions>()
    const { tool } = toRefs(useToolStore())
    expect(tool.value).toBeUndefined()
    expect(wrapper.findAll(`.${activeClass}`).length).toBe(0)

    const toolComponent = wrapper.getComponent(tools[0].component)
    await toolComponent.trigger('click')
    expect(wrapper.findAll(`.${activeClass}`).length).toBe(1)
    expect(toRaw(tool.value)).toBe(tools[0])
  })
})
