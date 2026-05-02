// ============================================================
// RightSidebar — 搜尋、紀錄、分類、標籤雲（全部可互動）
// ============================================================
import React from 'react';
import { Archive, BookOpen, Tag, Search } from './icons';
import { NOVELS } from '../data/novels';

export default function RightSidebar({ onSearch, onFilterTag, onFilterCategory, onNavClick }) {
  const categories = Array.from(new Set(NOVELS.map(n => n.category)));
  const tags       = Array.from(new Set(NOVELS.flatMap(n => n.tags)));
  const years      = Array.from(new Set(NOVELS.map(n => n.date.slice(0, 4))));

  return (
    <aside className="hidden xl:flex w-[320px] flex-col gap-10 py-10 px-6 sticky top-0 h-screen overflow-y-auto custom-scrollbar">

      {/* ── 搜尋 Widget ── */}
      <div className="relative">
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#a9a9b3]">
          <Search className="w-[18px] h-[18px]" strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="搜尋文章…"
          onChange={e => onSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { onNavClick('search'); } }}
          className="w-full bg-[#ebebeb] dark:bg-[#252627] text-[#333] dark:text-white rounded-xl py-3.5 px-5 pr-12 focus:outline-none placeholder-[#888] text-[15px] transition-colors"
        />
      </div>

      {/* ── 紀錄 Widget ── */}
      <div>
        <h3 className="flex items-center text-[#333] dark:text-white font-medium mb-4 text-[17px]">
          <Archive className="w-[22px] h-[22px] mr-3 opacity-70" strokeWidth={2} />
          紀錄
        </h3>
        <div className="flex flex-col gap-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => onNavClick('archive')}
              title={`查看 ${year} 年的所有文章`}
              className="bg-[#ebebeb] dark:bg-[#252627] rounded-xl flex justify-between items-center px-5 py-3.5 text-[15px] text-[#666] dark:text-[#a9a9b3] hover:bg-[#e0e0e0] dark:hover:bg-[#323232] cursor-pointer transition-colors"
            >
              <span>{year}</span>
              <span className="text-[#a9a9b3] dark:text-[#888]">
                {NOVELS.filter(n => n.date.startsWith(year)).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 分類 Widget ── */}
      <div>
        <h3 className="flex items-center text-[#333] dark:text-white font-medium mb-4 text-[17px]">
          <BookOpen className="w-[22px] h-[22px] mr-3 opacity-70" strokeWidth={2} />
          分類
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onFilterCategory(cat)}
              title={`篩選分類：${cat}`}
              className="bg-[#ebebeb] dark:bg-[#252627] rounded-xl px-5 py-2.5 text-[14px] text-[#666] dark:text-[#a9a9b3] hover:bg-[#5bb98c] hover:text-white dark:hover:bg-[#5bb98c] dark:hover:text-white cursor-pointer transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 標籤雲 Widget ── */}
      <div>
        <h3 className="flex items-center text-[#333] dark:text-white font-medium mb-4 text-[17px]">
          <Tag className="w-[22px] h-[22px] mr-3 opacity-70" strokeWidth={2} />
          標籤雲
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => onFilterTag(tag)}
              title={`篩選標籤：#${tag}`}
              className="bg-[#ebebeb] dark:bg-[#252627] rounded-xl px-4 py-2 text-[14px] text-[#666] dark:text-[#a9a9b3] hover:bg-[#5bb98c] hover:text-white dark:hover:bg-[#5bb98c] dark:hover:text-white cursor-pointer transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
