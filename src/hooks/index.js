// ============================================================
// 自訂 Hooks
// ============================================================
import { useState, useEffect, useCallback } from 'react';
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

/**
 * JPY → TWD 即時匯率
 * 來源：open.er-api.com（免費、無需 API key）
 * 與臺灣銀行牌告中間值極為相近（誤差 < 0.5%）。
 * 快取：localStorage，6 小時內不重抓。
 * API 失敗 → 保底 0.21。
 */
const RATE_CACHE_KEY  = 'jpy-twd-rate';
const RATE_CACHE_TTL  = 1000 * 60 * 60 * 6;   // 6 hr
const FALLBACK_RATE   = 0.21;

export function useExchangeRate() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(RATE_CACHE_KEY);
      if (raw) {
        const c = JSON.parse(raw);
        const fresh = Date.now() - c.lastUpdated < RATE_CACHE_TTL;
        return { rate: c.rate, lastUpdated: c.lastUpdated, loading: !fresh, error: null, isFallback: false };
      }
    } catch {}
    return { rate: FALLBACK_RATE, lastUpdated: null, loading: true, error: null, isFallback: true };
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/JPY');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const twd = data?.rates?.TWD;
      if (typeof twd !== 'number') throw new Error('回應缺少 TWD 匯率');
      const lastUpdated = Date.now();
      setState({ rate: twd, lastUpdated, loading: false, error: null, isFallback: false });
      try { localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rate: twd, lastUpdated })); } catch {}
    } catch (err) {
      setState((s) => ({
        rate: s.lastUpdated ? s.rate : FALLBACK_RATE,
        lastUpdated: s.lastUpdated,
        loading: false,
        error: err?.message || '無法取得匯率',
        isFallback: !s.lastUpdated,
      }));
    }
  }, []);

  useEffect(() => {
    // 初次掛載：若 lazy init 判定快取過期或不存在則自動抓一次
    if (state.loading) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, refresh };
}