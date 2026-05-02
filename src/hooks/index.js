// ============================================================
// 自訂 Hooks
// ============================================================
import { useState, useEffect } from 'react';
import { SITE_CONFIG } from '../data/siteConfig';

/**
 * 管理深色 / 淺色主題，並同步到 <html> classList
 */
export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}

/**
 * 大頭照 URL — 固定從 siteConfig 讀取，不支援外部覆寫。
 * 要更換大頭照請直接修改 src/data/siteConfig.js 的 avatarUrl。
 */
export function useAvatarUrl() {
  const avatarUrl = SITE_CONFIG.avatarUrl;
  // 回傳相同介面，但 setAvatarUrl 為 no-op，防止外部意外寫入
  const setAvatarUrl = () => {};
  return { avatarUrl, setAvatarUrl };
}

/**
 * 管理全域搜尋狀態
 * 比對範圍：標題、摘要、分類、標籤、章節標題、章節內文（不分大小寫）
 */
export function useSearch(novels) {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? novels.filter(n => {
        const q = query.trim().toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.tags.some(t => t.toLowerCase().includes(q)) ||
          n.chapters?.some(
            c =>
              c.title.toLowerCase().includes(q) ||
              c.content.toLowerCase().includes(q)
          )
        );
      })
    : novels;

  return { query, setQuery, results };
}