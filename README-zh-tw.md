# web-image-editor

這是一個使用 Vue3 實作的網頁圖片編輯器。[Demo](https://laijunbin.github.io/web-image-editor/)

[English](https://github.com/LaiJunBin/web-image-editor/tree/main#web-image-editor)｜繁體中文

---

## 快照

![snapshot](./docs/images/snapshot.png)

---

## 功能

- [x] 導覽列
  - [x] 新建專案: 建立新專案
  - [x] 開啟專案: 從本地開啟專案
  - [x] 儲存專案: 儲存專案到本地
  - [x] 開啟圖片: 從本地開啟圖片
  - [x] 儲存圖片: 儲存圖片到本地
  - [x] 復原(ctrl+z)與重做(ctrl+y): 復原與重做動作
- [x] 工具
  - [x] 筆刷工具: 在畫布上繪製
    - [x] 筆刷大小: 變更筆刷大小
    - [x] 筆刷顏色: 變更筆刷顏色
  - [x] 油漆桶: 在畫布上填滿顏色
    - [x] 油漆桶顏色: 變更油漆桶顏色
  - [x] 圖章: 在畫布上蓋章
    - [x] 圖章大小: 變更圖章大小
    - [x] 圖章圖片: 上傳圖章圖片並選擇
  - [x] 選取工具: 選取畫布上的區域，然後你可以 ctrl+j 複製並貼上到新圖層
  - [x] 游標工具: 選取畫布上的物件，然後你可以移動、縮放和旋轉它
- [x] 濾鏡
  - [x] 灰階: 將選取區域轉換成灰階
  - [x] 負片: 將選取區域轉換成負片
  - [x] 模糊: 將選取區域變模糊
  - [x] 油畫: 套用油畫濾鏡到選取區域
  - [x] 黑白: 將選取區域轉換成黑白
- [x] 圖層
  - [x] 新增圖層: 新增新圖層
  - [x] 刪除圖層: 刪除圖層
  - [x] 圖層排序: 透過拖曳圖層來變更圖層順序
- [x] 其他
  - [x] 縮放: 按住 alt 滾動滑鼠滾輪來縮放畫布
  - [x] 拖曳: 按住空白鍵+滑鼠左鍵來拖曳畫布

---

## 備註

- 如果你將物件整個拖曳到畫布外，它將會被刪除。你可以使用復原(ctrl+z)來復原它。
- 沒有實作橡皮擦工具，但你可以使用背景色的筆刷工具來擦除物件。
- 操作可能會導致圖片失真。
