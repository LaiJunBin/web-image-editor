import TheLineWidthControl from '@/components/controls/TheLineWidthControl.vue'
import { Control } from '../Control'
import type { Component } from 'vue'

class LineWidthControl extends Control {
  constructor(component: Component) {
    super(component)
  }
}

export default new LineWidthControl(TheLineWidthControl)
