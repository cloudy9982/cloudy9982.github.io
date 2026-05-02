// ============================================================
// 站點設定 — 所有可自訂的設定值集中在此
// 大頭照 URL 可透過網址參數 ?avatar=<URL> 在瀏覽器中臨時覆寫
// 例：http://localhost:5173/?avatar=https://example.com/photo.jpg
// ============================================================

export const SITE_CONFIG = {
  title: 'Hugo 主題 Stack',
  subtitle: '為博客設計的卡片式 Hugo 主題',

  /** 預設大頭照 URL（可在瀏覽器網址列加 ?avatar=URL 覆寫） */
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',

  /** 大頭照右下角的 badge 表情 */
  avatarBadge: '✒️',

  /** 主題色（Tailwind arbitrary value 格式） */
  accentColor: '#5bb98c',

  social: {
    github: 'https://github.com/cloudy9982',
    twitter: 'https://x.com/n54288c9982',
  },

  nav: [
    { id: 'home',    labelKey: '主頁',  icon: 'Home'     },
    { id: 'about',   labelKey: '關於',  icon: 'User'     },
    { id: 'novels',  labelKey: '小說',  icon: 'BookOpen' },
    { id: 'archive', labelKey: '歸檔',  icon: 'Archive'  },
    { id: 'search',  labelKey: '搜索',  icon: 'Search'   },
    { id: 'links',   labelKey: '鏈接',  icon: 'Link'     },
  ],
};
