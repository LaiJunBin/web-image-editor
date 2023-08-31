import { markRaw, type Component } from 'vue'

export class Control {
  public component: Component

  constructor(component: Component) {
    this.component = markRaw(component)
  }
}
