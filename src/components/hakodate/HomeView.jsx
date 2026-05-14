// ============================================================
// HomeView — 首頁：行程預覽、功能總覽
// ============================================================
import React from 'react';

const FEATURE_GRID = [
  {
    id: 'schedule',
    labelEn: 'Plans',
    label: '每日行程',
    desc: '編輯時間地點與備註',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <rect x="6" y="8" width="36" height="36" rx="6" fill="#E8DFCC" />
        <rect x="14" y="4" width="4" height="8" rx="2" fill="#9C8060" />
        <rect x="30" y="4" width="4" height="8" rx="2" fill="#9C8060" />
        <line x1="6" y1="18" x2="42" y2="18" stroke="#9C8060" strokeWidth="2" />
        <circle cx="30" cy="30" r="3" fill="#C4956A" />
        <circle cx="30" cy="30" r="1" fill="white" />
      </svg>
    ),
  },
  {
    id: 'map',
    labelEn: 'Map',
    label: '地圖導航',
    desc: '當日所有景點 + 我的位置',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <polygon points="4 14 4 44 18 36 32 44 44 36 44 6 32 14 18 6 4 14" fill="#E8DFCC" stroke="#9C8060" strokeWidth="1.5" />
        <line x1="18" y1="6" x2="18" y2="36" stroke="#9C8060" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="32" y1="14" x2="32" y2="44" stroke="#9C8060" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="32" cy="22" r="4" fill="#C4956A" />
        <circle cx="32" cy="22" r="1.5" fill="white" />
      </svg>
    ),
  },
  {
    id: 'budget',
    labelEn: 'Wallet',
    label: '記帳分帳',
    desc: '自動換算為台幣',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="32" rx="16" ry="6" fill="#E8DFCC" />
        <ellipse cx="24" cy="26" rx="16" ry="6" fill="#D4C9B0" />
        <ellipse cx="24" cy="20" rx="16" ry="6" fill="#9C8060" />
        <ellipse cx="24" cy="20" rx="16" ry="6" fill="none" stroke="#7A6040" strokeWidth="1" />
        <text x="24" y="24" textAnchor="middle" fontSize="9" fill="white" fontFamily="serif">¥</text>
        <path d="M32 12 L36 8" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="37" cy="7" r="2" fill="#C4956A" />
      </svg>
    ),
  },
  {
    id: 'spots',
    labelEn: 'Saved',
    label: '備用景點',
    desc: '收藏想去的地方',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M12 8 L12 42 L24 34 L36 42 L36 8 Z" fill="#E8DFCC" stroke="#9C8060" strokeWidth="1.5" />
        <path d="M12 8 L12 32 L24 24 L36 32 L36 8 Z" fill="#D4C9B0" />
        <path d="M18 20 L22 24 L30 16" stroke="#C4956A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HomeView({ trip, currentDay, expenses, onTabChange }) {
  const previewSchedules = currentDay.schedules.slice(0, 3);
  const remaining = currentDay.schedules.length - 3;

  const todayExpenses = expenses.filter((e) => e.day === currentDay.day);
  const totalJPY = todayExpenses.reduce((s, e) => s + Number(e.jpy), 0);

  return (
    <div className="px-4 pt-2 pb-4 space-y-4">

      {/* 航班資訊卡 */}
      <button
        onClick={() => {}}
        className="w-full flex items-center justify-between rounded-2xl px-5 py-4"
        style={{
          background: '#F7F3EA',
          border: '1.5px dashed #C4956A',
        }}
      >
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="2" strokeLinecap="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <span className="text-[14px]" style={{ color: '#5A4A3A' }}>
            出發資訊 · 航班時刻表
          </span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9C8060" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* 今日行程卡 */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#F7F3EA', boxShadow: '0 2px 12px rgba(44,32,21,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A4A3A" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
            </svg>
            <span className="text-[15px] font-medium" style={{ color: '#2B2015' }}>今日行程</span>
          </div>
          <button
            onClick={() => onTabChange('schedule')}
            className="flex items-center gap-1 text-[13px]"
            style={{ color: '#C4956A' }}
          >
            查看全部
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="space-y-0">
          {previewSchedules.map((s, i) => (
            <div key={i}>
              <div className="flex items-start gap-4 py-3">
                <span
                  className="text-[13px] w-12 flex-none"
                  style={{ color: '#9C8060', fontVariantNumeric: 'tabular-nums', fontFamily: "'Playfair Display', serif" }}
                >
                  {s.time}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium leading-snug" style={{ color: '#2B2015' }}>
                    {s.name}
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: '#9C8060' }}>{s.location}</p>
                </div>
              </div>
              {i < previewSchedules.length - 1 && (
                <div style={{ borderTop: '1px dashed #DDD3C0', marginLeft: '64px' }} />
              )}
            </div>
          ))}
        </div>

        {remaining > 0 && (
          <button
            onClick={() => onTabChange('schedule')}
            className="w-full mt-3 text-[13px] text-center py-2"
            style={{ color: '#9C8060' }}
          >
            還有 {remaining} 個行程
          </button>
        )}
      </div>

      {/* 功能總覽 */}
      <div>
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-[16px] font-medium" style={{ color: '#2B2015' }}>功能總覽</span>
          <span
            className="text-[13px]"
            style={{ color: '#9C8060', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Menu
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {FEATURE_GRID.map((feat) => (
            <button
              key={feat.id}
              onClick={() => onTabChange(feat.id)}
              className="rounded-2xl p-5 text-left transition-transform active:scale-95"
              style={{ background: '#F7F3EA', boxShadow: '0 2px 8px rgba(44,32,21,0.05)' }}
            >
              <div className="w-12 h-12 mb-3">{feat.icon}</div>
              <p
                className="text-[11px] tracking-widest mb-0.5"
                style={{ color: '#C4956A', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
              >
                {feat.labelEn}
              </p>
              <p className="text-[15px] font-medium" style={{ color: '#2B2015' }}>{feat.label}</p>
              <p className="text-[12px] mt-1" style={{ color: '#9C8060' }}>{feat.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 住宿資訊 */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#F7F3EA', boxShadow: '0 2px 8px rgba(44,32,21,0.05)' }}
      >
        <p className="text-[12px] tracking-widest mb-2" style={{ color: '#C4956A', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
          Hotel
        </p>
        <p className="text-[16px] font-medium" style={{ color: '#2B2015' }}>{trip.hotel.name}</p>
        <p className="text-[13px] mt-1" style={{ color: '#9C8060' }}>{trip.hotel.nameEn}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-[13px]" style={{ color: '#5A4A3A' }}>
            {trip.hotel.checkIn} ～ {trip.hotel.checkOut}
          </span>
          <span
            className="text-[15px] font-bold"
            style={{ color: '#2B2015', fontFamily: "'Playfair Display', serif" }}
          >
            ¥{trip.hotel.totalJPY.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
