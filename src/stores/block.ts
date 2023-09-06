import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LayerObject } from '@/models/LayerObject'

class Block {
  private _x: number
  private _y: number
  private _width: number
  private _height: number
  private _angle: number
  object: LayerObject

  constructor(object: LayerObject) {
    const { x, y, width, height, angle } = object

    this._x = x
    this._y = y
    this._width = width
    this._height = height
    this._angle = angle
    this.object = object
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

  get angle() {
    return this._angle
  }

  set x(x: number) {
    this._x = x
    this.object.x = x
  }

  set y(y: number) {
    this._y = y
    this.object.y = y
  }

  set width(width: number) {
    this._width = width
    this.object.width = width
  }

  set height(height: number) {
    this._height = height
    this.object.height = height
  }

  set angle(angle: number) {
    this._angle = angle
    this.object.angle = angle
  }
}

export const useBlockStore = defineStore('block', () => {
  const block = ref<Block | null>()
  const tempBlock = ref<Block | null>()

  const setBlock = (object: LayerObject | null) => {
    if (!object) {
      block.value?.object.update()
      block.value = null
      return
    }

    block.value = new Block(object)
  }

  const setTempBlock = (object: LayerObject | null) => {
    if (!object) {
      tempBlock.value = null
      return
    }

    tempBlock.value = new Block(object)
  }

  return { block, setBlock, tempBlock, setTempBlock }
})
