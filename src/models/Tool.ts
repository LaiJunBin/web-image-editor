import { toRaw, type Component, toRefs, markRaw } from 'vue'
import type { Control } from './Control'
import LayerControl from './controls/LayerControl'
import { toolStoreFactory } from '@/stores/tool'

export type ToolOptions = {
  ctx: CanvasRenderingContext2D
  color: string
  lineWidth: number
}

export abstract class Tool<T> {
  public name: string
  public component: Component
  public controls: Control[]

  constructor(name: string, component: Component, controls: Control[] = []) {
    this.name = name
    this.component = markRaw(component)
    this.controls = [...controls, LayerControl]
  }

  get isActive(): boolean {
    const useToolStore = toolStoreFactory<T>()
    const { tool } = toRefs(useToolStore())
    return toRaw(tool.value) === toRaw(this)
  }

  abstract mouseover(e: MouseEvent, options: T): void
  abstract mousedown(e: MouseEvent, options: T): void
  abstract mousemove(e: MouseEvent, options: T): void
  abstract mouseup(e: MouseEvent, options: T): void
  abstract mouseout(e: MouseEvent, options: T): void

  abstract mousePreview(e: MouseEvent, options: T): void
}
