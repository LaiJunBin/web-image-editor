import { markRaw, type Component } from 'vue'

export class Control {
  public component: Component
  public hidden: boolean

  constructor(component: Component) {
    this.component = markRaw(component)
    this.hidden = false
  }
}
