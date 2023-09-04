import { toRaw, toRefs } from 'vue'
import { TestTool, TestToolComponent } from '@/tests/tool'
import { useToolStore } from '../tool'

describe('tool store', () => {
  test('tool is reactive', () => {
    const { tool, setTool } = toRefs(useToolStore())
    const newTool = new TestTool(TestToolComponent)
    setTool.value(newTool)
    expect(toRaw(tool.value)).toBe(newTool)
  })
})
