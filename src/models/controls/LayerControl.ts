import TheLayersControl from '@/components/controls/TheLayersControl.vue'
import { Control } from '../Control'
import type { Component } from 'vue'

class LayerControl extends Control {
  constructor(component: Component) {
    super(component)
  }
}

export default new LayerControl(TheLayersControl)
