// ============================================================
// DateSelector — 橫向滾動日期卡片
// ============================================================
import React, { useRef, useEffect } from 'react';

export default function DateSelector({ days, selectedDay, onSelect }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    // 自動捲動讓選中的日期卡片居中
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[selectedDay];
    if (!card) return;
    const offset = card.offsetLeft - container.clientWidth / 2 + card.clientWidth / 2;
    container.scrollTo({ left: offset, behavior: 'smooth' });
  }, [selectedDay]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2.5 overflow-x-auto pb-1"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {days.map((d, i) => {
        const isActive = i === selectedDay;
        const [, mm, dd] = d.date.split('-');
        return (
          <button
            key={d.day}
            onClick={() => onSelect(i)}
            className="flex-none flex flex-col items-center justify-center rounded-2xl transition-all duration-200"
            style={{
              width: '68px',
              minHeight: '90px',
              padding: '10px 6px',
              background: isActive ? '#2B2015' : '#F7F3EA',
              boxShadow: isActive ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
              border: isActive ? 'none' : '1px solid #E8DFCC',
            }}
          >
            {/* D序號 */}
            <span
              className="text-[10px] tracking-wider mb-0.5"
              style={{ color: isActive ? '#C4956A' : '#9C8060', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              D{d.day}
            </span>
            {/* 星期 */}
            <span
              className="text-[11px] tracking-widest mb-1"
              style={{ color: isActive ? '#BDB0A0' : '#9C8060' }}
            >
              {d.weekday}
            </span>
            {/* 日期數字 */}
            <span
              className="text-[26px] leading-none font-bold"
              style={{
                color: isActive ? '#FFFFFF' : '#2B2015',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {parseInt(dd)}
            </span>
            {/* 月份 */}
            <span
              className="text-[11px] mt-1"
              style={{ color: isActive ? '#BDB0A0' : '#9C8060' }}
            >
              {parseInt(mm)}月
            </span>
          </button>
        );
      })}
    </div>
  );
}
