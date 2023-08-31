import { toRaw, toRefs } from 'vue'
import { TestTool, TestToolComponent, type TestToolOptions } from '@/tests/tool'
import { toolStoreFactory } from '../tool'

const useToolStore = toolStoreFactory<TestToolOptions>()
describe('tool store', () => {
  test('tool is reactive', () => {
    const { tool, setTool } = toRefs(useToolStore())
    const newTool = new TestTool(TestToolComponent)
    setTool.value(newTool)
    expect(toRaw(tool.value)).toBe(newTool)
  })
})
