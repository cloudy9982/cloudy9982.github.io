// ============================================================
// TravelPage — 旅遊專欄列表頁
// ============================================================
import React from 'react';
import { MapPin, Calendar, ExternalLink, Tag } from './icons';
import { TRAVELS } from '../data/travels';

export default function TravelPage({ onOpenJournal }) {
  return (
    <div className="animate-fade-in pb-10">

      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#333] dark:text-white flex items-center gap-3">
          <MapPin className="w-7 h-7 text-[#5bb98c]" />
          旅遊專欄
        </h1>
        <p className="text-[#888] mt-2 text-[15px]">記錄每一段值得回憶的旅程</p>
      </div>

      {/* 旅遊卡片列表 */}
      <div className="grid gap-6">
        {TRAVELS.map((travel) => {
          const isInternal = travel.type === 'internal';
          return (
            <article
              key={travel.id}
              className="bg-white dark:bg-[#252627] rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none"
            >
              {/* 封面圖片 */}
              {travel.cover && (
                <div className="h-[200px] overflow-hidden">
                  <img
                    src={travel.cover}
                    alt={travel.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
                {/* 地點 badge */}
                <span className="inline-flex items-center gap-1.5 bg-[#5bb98c] text-white text-[13px] px-3 py-1.5 rounded-lg mb-4">
                  <MapPin className="w-3.5 h-3.5" />
                  {travel.location}
                </span>

                {/* 標題 */}
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-2">
                  {travel.title}
                </h2>

                {/* 日期 */}
                <p className="text-[#888] text-[14px] flex items-center gap-1.5 mb-4">
                  <Calendar className="w-4 h-4" />
                  {travel.date}
                </p>

                {/* 摘要 */}
                <div className="text-[#666] dark:text-[#a9a9b3] leading-[1.8] text-[16px] mb-6 bg-[#f8f9fa] dark:bg-[#323232] p-5 rounded-xl border-l-4 border-[#5bb98c]">
                  {travel.summary}
                </div>

                {/* 標籤 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {travel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-[13px] text-[#888] bg-[#f8f9fa] dark:bg-[#323232] px-3 py-1 rounded-lg"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 按鈕：內部遊記 or 外部連結 */}
                {isInternal ? (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => onOpenJournal && onOpenJournal(travel.component)}
                      className="inline-flex items-center gap-2 bg-[#5bb98c] text-white px-5 py-2.5 rounded-xl hover:bg-[#4ea27a] transition-colors text-[15px] font-medium"
                    >
                      電腦版
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onOpenJournal && onOpenJournal(travel.component)}
                      className="inline-flex items-center gap-2 bg-[#5bb98c] text-white px-5 py-2.5 rounded-xl hover:bg-[#4ea27a] transition-colors text-[15px] font-medium"
                    >
                      手機版
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="6" y="2" width="12" height="20" rx="2" />
                        <line x1="12" y1="18" x2="12" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <a
                    href={travel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#5bb98c] text-white px-5 py-2.5 rounded-xl hover:bg-[#4ea27a] transition-colors text-[15px] font-medium"
                  >
                    前往查看
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
