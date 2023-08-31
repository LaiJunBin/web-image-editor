import ThePaletteControl from '@/components/controls/ThePaletteControl.vue'
import { Control } from '../Control'
import type { Component } from 'vue'

class PaletteControl extends Control {
  constructor(component: Component) {
    super(component)
  }
}

export default new PaletteControl(ThePaletteControl)
