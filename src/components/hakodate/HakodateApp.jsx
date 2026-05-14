// ============================================================
// HakodateApp — 函館旅遊日記 SPA 主容器
// ============================================================
import React, { useState, useEffect } from 'react';
import { HAKODATE_TRIP } from '../../data/hakodate';
import DateSelector from './DateSelector';
import BottomNav from './BottomNav';
import HomeView from './HomeView';
import ScheduleView from './ScheduleView';
import MapView from './MapView';
import BudgetView from './BudgetView';
import SpotsView from './SpotsView';

export default function HakodateApp({ onClose }) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDay, setSelectedDay] = useState(0); // 0-indexed
  const [expenses, setExpenses] = useState([]);

  // 注入 Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+TC:wght@300;400;500&display=swap';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  const trip = HAKODATE_TRIP;
  const currentDay = trip.days[selectedDay];

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, { id: Date.now(), ...expense }]);
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            trip={trip}
            currentDay={currentDay}
            expenses={expenses}
            onTabChange={setActiveTab}
          />
        );
      case 'schedule':
        return <ScheduleView currentDay={currentDay} />;
      case 'map':
        return <MapView currentDay={currentDay} trip={trip} />;
      case 'budget':
        return (
          <BudgetView
            expenses={expenses}
            currentDay={currentDay}
            onAdd={addExpense}
            onRemove={removeExpense}
          />
        );
      case 'spots':
        return <SpotsView spots={trip.savedSpots} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ fontFamily: "'Noto Serif TC', serif", background: 'rgba(0,0,0,0.5)' }}
    >
      {/* Phone-frame container */}
      <div
        className="relative w-full max-w-[430px] h-full max-h-[900px] flex flex-col overflow-hidden"
        style={{ background: '#F2EAD6', borderRadius: '0px' }}
      >
        {/* ── 頂部標題欄 ── */}
        <div
          className="flex-none px-5 pt-10 pb-3"
          style={{ background: '#F2EAD6' }}
        >
          {/* 副標題 + 按鈕行 */}
          <div className="flex justify-between items-center mb-1">
            <span
              className="text-sm tracking-widest"
              style={{ color: '#9C8060', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              {trip.subtitle}
            </span>
            <div className="flex gap-3">
              {/* 關閉按鈕 */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#D4C9B0' }}
                title="返回旅遊列表"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2L12 12M12 2L2 12" stroke="#5A4A3A" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              {/* 設定按鈕（裝飾用） */}
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#F7F3EA' }}
                title="設定"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A4A3A" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </button>
            </div>
          </div>

          {/* 主標題 */}
          <h1
            className="text-[32px] font-bold leading-tight"
            style={{ color: '#2B2015', fontFamily: "'Playfair Display', serif" }}
          >
            Hakodate{' '}
            <span className="text-[24px] font-normal" style={{ color: '#5A4A3A' }}>
              遊記
            </span>
          </h1>

          {/* 日期選擇器 */}
          <div className="mt-4">
            <DateSelector
              days={trip.days}
              selectedDay={selectedDay}
              onSelect={setSelectedDay}
            />
          </div>
        </div>

        {/* ── 主內容區（可滾動）── */}
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ background: '#F2EAD6' }}>
          {renderContent()}
        </div>

        {/* ── 底部導覽列 ── */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
