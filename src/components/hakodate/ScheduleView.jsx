// ============================================================
// ScheduleView — 當日完整時間軸行程
// ============================================================
import React, { useState } from 'react';

export default function ScheduleView({ currentDay }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="px-4 pt-2 pb-6">
      {/* 日期標題 */}
      <div
        className="rounded-2xl px-5 py-4 mb-4 flex items-center justify-between"
        style={{ background: '#2B2015' }}
      >
        <div>
          <p className="text-[11px] tracking-widest mb-1" style={{ color: '#9C8060' }}>
            DAY {currentDay.day}
          </p>
          <p
            className="text-[22px] font-bold leading-none"
            style={{ color: '#F7F3EA', fontFamily: "'Playfair Display', serif" }}
          >
            {currentDay.date}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px]" style={{ color: '#9C8060' }}>{currentDay.weekday}</p>
          <p className="text-[13px] mt-1" style={{ color: '#C4956A' }}>
            {currentDay.schedules.length} 個行程
          </p>
        </div>
      </div>

      {/* 時間軸 */}
      <div className="relative">
        {/* 垂直軸線 */}
        <div
          className="absolute left-[52px] top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, #C4956A, #DDD3C0)' }}
        />

        <div className="space-y-1">
          {currentDay.schedules.map((s, i) => {
            const isExpanded = expanded === i;
            return (
              <div key={i} className="relative">
                {/* 軸上圓點 */}
                <div
                  className="absolute left-[46px] top-4 w-3 h-3 rounded-full border-2 z-10"
                  style={{
                    background: isExpanded ? '#C4956A' : '#F7F3EA',
                    borderColor: '#C4956A',
                  }}
                />

                <button
                  className="w-full text-left pl-16 pr-4 py-3"
                  onClick={() => setExpanded(isExpanded ? null : i)}
                >
                  <div className="flex items-start gap-2">
                    {/* 時間 */}
                    <span
                      className="text-[13px] w-12 flex-none -ml-12"
                      style={{ color: '#9C8060', fontFamily: "'Playfair Display', serif" }}
                    >
                      {s.time}
                    </span>
                    {/* 內容卡片 */}
                    <div
                      className="flex-1 rounded-xl px-4 py-3 transition-colors"
                      style={{
                        background: isExpanded ? '#F0EAD8' : '#F7F3EA',
                        border: isExpanded ? '1px solid #C4956A' : '1px solid transparent',
                        boxShadow: '0 1px 6px rgba(44,32,21,0.05)',
                      }}
                    >
                      <p className="text-[15px] font-medium" style={{ color: '#2B2015' }}>
                        {s.name}
                      </p>
                      <p className="text-[12px] mt-0.5" style={{ color: '#9C8060' }}>{s.location}</p>

                      {/* 展開：備註 + 操作按鈕 */}
                      {isExpanded && (
                        <div className="mt-3 pt-3" style={{ borderTop: '1px dashed #DDD3C0' }}>
                          <p className="text-[13px] leading-relaxed mb-3" style={{ color: '#5A4A3A' }}>
                            {s.note}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {[
                              { label: '導航', icon: '↗' },
                              { label: '加入地圖', icon: '◎' },
                              { label: '編輯', icon: '✎' },
                            ].map((btn) => (
                              <button
                                key={btn.label}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px]"
                                style={{ background: '#F2EAD6', color: '#5A4A3A' }}
                              >
                                <span>{btn.icon}</span>
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 今日筆記 */}
      <div
        className="mt-4 rounded-2xl p-5"
        style={{ background: '#F7F3EA', border: '1px dashed #C4956A' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A4A3A" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="text-[14px] font-medium" style={{ color: '#2B2015' }}>今日筆記</span>
          </div>
          <button className="flex items-center gap-1 text-[12px]" style={{ color: '#C4956A' }}>
            點擊撰寫
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: '#B0A090' }}>
          尚未記錄 — 點擊這裡寫下今天的心情、想吃的、買到的、有趣的見聞…
        </p>
      </div>
    </div>
  );
}
