import { Control } from '@/models/Control'
import { defineComponent, type Component } from 'vue'

export const TheTestControl = defineComponent({
  name: 'TheTestControl',
  template: '<div>Test Control</div>'
})

class TestControl extends Control {
  constructor(component: Component) {
    super(component)
  }
}

export default new TestControl(TheTestControl)
