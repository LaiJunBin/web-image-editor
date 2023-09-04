import { Tool } from '@/models/Tool'
import type { Component } from 'vue'
import type { Control } from '../Control'
import ThePaintBucketTool from '@/components/tools/ThePaintBucketTool.vue'

class PaintBucketTool extends Tool {
  constructor(component: Component, controls: Control[] = []) {
    super('油漆桶工具', component, controls)
  }

  mouseover(e: MouseEvent) {
    console.log('mouseover')
  }

  mousedown(e: MouseEvent) {
    console.log('mousedown')
  }

  mousemove(e: MouseEvent) {
    console.log('mousemove')
  }

  mouseup(e: MouseEvent) {
    console.log('mouseup')
  }

  mouseout(e: MouseEvent) {
    console.log('mouseout')
  }

  mousePreview(e: MouseEvent) {
    console.log('mousePreview')
  }
}

export default new PaintBucketTool(ThePaintBucketTool)
