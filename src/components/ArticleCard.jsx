// ============================================================
// ArticleCard — 文章 / 小說 列表卡片
// ============================================================
import React from 'react';
import { Calendar, Clock, Languages, Tag } from './icons';

export default function ArticleCard({ item, onClick, onFilterTag }) {
  return (
    <article
      className="bg-white dark:bg-[#252627] rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none mb-8 cursor-pointer transform transition-transform hover:-translate-y-1 duration-300"
    >
      {/* 封面圖 */}
      {item.cover && (
        <div className="w-full h-[300px] overflow-hidden" onClick={onClick}>
          <img
            src={item.cover}
            alt={item.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      )}

      <div className="p-8">
        {/* 分類標籤 */}
        <span
          onClick={onClick}
          className="inline-block bg-[#5bb98c] text-white text-[13px] px-3 py-1.5 rounded-lg mb-4 cursor-pointer"
        >
          {item.category}
        </span>

        {/* 標題 */}
        <h2
          onClick={onClick}
          className="text-[26px] font-bold text-[#333] dark:text-white mb-4 hover:text-[#5bb98c] dark:hover:text-[#5bb98c] transition-colors leading-tight"
        >
          {item.title}
        </h2>

        {/* 摘要 */}
        <p
          onClick={onClick}
          className="text-[#666] dark:text-[#a9a9b3] leading-[1.8] mb-6 text-[16px]"
        >
          {item.summary}
        </p>

        {/* 標籤列 */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map(tag => (
              <button
                key={tag}
                onClick={e => { e.stopPropagation(); onFilterTag?.(tag); }}
                title={`篩選標籤：#${tag}`}
                className="flex items-center gap-1 text-[13px] text-[#888] dark:text-[#666] hover:text-[#5bb98c] transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Meta 資訊列 */}
        <div
          onClick={onClick}
          className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[14px] text-[#888] dark:text-[#888]"
        >
          <div className="flex items-center">
            <Calendar className="w-[18px] h-[18px] mr-2 opacity-80" />
            {item.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-[18px] h-[18px] mr-2 opacity-80" />
            {item.readTime}
          </div>
          {item.languages?.length > 0 && (
            <div className="flex items-center gap-3">
              <Languages className="w-[18px] h-[18px] mr-1 opacity-80" />
              {item.languages.map(lang => (
                <span key={lang} className="hover:text-[#333] dark:hover:text-white cursor-pointer transition-colors">
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
