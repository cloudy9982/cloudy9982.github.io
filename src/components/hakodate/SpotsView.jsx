// ============================================================
// SpotsView — 備用景點收藏卡片
// ============================================================
import React, { useState } from 'react';

export default function SpotsView({ spots }) {
  const [added, setAdded] = useState([]);

  const toggle = (id) =>
    setAdded((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  return (
    <div className="px-4 pt-2 pb-6">
      {/* 頁首 */}
      <div className="flex justify-between items-baseline mb-4">
        <div>
          <p className="text-[16px] font-medium" style={{ color: '#2B2015' }}>備用景點</p>
          <p
            className="text-[13px]"
            style={{ color: '#9C8060', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Saved Spots
          </p>
        </div>
        <span className="text-[13px]" style={{ color: '#9C8060' }}>{spots.length} 個收藏</span>
      </div>

      {/* 景點卡片列表 */}
      <div className="space-y-3">
        {spots.map((spot) => {
          const isAdded = added.includes(spot.id);
          return (
            <div
              key={spot.id}
              className="rounded-2xl p-5"
              style={{
                background: '#F7F3EA',
                boxShadow: '0 2px 8px rgba(44,32,21,0.05)',
                border: isAdded ? '1px solid #C4956A' : '1px solid transparent',
              }}
            >
              {/* 名稱行 */}
              <div className="mb-1">
                <p className="text-[17px] font-medium leading-snug" style={{ color: '#2B2015' }}>
                  {spot.name}
                  <span
                    className="text-[13px] ml-2 font-normal"
                    style={{ color: '#9C8060', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                  >
                    · {spot.nameEn}
                  </span>
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: '#9C8060' }}>
                  {spot.location}
                </p>
              </div>

              {/* 描述 */}
              <p className="text-[13px] leading-relaxed mt-2 mb-4" style={{ color: '#5A4A3A' }}>
                {spot.desc}
              </p>

              {/* 操作按鈕 */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => toggle(spot.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                  style={{
                    background: isAdded ? '#2B2015' : '#F2EAD6',
                    color: isAdded ? '#F7F3EA' : '#5A4A3A',
                  }}
                >
                  <span>{isAdded ? '✓' : '+'}</span>
                  {isAdded ? '已加入行程' : '加入行程'}
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px]"
                  style={{ background: '#F2EAD6', color: '#5A4A3A' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                  地圖
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px]"
                  style={{ background: '#F2EAD6', color: '#5A4A3A' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  編輯
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 新增景點浮動按鈕 */}
      <button
        className="fixed bottom-24 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl"
        style={{ background: '#2B2015', color: '#F7F3EA', zIndex: 10 }}
        title="新增景點"
      >
        +
      </button>
    </div>
  );
}
