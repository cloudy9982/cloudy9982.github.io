// ============================================================
// LeftSidebar — 站點資訊、頭像、導覽選單、主題切換
// ============================================================
import React from 'react';
import {
  Home, User, Archive, Search, LinkIcon,
  BookOpen, Moon, Sun, MapPin,
  GithubIcon, TwitterIcon,
} from './icons';
import AvatarEditor from './AvatarEditor';
import { SITE_CONFIG } from '../data/siteConfig';

const NAV_ICON_MAP = { Home, User, BookOpen, Archive, Search, Link: LinkIcon, MapPin };

export default function LeftSidebar({
  activeTab,
  onNavClick,
  theme,
  onToggleTheme,
  isMobileMenuOpen,
  avatarUrl,
  setAvatarUrl,
}) {
  return (
    <aside
      className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen w-[280px]
        bg-[#f8f9fa] dark:bg-[#1a1a1a]
        transform transition-transform duration-300 lg:translate-x-0
        flex flex-col py-10 px-8
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* ── 站點 & 使用者資訊 ── */}
      <div className="flex flex-col items-center mb-10">
        <AvatarEditor avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />

        {/* 站名（可點擊回到主頁） */}
        <button
          onClick={() => onNavClick('home')}
          className="text-[22px] font-bold text-[#333] dark:text-white mb-2 tracking-wide hover:text-[#5bb98c] transition-colors"
          title="回到主頁"
        >
          {SITE_CONFIG.title}
        </button>

        <p className="text-[15px] text-[#888] dark:text-[#a9a9b3] text-center mb-5 leading-relaxed">
          {SITE_CONFIG.subtitle}
        </p>

        {/* 社群連結 */}
        <div className="flex gap-5 text-[#a9a9b3] dark:text-[#888]">
          {SITE_CONFIG.social.github && (
            <a
              href={SITE_CONFIG.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="前往 GitHub"
            >
              <GithubIcon className="w-[22px] h-[22px] hover:text-[#333] dark:hover:text-white cursor-pointer transition-colors" />
            </a>
          )}
          {SITE_CONFIG.social.twitter && (
            <a
              href={SITE_CONFIG.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              title="前往 Twitter / X"
            >
              <TwitterIcon className="w-[22px] h-[22px] hover:text-[#333] dark:hover:text-white cursor-pointer transition-colors" />
            </a>
          )}
        </div>
      </div>

      {/* ── 導覽選單 ── */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {SITE_CONFIG.nav.map((item) => {
          const Icon = NAV_ICON_MAP[item.icon] || Home;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              title={item.labelKey}
              className={`
                flex items-center px-4 py-3 rounded-xl transition-colors text-[16px]
                ${isActive
                  ? 'bg-[#ebebeb] dark:bg-[#323232] text-[#333] dark:text-white font-medium'
                  : 'text-[#666] dark:text-[#a9a9b3] hover:bg-[#ebebeb] dark:hover:bg-[#323232]'}
              `}
            >
              <Icon className="w-[20px] h-[20px] mr-4 opacity-80" strokeWidth={2} />
              {item.labelKey}
            </button>
          );
        })}
      </nav>

      {/* ── 底部功能區 ── */}
      <div className="mt-auto flex flex-col gap-1.5 pt-6">
        {/* 語言切換（功能預留，可擴充） */}
        <button
          className="flex items-center px-4 py-3 text-[15px] text-[#666] dark:text-[#a9a9b3] hover:bg-[#ebebeb] dark:hover:bg-[#323232] rounded-xl transition-colors"
          title="語言"
        >
          <span className="w-[20px] h-[20px] mr-4 flex items-center justify-center font-serif italic text-lg opacity-80">
            A<span className="text-xs">A</span>
          </span>
          正體中文
        </button>

        {/* 主題切換 */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? '切換至白天模式' : '切換至夜晚模式'}
          className="flex items-center px-4 py-3 text-[15px] text-[#666] dark:text-[#a9a9b3] hover:bg-[#ebebeb] dark:hover:bg-[#323232] rounded-xl transition-colors"
        >
          {theme === 'dark'
            ? <Sun  className="w-[20px] h-[20px] mr-4 opacity-80" strokeWidth={2} />
            : <Moon className="w-[20px] h-[20px] mr-4 opacity-80" strokeWidth={2} />
          }
          {theme === 'dark' ? '白天模式' : '夜晚模式'}
        </button>
      </div>
    </aside>
  );
}
