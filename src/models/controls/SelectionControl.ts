import TheSelectionControl from '@/components/controls/TheSelectionControl.vue'
import { Control } from '../Control'
import type { Component } from 'vue'

class SelectionControl extends Control {
  constructor(component: Component) {
    super(component)
    this.hidden = true
  }
}

export default new SelectionControl(TheSelectionControl)
