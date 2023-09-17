import { defineStore } from 'pinia'
import { ref } from 'vue'

class Area {
  private _x: number
  private _y: number
  private _width: number
  private _height: number

  constructor(x: number, y: number, width: number, height: number) {
    this._x = x
    this._y = y
    this._width = width
    this._height = height
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  set x(x: number) {
    this._x = x
  }

  set y(y: number) {
    this._y = y
  }

  set width(width: number) {
    this._width = width
  }

  set height(height: number) {
    this._height = height
  }
}

export const useSelectionStore = defineStore('selection', () => {
  const selection = ref<Area | null>(null)
  const setSelection = (x: number, y: number, width: number, height: number) => {
    selection.value = new Area(
      Math.min(x, x + width),
      Math.min(y, y + height),
      Math.abs(width),
      Math.abs(height)
    )
  }
  const clearSelection = () => {
    selection.value = null
  }

  return {
    selection,
    setSelection,
    clearSelection
  }
})
