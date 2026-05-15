// ============================================================
// HakodateDesktop — 函館遊記 RWD SPA
// 桌面：左主內容 + 右側面板 (aside 400px)
// 手機：垂直堆疊 + 底部 Tab Bar
// ============================================================
import React, { useState, useEffect } from 'react';
import { TRIP_INFO } from '../../data/travel-info';
import { lookupLocation } from '../../data/location-lookup';
import { useExchangeRate } from '../../hooks';
import FlightCard from './FlightCard';
import DesktopSchedule from './DesktopSchedule';
import DesktopMapView from './DesktopMapView';
import DesktopBudgetView from './DesktopBudgetView';
import DesktopRightPanel from './DesktopRightPanel';

const NAV_TABS = [
  { id: 'schedule', label: '行程' },
  { id: 'map',      label: '地圖' },
  { id: 'budget',   label: '記帳' },
];

// 載入 savedDays：優先讀新 key；無資料時嘗試從舊欄位級 schedule-edits 遷移一次。
function loadSavedDays() {
  try {
    const raw = localStorage.getItem('hakodate-schedules');
    if (raw) return JSON.parse(raw);
  } catch {}

  // 舊版相容：把 { [scheduleId]: { time,name,location,note } } 套用到 TRIP_INFO，
  // 產生完整的 day → schedules 陣列，然後寫入新 key、清除舊 key。
  try {
    const oldRaw = localStorage.getItem('hakodate-schedule-edits');
    if (!oldRaw) return {};
    const oldEdits = JSON.parse(oldRaw);
    const migrated = {};
    TRIP_INFO.days.forEach((d) => {
      const dirty = d.schedules.some((s) => oldEdits[s.id]);
      if (dirty) {
        migrated[d.day] = d.schedules.map((s) =>
          oldEdits[s.id] ? { ...s, ...oldEdits[s.id] } : s
        );
      }
    });
    try {
      localStorage.setItem('hakodate-schedules', JSON.stringify(migrated));
      localStorage.removeItem('hakodate-schedule-edits');
    } catch {}
    return migrated;
  } catch {
    return {};
  }
}

export default function HakodateDesktop({ onClose }) {
  const [activeTab, setActiveTab]           = useState('schedule');
  const [selectedDay, setSelectedDay]       = useState(0);
  const [flightExpanded, setFlightExpanded] = useState(false);
  // editArr：null = 非編輯狀態；否則為「當前日完整行程陣列」的草稿
  const [editArr, setEditArr]               = useState(null);
  // savedDays：{ [dayNumber]: [schedule, ...] }
  // 一旦該日存過一次，就完整覆蓋 TRIP_INFO 對應的 schedules
  const [savedDays, setSavedDays]           = useState(() => loadSavedDays());
  const [activeSpotId, setActiveSpotId]     = useState(null);
  const fx = useExchangeRate();
  const [expenses, setExpenses]             = useState(() => {
    try {
      const raw = localStorage.getItem('hakodate-expenses');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const editMode = editArr !== null;
  const trip = TRIP_INFO;
  const rawDay = trip.days[selectedDay];

  // 當日有效行程：優先取 savedDays，沒有則用 TRIP_INFO 原始資料
  const currentDay = {
    ...rawDay,
    schedules: savedDays[rawDay.day] ?? rawDay.schedules,
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

  // 進入 / 離開編輯：null ⇄ 當前日 schedules 的深拷貝
  const handleToggleEdit = () => {
    if (!editMode) {
      setEditArr(currentDay.schedules.map((s) => ({ ...s })));
    } else {
      setEditArr(null);
    }
  };

  const handleEditChange = (idx, field, value) => {
    setEditArr((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const handleAddSchedule = () => {
    setEditArr((prev) => [
      ...prev,
      {
        id: `d${currentDay.day}-new-${Date.now()}`,
        time: '',
        name: '',
        location: '',
        note: '',
        lat: null,
        lng: null,
      },
    ]);
  };

  const handleRemoveSchedule = (idx) => {
    setEditArr((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    // 對每筆地點查表；查到就用查表座標（地點改名時自動重新對齊），
    // 查不到就保留既有座標（避免使用者僅改文字卻意外讓地圖標記消失）
    const geocoded = editArr.map((s) => {
      if (!s.location) return s;
      const coords = lookupLocation(s.location);
      if (coords) return { ...s, lat: coords.lat, lng: coords.lng };
      return s;
    });
    const next = { ...savedDays, [currentDay.day]: geocoded };
    setSavedDays(next);
    try { localStorage.setItem('hakodate-schedules', JSON.stringify(next)); } catch {}
    setEditArr(null);
  };

  const saveExpenses = (next) => {
    setExpenses(next);
    try { localStorage.setItem('hakodate-expenses', JSON.stringify(next)); } catch {}
  };

  const addExpense = (exp) => saveExpenses([...expenses, { id: Date.now(), ...exp }]);
  const removeExpense = (id) => saveExpenses(expenses.filter((e) => e.id !== id));
  const updateExpenseSplit = (id, split) =>
    saveExpenses(expenses.map((e) => (e.id === id ? { ...e, split } : e)));

  // ── 日期選擇器（RWD：手機緊湊，桌面正常）─────────────────
  const renderDateBar = () => (
    <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {trip.days.map((d, i) => {
        const isActive = i === selectedDay;
        const [, mm, dd] = d.date.split('-');
        return (
          <button
            key={d.day}
            onClick={() => { setSelectedDay(i); setEditArr(null); }}
            className="flex-none flex flex-col items-center justify-center rounded-xl transition-all duration-200 w-[54px] md:w-[64px] min-h-[68px] md:min-h-[78px] py-1.5 md:py-2 px-1"
            style={{
              background: isActive ? '#F7F3EA' : 'transparent',
              border: isActive ? '1px solid #C4956A44' : '1px solid transparent',
            }}
          >
            <span className="text-[10px]" style={{ color: isActive ? '#C4956A' : '#7A6A5A', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>
              D{d.day}
            </span>
            <span className="text-[10px] mt-0.5" style={{ color: isActive ? '#A09080' : '#7A6A5A' }}>{d.weekday}</span>
            <span className="text-[20px] md:text-[22px] font-bold leading-tight" style={{ color: isActive ? '#F7F3EA' : '#D4C9B0', fontFamily: "'Playfair Display',serif",
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
              editArr={editArr}
              onEditChange={handleEditChange}
              onAddSchedule={handleAddSchedule}
              onRemoveSchedule={handleRemoveSchedule}
              onToggleEdit={handleToggleEdit}
              onSave={handleSave}
            />
          </div>
        );
      case 'map':
        return (
          <DesktopMapView
            day={currentDay}
            activeSpotId={activeSpotId}
            onSpotClick={setActiveSpotId}
          />
        );
      case 'budget':
        return (
          <DesktopBudgetView
            expenses={expenses}
            currentDay={currentDay}
            onAdd={addExpense}
            onRemove={removeExpense}
            onUpdateSplit={updateExpenseSplit}
            fx={fx}
          />
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
        {/* 主列：手機 → 兩行（關閉+標題 / 日期）；桌面 → 一行 */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-6 px-4 md:px-8 pt-3 md:pt-5 pb-2 md:pb-3 gap-3">
          {/* 第一群組：關閉 + 標題（手機與桌面都是一橫排） */}
          <div className="flex items-center gap-3 md:gap-6">
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

            <div className="flex-none">
              <p
                className="text-[11px] md:text-[13px] leading-none mb-0.5 md:mb-1"
                style={{ color: '#9C8060', fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}
              >
                {trip.subtitle}
              </p>
              <h1
                className="text-[20px] md:text-[28px] font-bold leading-none"
                style={{ color: '#F7F3EA', fontFamily: "'Playfair Display',serif" }}
              >
                {trip.title}
              </h1>
            </div>
          </div>

          {/* 分隔線（僅桌面） */}
          <div className="hidden md:block w-px h-10 flex-none" style={{ background: '#3D3020' }} />

          {/* 日期選擇器 */}
          <div className="flex-1 overflow-hidden -mx-1 md:mx-0">
            {renderDateBar()}
          </div>

          {/* 分隔線 + 桌面頂部 Nav Tabs（僅桌面） */}
          <div className="hidden md:block w-px h-10 flex-none" style={{ background: '#3D3020' }} />
          <nav className="hidden md:flex gap-1 flex-none">
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
          BODY：桌面 = 左主 + 右側欄；手機 = 垂直堆疊（單一卷軸）
      ════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">

        {/* 左主內容 */}
        <main className={`md:flex-1 md:overflow-y-auto ${activeTab === 'map' ? 'p-0 md:p-0' : 'px-4 py-4 md:px-8 md:py-6'}`}>
          {renderMain()}
        </main>

        {/* 右側面板（桌面：右側 400px；手機：堆疊在主內容下方） */}
        <aside
          className="md:w-[400px] md:flex-none md:overflow-hidden md:flex md:flex-col border-t md:border-t-0 md:border-l"
          style={{ background: '#EDE4CF', borderColor: '#D4C9B0' }}
        >
          {/* 右側標題列（僅桌面） */}
          <div
            className="hidden md:flex flex-none px-5 py-3.5 items-center justify-between"
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
          <div className="md:flex-1 md:overflow-y-auto">
            <DesktopRightPanel
              tab={activeTab}
              day={currentDay}
              trip={trip}
              expenses={expenses}
              onAdd={addExpense}
              onRemove={removeExpense}
              activeSpotId={activeSpotId}
              onSpotClick={setActiveSpotId}
              fx={fx}
            />
          </div>
        </aside>
      </div>

      {/* ════════════════════════════════════════
          手機版底部 Tab Bar
      ════════════════════════════════════════ */}
      <nav
        className="md:hidden flex-none flex"
        style={{ background: '#2B2015', borderTop: '1px solid #3D3020', boxShadow: '0 -2px 12px rgba(0,0,0,0.25)' }}
      >
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
              style={{ color: isActive ? '#F7F3EA' : '#7A6A5A' }}
            >
              <TabIcon id={tab.id} active={isActive} />
              <span className="text-[11px] font-medium" style={{ color: isActive ? '#C4956A' : '#9C8060' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// 底部 Tab 列圖示
function TabIcon({ id, active }) {
  const stroke = active ? '#C4956A' : '#7A6A5A';
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (id === 'schedule') return (
    <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
  );
  if (id === 'map') return (
    <svg {...common}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
  );
  if (id === 'budget') return (
    <svg {...common}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
  );
  return null;
}
