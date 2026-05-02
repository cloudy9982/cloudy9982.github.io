// ============================================================
// App.jsx — 頂層協調器
// 所有畫面邏輯、資料、元件均已拆分至各自模組
// ============================================================
import React, { useState } from 'react';

// 資料
import { NOVELS } from './data/novels';

// Hooks
import { useTheme, useAvatarUrl, useSearch } from './hooks';

// 元件
import MobileHeader  from './components/MobileHeader';
import LeftSidebar   from './components/LeftSidebar';
import RightSidebar  from './components/RightSidebar';
import ArticleCard   from './components/ArticleCard';
import { NovelDetail, ReaderView } from './components/NovelViews';
import AboutPage from './components/AboutPage';

export default function App() {
  // ── 全域狀態 ────────────────────────────────────────────
  const { theme, toggleTheme }       = useTheme();
  const { avatarUrl, setAvatarUrl }  = useAvatarUrl();
  const [activeTab, setActiveTab]    = useState('home');
  const [view, setView]              = useState('list');           // list | novel_detail | reader
  const [selectedNovel, setNovel]    = useState(null);
  const [selectedChapter, setChapter] = useState(null);
  const [isMobileMenuOpen, setMobile] = useState(false);
  const [activeFilter, setFilter]    = useState({ type: null, value: null }); // {type:'tag'|'category', value}

  // 搜尋（同時驅動右側欄 input 和頂部搜尋頁）
  const { query, setQuery, results } = useSearch(NOVELS);

  // ── 計算顯示的小說列表 ──────────────────────────────────
  let displayNovels = results;
  if (activeFilter.type === 'tag') {
    displayNovels = displayNovels.filter(n => n.tags.includes(activeFilter.value));
  } else if (activeFilter.type === 'category') {
    displayNovels = displayNovels.filter(n => n.category === activeFilter.value);
  }

  // ── 導覽處理 ────────────────────────────────────────────
  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setView('list');
    setFilter({ type: null, value: null });
    setQuery('');
    setMobile(false);
  };

  const handleFilterTag = (tag) => {
    setFilter({ type: 'tag', value: tag });
    setActiveTab('novels');
    setView('list');
    setMobile(false);
  };

  const handleFilterCategory = (cat) => {
    setFilter({ type: 'category', value: cat });
    setActiveTab('novels');
    setView('list');
    setMobile(false);
  };

  const handleSearch = (q) => {
    setQuery(q);
    if (q.trim()) {
      setActiveTab('search');
      setView('list');
      setFilter({ type: null, value: null });
    }
  };

  // ── 進入小說詳情 ─────────────────────────────────────────
  const openNovel = (novel) => {
    setNovel(novel);
    setView('novel_detail');
    window.scrollTo(0, 0);
  };

  // ── 進入閱讀器 ───────────────────────────────────────────
  const openChapter = (chapter, index) => {
    setChapter({ ...chapter, index });
    setView('reader');
    window.scrollTo(0, 0);
  };

  // ── 渲染主內容區 ─────────────────────────────────────────
  const renderMain = () => {
    if (activeTab === 'about' && view === 'list') {
      return <AboutPage avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />;
    }

    if (view === 'novel_detail' && selectedNovel) {
      return (
        <NovelDetail
          novel={selectedNovel}
          onBack={() => setView('list')}
          onChapterSelect={openChapter}
        />
      );
    }
    if (view === 'reader' && selectedNovel && selectedChapter) {
      return (
        <ReaderView
          novel={selectedNovel}
          chapter={selectedChapter}
          onBack={() => setView('novel_detail')}
          onChapterChange={setChapter}
        />
      );
    }

    // 列表視圖（含篩選 / 搜尋提示）
    return (
      <div className="animate-fade-in">
        {/* 篩選標題提示 */}
        {(activeFilter.value || query) && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            {activeFilter.value && (
              <span className="bg-[#5bb98c]/10 text-[#5bb98c] px-4 py-1.5 rounded-xl text-[14px] font-medium">
                {activeFilter.type === 'tag' ? `#${activeFilter.value}` : activeFilter.value}
              </span>
            )}
            {query && (
              <span className="bg-[#ebebeb] dark:bg-[#323232] text-[#666] dark:text-[#a9a9b3] px-4 py-1.5 rounded-xl text-[14px]">
                搜尋：「{query}」
              </span>
            )}
            <button
              onClick={() => { setFilter({ type: null, value: null }); setQuery(''); }}
              className="text-[13px] text-[#888] hover:text-[#5bb98c] transition-colors underline"
            >
              清除篩選
            </button>
            <span className="text-[13px] text-[#aaa]">共 {displayNovels.length} 篇</span>
          </div>
        )}

        {displayNovels.length === 0 ? (
          <div className="text-center py-20 text-[#aaa]">找不到相符的內容</div>
        ) : (
          displayNovels.map(novel => (
            <ArticleCard
              key={novel.id}
              item={novel}
              onClick={() => openNovel(novel)}
              onFilterTag={handleFilterTag}
            />
          ))
        )}
      </div>
    );
  };

  // ── JSX ──────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-[#1a1a1a] font-sans transition-colors duration-300">

      {/* 行動裝置頂部列 */}
      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onToggle={() => setMobile(v => !v)}
        onTitleClick={() => handleNavClick('home')}
      />

      {/* 行動裝置遮罩 */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30 transition-opacity"
          onClick={() => setMobile(false)}
        />
      )}

      {/* 頁面佈局 */}
      <div className="flex w-full max-w-[1500px] mx-auto lg:pt-0 pt-16">

        <LeftSidebar
          activeTab={activeTab}
          onNavClick={handleNavClick}
          theme={theme}
          onToggleTheme={toggleTheme}
          isMobileMenuOpen={isMobileMenuOpen}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
        />

        {/* 主內容區 */}
        <main className="flex-1 min-w-0 max-w-[850px] mx-auto w-full p-4 sm:p-8 lg:p-10">
          {renderMain()}
        </main>

        <RightSidebar
          onSearch={handleSearch}
          onFilterTag={handleFilterTag}
          onFilterCategory={handleFilterCategory}
          onNavClick={handleNavClick}
          onSelectNovel={openNovel}
        />

      </div>
    </div>
  );
}