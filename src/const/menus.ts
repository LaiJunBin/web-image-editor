import { MenuAction } from './menu-action'

export interface MenuType<T> {
  text: string
  children: {
    text: string
    action: T
  }[]
}

export const menus: MenuType<MenuAction>[] = [
  {
    text: '檔案',
    children: [
      {
        text: '新增專案',
        action: MenuAction.NEW_PROJECT
      },
      {
        text: '開啟專案',
        action: MenuAction.OPEN_PROJECT
      },
      {
        text: '儲存專案',
        action: MenuAction.SAVE_PROJECT
      },
      {
        text: '上傳圖片',
        action: MenuAction.UPLOAD_IMAGE
      },
      {
        text: '儲存圖片',
        action: MenuAction.SAVE_IMAGE
      }
    ]
  },
  {
    text: '編輯',
    children: [
      {
        text: '復原',
        action: MenuAction.UNDO
      },
      {
        text: '重做',
        action: MenuAction.REDO
      }
    ]
  }
]
