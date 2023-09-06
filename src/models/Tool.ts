import { toRaw, type Component, toRefs, markRaw } from 'vue'
import type { Control } from './Control'
import LayerControl from './controls/LayerControl'
import { useToolStore } from '@/stores/tool'

export abstract class Tool {
  public name: string
  public component: Component
  public controls: Control[]
  public autoCommit: boolean = true

  constructor(name: string, component: Component, controls: Control[] = []) {
    this.name = name
    this.component = markRaw(component)
    this.controls = [...controls, LayerControl]
  }

  get isActive(): boolean {
    const { tool } = toRefs(useToolStore())
    return toRaw(tool.value) === toRaw(this)
  }

  abstract mouseover(e: MouseEvent): void
  abstract mousedown(e: MouseEvent): void
  abstract mousemove(e: MouseEvent): void
  abstract mouseup(e: MouseEvent): void
  abstract mouseout(e: MouseEvent): void

  abstract mousePreview(e: MouseEvent): void
}
