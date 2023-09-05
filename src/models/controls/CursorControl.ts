import TheCursorControl from '@/components/controls/TheCursorControl.vue'
import { Control } from '../Control'
import type { Component } from 'vue'

class CursorControl extends Control {
  constructor(component: Component) {
    super(component)
    this.hidden = true
  }
}

export default new CursorControl(TheCursorControl)
