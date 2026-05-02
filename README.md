# Hugo 主題 Stack — React 版

> Vite + React + TailwindCSS v4，Stack 風格博客 UI

---

## 目錄結構

```
src/
├── data/
│   ├── siteConfig.js   # ★ 所有可自訂設定（站名、頭像、社群連結…）
│   └── novels.js       # 小說 / 文章資料
├── hooks/
│   └── index.js        # useTheme · useAvatarUrl · useSearch
├── components/
│   ├── icons.jsx        # 所有 icon 集中匯出
│   ├── AvatarEditor.jsx # 大頭照點擊換圖元件
│   ├── LeftSidebar.jsx  # 左側欄（導覽 + 主題切換）
│   ├── RightSidebar.jsx # 右側欄（搜尋 + 分類 + 標籤雲）
│   ├── ArticleCard.jsx  # 文章卡片
│   ├── NovelViews.jsx   # NovelDetail + ReaderView
│   └── MobileHeader.jsx # 行動裝置頂部列
├── App.jsx              # 頂層協調器（狀態 + 路由邏輯）
├── main.jsx
└── index.css
```

---

## 快速開始

```bash
npm install
npm run dev
```

---

## 功能說明

### ✦ 大頭照即時更換（URL 參數）

有三種方式更換大頭照：

| 方式 | 說明 |
|------|------|
| **點擊頭像** | 彈出編輯視窗，貼上圖片 URL → 套用 |
| **URL 參數** | 在網址列加 `?avatar=https://your-image-url`，重新整理後仍保留 |
| **修改 siteConfig** | 在 `src/data/siteConfig.js` 修改 `avatarUrl` 欄位（永久預設） |

### ✦ 標籤 & 分類篩選

- 點擊文章卡片上的 `#標籤` → 篩選同標籤文章
- 點擊右側欄「分類」或「標籤雲」→ 同效果
- 顯示區域頂部會出現篩選提示列，點「清除篩選」恢復

### ✦ 搜尋

- 右側欄輸入框即時搜尋（標題 / 摘要 / 標籤 / 分類）
- 按 Enter 跳至搜尋頁

### ✦ 閱讀器字體大小

閱讀章節時，右上角 `A` / `A` 按鈕可調整字體大小（14px–26px）

### ✦ 深色 / 淺色主題

左側欄底部「夜晚模式 / 白天模式」切換

---

## 新增文章

在 `src/data/novels.js` 陣列中新增一個物件：

```js
{
  id: 4,
  title: '我的新文章',
  author: '作者名',
  date: '2026年5月10日',
  category: '分類名稱',
  summary: '摘要文字',
  readTime: '閱讀時間: 5 分鐘',
  cover: 'https://your-cover-image.jpg',  // 可留空 ''
  languages: ['繁體中文'],
  tags: ['標籤A', '標籤B'],
  chapters: [
    { id: 401, title: '第一章', content: '章節內容…' }
  ],
},
```

---

## 修改站點設定

編輯 `src/data/siteConfig.js`：

```js
export const SITE_CONFIG = {
  title: '你的站名',
  subtitle: '站點描述',
  avatarUrl: 'https://your-default-avatar.jpg',
  social: {
    github: 'https://github.com/yourname',
    twitter: 'https://x.com/yourname',
  },
  // ...
};
```

---

## 部署到 GitHub Pages

```bash
npm run build
# 將 dist/ 目錄推送到 gh-pages 分支
```

或在 `vite.config.js` 加上 `base: '/repo-name/'`。
