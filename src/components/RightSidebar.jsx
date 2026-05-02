// ============================================================
// RightSidebar — 搜尋、紀錄、分類、標籤雲（全部可互動）
// ============================================================
import React, { useState, useMemo } from 'react';
import { Archive, BookOpen, Tag, Search } from './icons';
import { NOVELS } from '../data/novels';

export default function RightSidebar({ onSearch, onFilterTag, onFilterCategory, onNavClick, onSelectNovel }) {
  const categories = Array.from(new Set(NOVELS.map(n => n.category)));
  const tags       = Array.from(new Set(NOVELS.flatMap(n => n.tags)));
  const years      = Array.from(new Set(NOVELS.map(n => n.date.slice(0, 4))));

  const [searchQuery, setSearchQuery] = useState('');

  // 搜尋邏輯：比對 title、summary、tags、category、章節內容
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return NOVELS.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q)) ||
      n.chapters?.some(c =>
        c.title.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

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
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); onSearch(e.target.value); }}
          className="w-full bg-[#ebebeb] dark:bg-[#252627] text-[#333] dark:text-white rounded-xl py-3.5 px-5 pr-12 focus:outline-none placeholder-[#888] text-[15px] transition-colors"
        />

        {/* 即時搜尋結果下拉 */}
        {searchQuery.trim() && (
          <div className="mt-2 bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#e0e0e0] dark:border-[#323232] overflow-hidden shadow-lg">
            {searchResults.length === 0 ? (
              <p className="px-5 py-4 text-[14px] text-[#aaa]">找不到相符的內容</p>
            ) : (
              searchResults.map(novel => (
                <button
                  key={novel.id}
                  onClick={() => { onSelectNovel(novel); setSearchQuery(''); onSearch(''); }}
                  className="w-full text-left px-5 py-3.5 hover:bg-[#f8f9fa] dark:hover:bg-[#252627] transition-colors border-b border-[#f0f0f0] dark:border-[#2a2a2a] last:border-0"
                >
                  <p className="text-[15px] font-medium text-[#333] dark:text-white truncate">{novel.title}</p>
                  <p className="text-[13px] text-[#aaa] mt-0.5 truncate">{novel.summary}</p>
                </button>
              ))
            )}
          </div>
        )}
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