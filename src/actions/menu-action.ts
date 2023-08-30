import {
  newProject,
  openProject,
  redo,
  saveImage,
  saveProject,
  undo,
  uploadImage
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
  menuAction.register(MenuActionConst.UPLOAD_IMAGE, uploadImage)
  menuAction.register(MenuActionConst.SAVE_PROJECT, saveProject)
  menuAction.register(MenuActionConst.SAVE_IMAGE, saveImage)
  menuAction.register(MenuActionConst.UNDO, undo)
  menuAction.register(MenuActionConst.REDO, redo)
  return menuAction
}
