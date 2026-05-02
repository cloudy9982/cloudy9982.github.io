// ============================================================
// MobileHeader — 行動裝置頂部標題列
// ============================================================
import React from 'react';
import { Menu, X } from './icons';
import { SITE_CONFIG } from '../data/siteConfig';

export default function MobileHeader({ isMobileMenuOpen, onToggle, onTitleClick }) {
  return (
    <div className="lg:hidden fixed top-0 w-full h-16 bg-white dark:bg-[#252627] shadow-sm dark:shadow-none border-b border-transparent dark:border-[#323232] z-50 flex items-center justify-between px-5">
      <button
        onClick={onTitleClick}
        className="font-bold text-[18px] text-[#333] dark:text-white hover:text-[#5bb98c] transition-colors"
        title="回到主頁"
      >
        {SITE_CONFIG.title}
      </button>
      <button
        onClick={onToggle}
        className="p-2 text-[#666] dark:text-[#a9a9b3]"
        aria-label={isMobileMenuOpen ? '關閉選單' : '開啟選單'}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
}
