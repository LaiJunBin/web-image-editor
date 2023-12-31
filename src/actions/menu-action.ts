import {
  newProject,
  openProject,
  redo,
  saveImage,
  saveProject,
  undo,
  openImage,
  grayscale,
  invert,
  blur,
  oilPainting,
  blackAndWhite
} from '@/utils/menu-action'
import { MenuAction as MenuActionConst } from '../const/menu-action'

export class MenuAction<T extends string | number | symbol> {
  private actions: { [key in T]?: () => void } = {}

  public register(action: T, callback: () => void) {
    this.actions[action] = callback
  }

  public dispatch(action: T) {
    const callback = this.actions[action]
    if (callback) {
      callback()
    }
  }
}

export const createMenuAction = () => {
  const menuAction = new MenuAction()
  menuAction.register(MenuActionConst.NEW_PROJECT, newProject)
  menuAction.register(MenuActionConst.OPEN_PROJECT, openProject)
  menuAction.register(MenuActionConst.OPEN_IMAGE, openImage)
  menuAction.register(MenuActionConst.SAVE_PROJECT, saveProject)
  menuAction.register(MenuActionConst.SAVE_IMAGE, saveImage)
  menuAction.register(MenuActionConst.UNDO, undo)
  menuAction.register(MenuActionConst.REDO, redo)

  menuAction.register(MenuActionConst.GRAYSCALE, grayscale)
  menuAction.register(MenuActionConst.INVERT, invert)
  menuAction.register(MenuActionConst.BLUR, blur)
  menuAction.register(MenuActionConst.OIL_PAINTING, oilPainting)
  menuAction.register(MenuActionConst.BLACK_AND_WHITE, blackAndWhite)

  return menuAction
}
