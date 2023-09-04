import TheSealControl from '@/components/controls/TheSealControl.vue'
import { Control } from '../Control'
import type { Component } from 'vue'

class SealControl extends Control {
  constructor(component: Component) {
    super(component)
  }
}

export default new SealControl(TheSealControl)
