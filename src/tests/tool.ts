import { Tool } from '@/models/Tool'
import type { Control } from '@/models/Control'
import { defineComponent, type Component } from 'vue'

export type TestToolOptions = {}

export const TestToolComponent = defineComponent({
  name: 'TestTool',
  template: '<div></div>'
})

export class TestTool extends Tool<TestToolOptions> {
  constructor(component: Component, controls: Control[] = []) {
    super('測試工具', component, controls)
  }

  mouseover(e: MouseEvent) {}
  mousedown(e: MouseEvent) {}
  mousemove(e: MouseEvent) {}
  mouseup(e: MouseEvent) {}
  mouseout(e: MouseEvent) {}
  mousePreview(e: MouseEvent) {}
}
