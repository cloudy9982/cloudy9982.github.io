// ============================================================
// NovelDetail — 章節目錄視圖
// ReaderView  — 閱讀器視圖（字體大小 + 上下章切換）
// ============================================================
import React from 'react';
import { ChevronLeft, ChevronRight, User, List, Type } from './icons';

// ── 章節目錄 ────────────────────────────────────────────────
export function NovelDetail({ novel, onBack, onChapterSelect }) {
  return (
    <div className="animate-fade-in pb-10">
      <button
        onClick={onBack}
        className="flex items-center text-[#888] hover:text-[#5bb98c] mb-6 transition-colors font-medium"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> 返回列表
      </button>

      <div className="bg-white dark:bg-[#252627] rounded-2xl p-8 mb-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none">
        <span className="inline-block bg-[#5bb98c] text-white text-[13px] px-3 py-1.5 rounded-lg mb-4">
          {novel.category}
        </span>
        <h1 className="text-[32px] font-bold text-[#333] dark:text-white mb-3">{novel.title}</h1>
        <p className="text-[#888] mb-6 flex items-center gap-2">
          <User className="w-4 h-4" /> {novel.author}
        </p>
        <div className="text-[#666] dark:text-[#a9a9b3] leading-[1.8] text-[16px] mb-8 bg-[#f8f9fa] dark:bg-[#323232] p-5 rounded-xl border-l-4 border-[#5bb98c]">
          {novel.summary}
        </div>

        {/* 章節目錄 */}
        <div>
          <h3 className="text-[20px] font-bold text-[#333] dark:text-white mb-5 flex items-center">
            <List className="w-5 h-5 mr-2 text-[#5bb98c]" /> 章節目錄
          </h3>
          <div className="grid gap-3">
            {novel.chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => onChapterSelect(chapter, index)}
                title={chapter.title}
                className="text-left px-5 py-4 rounded-xl bg-[#f8f9fa] dark:bg-[#1a1a1a] hover:bg-[#ebebeb] dark:hover:bg-[#323232] text-[#333] dark:text-[#a9a9b3] dark:hover:text-white transition-colors flex justify-between items-center border border-transparent dark:border-[#333]"
              >
                <span className="text-[16px] font-medium">{chapter.title}</span>
                <ChevronRight className="w-5 h-5 text-[#888]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 閱讀器 ──────────────────────────────────────────────────
export function ReaderView({ novel, chapter, onBack, onChapterChange }) {
  const [fontSize, setFontSize] = React.useState(16);
  const currentIndex = chapter.index;
  const hasNext = currentIndex < novel.chapters.length - 1;
  const hasPrev = currentIndex > 0;

  const changeChapter = (dir) => {
    const newIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;
    onChapterChange({ ...novel.chapters[newIndex], index: newIndex });
    window.scrollTo(0, 0);
  };

  return (
    <div className="animate-fade-in bg-white dark:bg-[#252627] rounded-2xl p-8 md:p-14 min-h-[80vh] shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none mb-10">

      {/* 頂部導覽列 */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#ebebeb] dark:border-[#323232]">
        <button
          onClick={onBack}
          title="返回目錄"
          className="text-[#888] hover:text-[#5bb98c] flex items-center transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> 目錄
        </button>

        {/* 字體大小調整 */}
        <div className="flex items-center gap-4 text-[#888]" title="調整字體大小">
          <button
            onClick={() => setFontSize(f => Math.max(14, f - 2))}
            title="縮小字體"
            className="hover:text-[#333] dark:hover:text-white transition-colors"
          >
            <Type className="w-[18px] h-[18px]" />
          </button>
          <span className="w-6 text-center text-[15px] select-none">{fontSize}</span>
          <button
            onClick={() => setFontSize(f => Math.min(26, f + 2))}
            title="放大字體"
            className="hover:text-[#333] dark:hover:text-white transition-colors"
          >
            <Type className="w-[22px] h-[22px]" />
          </button>
        </div>
      </div>

      {/* 章節標題 */}
      <h1 className="text-[28px] md:text-[36px] font-bold text-[#333] dark:text-white mb-12 text-center leading-snug">
        {chapter.title}
      </h1>

      {/* 正文 */}
      <div
        className="text-[#444] dark:text-[#c4c4c9] leading-[2.2] font-serif max-w-2xl mx-auto"
        style={{ fontSize: `${fontSize}px` }}
      >
        {chapter.content.split('\n').map((paragraph, idx) => (
          <p key={idx} className="mb-8 text-justify indent-[2em] tracking-wide">
            {paragraph}
          </p>
        ))}
      </div>

      {/* 底部翻頁 */}
      <div className="mt-20 pt-8 border-t border-[#ebebeb] dark:border-[#323232] flex justify-between max-w-2xl mx-auto">
        <button
          onClick={() => hasPrev && changeChapter('prev')}
          title="上一章"
          className={`px-8 py-3 rounded-xl transition-colors font-medium ${hasPrev
            ? 'bg-[#f8f9fa] dark:bg-[#323232] text-[#666] dark:text-[#a9a9b3] hover:bg-[#ebebeb] dark:hover:text-white'
            : 'opacity-0 pointer-events-none'}`}
        >
          上一章
        </button>
        <button
          onClick={() => hasNext && changeChapter('next')}
          title="下一章"
          className={`px-8 py-3 rounded-xl transition-colors font-medium ${hasNext
            ? 'bg-[#5bb98c] text-white hover:bg-[#4ea27a]'
            : 'opacity-0 pointer-events-none'}`}
        >
          下一章
        </button>
      </div>
    </div>
  );
}
