// ============================================================
// BottomNav — 底部固定五頁導覽列
// ============================================================
import React from 'react';

const TABS = [
  {
    id: 'schedule',
    label: '行程',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'map',
    label: '地圖',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
        <circle cx="16" cy="10" r="2" fill="currentColor" stroke="none" style={{ color: '#C4956A' }} />
      </svg>
    ),
  },
  {
    id: 'home',
    label: '首頁',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
    center: true,
  },
  {
    id: 'budget',
    label: '記帳',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 3-4 8-4 8s-4-5-4-8a4 4 0 0 1 4-4z" />
        <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
        <path d="M4 14h16l-1 6H5l-1-6z" />
      </svg>
    ),
  },
  {
    id: 'spots',
    label: '景點',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div
      className="flex-none flex items-end justify-around pt-2 pb-5 px-2"
      style={{
        background: '#F7F3EA',
        borderTop: '1px solid #E8DFCC',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        if (tab.center) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center relative"
              style={{ marginTop: '-18px' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-1 shadow-lg"
                style={{
                  background: isActive ? '#2B2015' : '#3D3020',
                  border: '3px solid #F2EAD6',
                }}
              >
                <div className="w-6 h-6 text-white">{tab.icon}</div>
              </div>
              <span className="text-[11px]" style={{ color: isActive ? '#2B2015' : '#9C8060' }}>
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 py-1 relative"
            style={{ minWidth: '48px' }}
          >
            <div
              className="w-6 h-6 transition-colors"
              style={{ color: isActive ? '#2B2015' : '#A89880' }}
            >
              {tab.icon}
            </div>
            <span
              className="text-[11px] transition-colors"
              style={{ color: isActive ? '#2B2015' : '#A89880' }}
            >
              {tab.label}
            </span>
            {isActive && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: '#C4956A' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
