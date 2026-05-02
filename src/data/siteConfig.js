// ============================================================
// 站點設定 — 所有可自訂的設定值集中在此
// 大頭照請直接修改下方 avatarUrl，不支援從外部覆寫
// ============================================================

export const SITE_CONFIG = {
  title: 'Cloudy咲雲',
  subtitle: '走一步算一步，寫小說也一樣',

  /** 大頭照 URL — 只能在此修改 */
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
    { id: 'links',   labelKey: '鏈接',  icon: 'Link'     },
  ],
};