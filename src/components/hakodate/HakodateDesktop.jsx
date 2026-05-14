// ============================================================
// HakodateDesktop — 函館遊記 桌面版 SPA
// 全螢幕 overlay：左主內容 + 右側面板
// ============================================================
import React, { useState, useEffect } from 'react';
import { TRIP_INFO } from '../../data/travel-info';
import FlightCard from './FlightCard';
import DesktopSchedule from './DesktopSchedule';
import DesktopRightPanel from './DesktopRightPanel';

const NAV_TABS = [
  { id: 'schedule', label: '行程' },
  { id: 'map',      label: '地圖' },
  { id: 'budget',   label: '記帳' },
  { id: 'spots',    label: '景點' },
];

export default function HakodateDesktop({ onClose }) {
  const [activeTab, setActiveTab]           = useState('schedule');
  const [selectedDay, setSelectedDay]       = useState(0);
  const [flightExpanded, setFlightExpanded] = useState(false);
  const [editMode, setEditMode]             = useState(false);
  const [editData, setEditData]             = useState({});          // { scheduleId: {time,name,location,note} }
  const [savedEdits, setSavedEdits]         = useState({});          // persisted overrides
  const [expenses, setExpenses]             = useState([]);

  const trip = TRIP_INFO;
  const rawDay = trip.days[selectedDay];

  // 合併持久化修改覆蓋原始資料
  const currentDay = {
    ...rawDay,
    schedules: rawDay.schedules.map((s) =>
      savedEdits[s.id] ? { ...s, ...savedEdits[s.id] } : s
    ),
  };

  // 注入 Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Serif+TC:wght@300;400;500&display=swap';
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  // 進入編輯模式：把當前行程複製進 editData
  const handleToggleEdit = () => {
    if (!editMode) {
      const init = {};
      currentDay.schedules.forEach((s) => { init[s.id] = { time: s.time, name: s.name, location: s.location, note: s.note }; });
      setEditData(init);
    }
    setEditMode((v) => !v);
  };

  const handleEditChange = (id, field, value) => {
    setEditData((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = () => {
    setSavedEdits((prev) => ({ ...prev, ...editData }));
    setEditMode(false);
    setEditData({});
  };

  const addExpense = (exp) => setExpenses((p) => [...p, { id: Date.now(), ...exp }]);
  const removeExpense = (id) => setExpenses((p) => p.filter((e) => e.id !== id));

  // ── 日期選擇器（桌面橫向版）────────────────────────────────
  const renderDateBar = () => (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {trip.days.map((d, i) => {
        const isActive = i === selectedDay;
        const [, mm, dd] = d.date.split('-');
        return (
          <button
            key={d.day}
            onClick={() => { setSelectedDay(i); setEditMode(false); setEditData({}); }}
            className="flex-none flex flex-col items-center justify-center rounded-xl transition-all duration-200"
            style={{
              width: '64px', minHeight: '78px', padding: '8px 4px',
              background: isActive ? '#F7F3EA' : 'transparent',
              border: isActive ? '1px solid #C4956A44' : '1px solid transparent',
            }}
          >
            <span className="text-[10px]" style={{ color: isActive ? '#C4956A' : '#7A6A5A', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>
              D{d.day}
            </span>
            <span className="text-[10px] mt-0.5" style={{ color: isActive ? '#A09080' : '#7A6A5A' }}>{d.weekday}</span>
            <span className="text-[22px] font-bold leading-tight" style={{ color: isActive ? '#F7F3EA' : '#D4C9B0', fontFamily: "'Playfair Display',serif",
              textShadow: isActive ? 'none' : 'none',
              WebkitTextStroke: isActive ? '0' : '1px #9C8060',
            }}>
              {parseInt(dd)}
            </span>
            <span className="text-[10px]" style={{ color: isActive ? '#A09080' : '#7A6A5A' }}>{parseInt(mm)}月</span>
          </button>
        );
      })}
    </div>
  );

  // ── 主內容區（依 activeTab 切換）───────────────────────────
  const renderMain = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <div className="space-y-5">
            <FlightCard
              flights={trip.flights}
              expanded={flightExpanded}
              onToggle={() => setFlightExpanded((v) => !v)}
            />
            <DesktopSchedule
              day={currentDay}
              editMode={editMode}
              editData={editData}
              onEditChange={handleEditChange}
              onToggleEdit={handleToggleEdit}
              onSave={handleSave}
            />
          </div>
        );
      case 'map':
        // 地圖頁：全高地圖由右側面板提供，主區顯示說明
        return (
          <div className="rounded-2xl overflow-hidden h-[calc(100vh-200px)]"
            style={{ background: '#F7F3EA', boxShadow: '0 2px 12px rgba(44,32,21,0.06)' }}>
            <p className="px-6 py-4 text-[14px]" style={{ color: '#9C8060' }}>
              地圖顯示於右側面板，可切換「行程」頁籤查看詳細時間軸。
            </p>
          </div>
        );
      case 'budget':
      case 'spots':
        return (
          <div className="rounded-2xl p-6" style={{ background: '#F7F3EA', boxShadow: '0 2px 12px rgba(44,32,21,0.06)' }}>
            <p className="text-[14px]" style={{ color: '#9C8060' }}>
              {activeTab === 'budget' ? '記帳功能' : '備用景點'}詳情請參考右側面板。
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  // ── JSX ──────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden select-none"
      style={{ fontFamily: "'Noto Serif TC', serif", background: '#F2EAD6' }}
    >
      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <header
        className="flex-none"
        style={{ background: '#2B2015', boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}
      >
        {/* 頂部列：Logo + Nav + 關閉 */}
        <div className="flex items-center gap-6 px-8 pt-5 pb-3">
          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="flex-none w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ background: '#3D3020' }}
            title="返回旅遊列表"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="#D4C9B0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* 標題區 */}
          <div className="flex-none">
            <p
              className="text-[13px] leading-none mb-1"
              style={{ color: '#9C8060', fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}
            >
              {trip.subtitle}
            </p>
            <h1
              className="text-[28px] font-bold leading-none"
              style={{ color: '#F7F3EA', fontFamily: "'Playfair Display',serif" }}
            >
              {trip.title}
            </h1>
          </div>

          {/* 分隔線 */}
          <div className="w-px h-10 flex-none" style={{ background: '#3D3020' }} />

          {/* 日期選擇器（嵌入 header） */}
          <div className="flex-1 overflow-hidden">
            {renderDateBar()}
          </div>

          {/* 分隔線 */}
          <div className="w-px h-10 flex-none" style={{ background: '#3D3020' }} />

          {/* 導覽 Tabs */}
          <nav className="flex gap-1 flex-none">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all"
                style={{
                  background: activeTab === tab.id ? '#F7F3EA' : 'transparent',
                  color: activeTab === tab.id ? '#2B2015' : '#9C8060',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ════════════════════════════════════════
          BODY：左主內容 + 右側面板
      ════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* 左主內容 */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          {renderMain()}
        </main>

        {/* 右側面板 */}
        <aside
          className="flex-none overflow-hidden flex flex-col"
          style={{ width: '400px', borderLeft: '1px solid #D4C9B0', background: '#EDE4CF' }}
        >
          {/* 右側標題列 */}
          <div
            className="flex-none px-5 py-3.5 flex items-center justify-between"
            style={{ borderBottom: '1px solid #D4C9B0', background: '#E8DFC8' }}
          >
            <p className="text-[13px] font-medium" style={{ color: '#2B2015' }}>
              {NAV_TABS.find((t) => t.id === activeTab)?.label ?? '行程'} 詳情
            </p>
            <p
              className="text-[11px]"
              style={{ color: '#9C8060', fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}
            >
              Day {currentDay.day} · {currentDay.weekday}
            </p>
          </div>

          {/* 右側內容 */}
          <div className="flex-1 overflow-y-auto">
            <DesktopRightPanel
              tab={activeTab}
              day={currentDay}
              trip={trip}
              expenses={expenses}
              onAdd={addExpense}
              onRemove={removeExpense}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
