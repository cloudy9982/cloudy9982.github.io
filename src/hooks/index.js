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
 * 從 URL search params 讀取 ?avatar=<url>，
 * 若無則使用 siteConfig 的預設值。
 * 同時提供 setAvatarUrl 讓使用者在運行時手動覆寫。
 */
export function useAvatarUrl() {
  const getInitialUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('avatar') || SITE_CONFIG.avatarUrl;
  };

  const [avatarUrl, setAvatarUrl] = useState(getInitialUrl);

  // 監聽 popstate（瀏覽器上/下一頁）
  useEffect(() => {
    const handler = () => {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get('avatar');
      if (fromUrl) setAvatarUrl(fromUrl);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return { avatarUrl, setAvatarUrl };
}

/**
 * 管理全域搜尋狀態
 */
export function useSearch(novels) {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? novels.filter(
        n =>
          n.title.includes(query) ||
          n.summary.includes(query) ||
          n.tags.some(t => t.includes(query)) ||
          n.category.includes(query)
      )
    : novels;

  return { query, setQuery, results };
}
