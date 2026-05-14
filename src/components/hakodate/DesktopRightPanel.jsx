// ============================================================
// DesktopRightPanel — 右側面板（地圖 / 景點 / 記帳）
// ============================================================
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const RATE = 0.21;
const CATEGORIES = ['餐飲', '交通', '購物', '住宿', '景點', '其他'];
const CAT_COLOR = { 餐飲: '#C4956A', 交通: '#7A9E9E', 購物: '#9C8080', 住宿: '#8A9C70', 景點: '#9C8060', 其他: '#A09090' };

// ── mini 地圖 ───────────────────────────────────────────────
function MiniMap({ day }) {
  const ref = useRef(null);
  const instance = useRef(null);
  const spots = day.schedules.filter((s) => s.lat && s.lng);

  useEffect(() => {
    if (instance.current) { instance.current.remove(); instance.current = null; }
    if (!ref.current || !spots.length) return;

    const map = L.map(ref.current, { center: [spots[0].lat, spots[0].lng], zoom: 13, zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    spots.forEach((s, i) => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:#C4956A;width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(45deg);color:white;font-size:9px;font-weight:bold;">${i + 1}</span></div>`,
        iconSize: [22, 22], iconAnchor: [11, 22], popupAnchor: [0, -24],
      });
      L.marker([s.lat, s.lng], { icon }).bindPopup(
        `<b style="font-size:12px">${s.name}</b><br><span style="font-size:11px;color:#888">${s.location}</span>`
      ).addTo(map);
    });

    if (spots.length > 1) map.fitBounds(L.latLngBounds(spots.map((s) => [s.lat, s.lng])), { padding: [20, 20] });
    instance.current = map;
    return () => { map.remove(); instance.current = null; };
  }, [day.day]);

  return <div ref={ref} style={{ height: '260px', background: '#E8E0CC' }} />;
}

// ── 景點清單 ────────────────────────────────────────────────
function SpotsPanel({ spots }) {
  const [added, setAdded] = useState([]);
  return (
    <div className="space-y-3 p-4">
      {spots.map((s) => (
        <div key={s.id} className="rounded-xl p-4" style={{ background: '#F7F3EA', border: '1px solid #E8DFCC' }}>
          <p className="text-[14px] font-medium" style={{ color: '#2B2015' }}>{s.name}
            <span className="text-[11px] ml-1.5 font-normal" style={{ color: '#9C8060', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>{s.nameEn}</span>
          </p>
          <p className="text-[11px] mt-0.5 mb-2" style={{ color: '#9C8060' }}>{s.location}</p>
          <p className="text-[12px] leading-relaxed mb-3" style={{ color: '#5A4A3A' }}>{s.desc}</p>
          <div className="flex gap-2">
            <button onClick={() => setAdded((p) => p.includes(s.id) ? p.filter((i) => i !== s.id) : [...p, s.id])}
              className="px-3 py-1 rounded-lg text-[11px] font-medium"
              style={{ background: added.includes(s.id) ? '#2B2015' : '#E8DFCC', color: added.includes(s.id) ? '#F7F3EA' : '#5A4A3A' }}>
              {added.includes(s.id) ? '✓ 已加入' : '+ 加入行程'}
            </button>
            <button className="px-3 py-1 rounded-lg text-[11px]" style={{ background: '#E8DFCC', color: '#5A4A3A' }}>地圖</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 記帳面板 ────────────────────────────────────────────────
function BudgetPanel({ expenses, currentDay, onAdd, onRemove }) {
  const [form, setForm] = useState({ name: '', jpy: '', category: '餐飲' });
  const [showForm, setShowForm] = useState(false);
  const [jpyInput, setJpyInput] = useState('');

  const todayExp = expenses.filter((e) => e.day === currentDay.day);
  const totalJPY = todayExp.reduce((s, e) => s + Number(e.jpy), 0);

  return (
    <div className="p-4 space-y-4">
      {/* 今日小計 */}
      <div className="rounded-xl p-4" style={{ background: '#F0EAD8' }}>
        <p className="text-[12px] mb-1" style={{ color: '#9C8060' }}>本日支出 Day {currentDay.day}</p>
        <p className="text-[26px] font-bold" style={{ color: '#2B2015', fontFamily: "'Playfair Display',serif" }}>
          NT$ {Math.round(totalJPY * RATE).toLocaleString()}
        </p>
        <p className="text-[12px]" style={{ color: '#9C8060' }}>¥{totalJPY.toLocaleString()} JPY</p>
      </div>

      {/* 換算器 */}
      <div className="rounded-xl p-4" style={{ background: '#F7F3EA', border: '1px solid #E8DFCC' }}>
        <p className="text-[11px] mb-2" style={{ color: '#C4956A', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>匯率換算 Currency</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-1.5 rounded-lg px-2.5 py-2" style={{ background: '#F2EAD6', border: '1px solid #E8DFCC' }}>
            <span className="text-[12px] font-medium" style={{ color: '#5A4A3A' }}>¥</span>
            <input type="number" value={jpyInput} onChange={(e) => setJpyInput(e.target.value)} placeholder="0"
              className="flex-1 bg-transparent text-[14px] outline-none min-w-0" style={{ color: '#2B2015', fontFamily: "'Playfair Display',serif" }} />
          </div>
          <span style={{ color: '#9C8060' }}>→</span>
          <div className="flex-1 flex items-center gap-1.5 rounded-lg px-2.5 py-2" style={{ background: '#F2EAD6', border: '1px solid #E8DFCC' }}>
            <span className="text-[12px] font-medium" style={{ color: '#5A4A3A' }}>NT$</span>
            <span className="text-[14px]" style={{ color: jpyInput ? '#2B2015' : '#B0A090', fontFamily: "'Playfair Display',serif" }}>
              {jpyInput ? Math.round(parseFloat(jpyInput) * RATE).toLocaleString() : '0'}
            </span>
          </div>
        </div>
      </div>

      {/* 支出清單 */}
      {todayExp.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ background: '#F7F3EA', border: '1px solid #E8DFCC' }}>
          {todayExp.map((e, i) => (
            <div key={e.id}>
              <div className="flex items-center gap-2.5 px-4 py-2.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${CAT_COLOR[e.category]}22`, color: CAT_COLOR[e.category] }}>{e.category}</span>
                <span className="flex-1 text-[13px]" style={{ color: '#2B2015' }}>{e.name}</span>
                <span className="text-[13px] font-bold" style={{ color: '#2B2015', fontFamily: "'Playfair Display',serif" }}>¥{Number(e.jpy).toLocaleString()}</span>
                <button onClick={() => onRemove(e.id)} className="opacity-40 hover:opacity-80 ml-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5A4A3A" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              {i < todayExp.length - 1 && <div style={{ borderTop: '1px dashed #E8DFCC', marginInline: '16px' }} />}
            </div>
          ))}
        </div>
      )}

      {/* 新增表單 */}
      {showForm ? (
        <div className="rounded-xl p-4 space-y-2.5" style={{ background: '#F7F3EA', border: '1px solid #C4956A' }}>
          <input type="text" placeholder="支出名稱" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg px-3 py-2 text-[13px] outline-none" style={{ background: '#F2EAD6', color: '#2B2015', border: '1px solid #E8DFCC' }} />
          <div className="flex gap-2">
            <input type="number" placeholder="金額 JPY" value={form.jpy} onChange={(e) => setForm((f) => ({ ...f, jpy: e.target.value }))}
              className="flex-1 rounded-lg px-3 py-2 text-[13px] outline-none" style={{ background: '#F2EAD6', color: '#2B2015', border: '1px solid #E8DFCC' }} />
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="rounded-lg px-2 py-2 text-[12px] outline-none" style={{ background: '#F2EAD6', color: '#5A4A3A', border: '1px solid #E8DFCC' }}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.name && form.jpy) { onAdd({ ...form, day: currentDay.day }); setForm({ name: '', jpy: '', category: '餐飲' }); setShowForm(false); } }}
              className="flex-1 py-2 rounded-lg text-[13px] font-medium" style={{ background: '#2B2015', color: '#F7F3EA' }}>記錄</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-[13px]" style={{ background: '#E8DFCC', color: '#5A4A3A' }}>取消</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2"
          style={{ background: '#2B2015', color: '#F7F3EA' }}>
          <span className="text-[18px] leading-none">+</span> 新增支出
        </button>
      )}
    </div>
  );
}

// ── 主元件 ──────────────────────────────────────────────────
export default function DesktopRightPanel({ tab, day, trip, expenses, onAdd, onRemove }) {
  const content = () => {
    switch (tab) {
      case 'map':
        return (
          <>
            <MiniMap day={day} />
            <div className="p-4">
              <p className="text-[12px] mb-2" style={{ color: '#9C8060' }}>今日 {day.schedules.length} 個景點</p>
              <div className="space-y-1.5">
                {day.schedules.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl" style={{ background: '#F7F3EA' }}>
                    <span className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-none" style={{ background: '#C4956A' }}>{i + 1}</span>
                    <span className="text-[13px] flex-1" style={{ color: '#2B2015' }}>{s.name}</span>
                    <span className="text-[11px]" style={{ color: '#9C8060', fontFamily: "'Playfair Display',serif" }}>{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'spots':
        return <SpotsPanel spots={trip.savedSpots} />;
      case 'budget':
        return <BudgetPanel expenses={expenses} currentDay={day} onAdd={onAdd} onRemove={onRemove} />;
      default: // schedule — 顯示住宿 + 快覽
        return (
          <div className="p-4 space-y-4">
            {/* Mini 地圖（行程頁也顯示小地圖） */}
            <div className="rounded-xl overflow-hidden">
              <MiniMap day={day} />
            </div>
            {/* 住宿資訊 */}
            <div className="rounded-xl p-4" style={{ background: '#F7F3EA', border: '1px solid #E8DFCC' }}>
              <p className="text-[11px] mb-2" style={{ color: '#C4956A', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Hotel</p>
              <p className="text-[15px] font-medium" style={{ color: '#2B2015' }}>{trip.hotel.name}</p>
              <p className="text-[12px] mt-0.5" style={{ color: '#9C8060' }}>{trip.hotel.nameEn}</p>
              <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '1px dashed #DDD3C0' }}>
                <span className="text-[12px]" style={{ color: '#5A4A3A' }}>{trip.hotel.checkIn} ～ {trip.hotel.checkOut}</span>
                <span className="text-[15px] font-bold" style={{ color: '#2B2015', fontFamily: "'Playfair Display',serif" }}>¥{trip.hotel.totalJPY.toLocaleString()}</span>
              </div>
            </div>
            {/* 行程快覽 */}
            <div className="rounded-xl p-4" style={{ background: '#F7F3EA', border: '1px solid #E8DFCC' }}>
              <p className="text-[11px] mb-2.5" style={{ color: '#C4956A', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Today at a Glance</p>
              <div className="space-y-1.5">
                {day.schedules.slice(0, 4).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <span className="text-[12px] w-10 flex-none text-right" style={{ color: '#9C8060', fontFamily: "'Playfair Display',serif" }}>{s.time}</span>
                    <div className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: '#C4956A' }} />
                    <span className="text-[13px] truncate" style={{ color: '#2B2015' }}>{s.name}</span>
                  </div>
                ))}
                {day.schedules.length > 4 && (
                  <p className="text-[11px] text-center pt-1" style={{ color: '#9C8060' }}>還有 {day.schedules.length - 4} 個行程</p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };
  return <div className="h-full overflow-y-auto">{content()}</div>;
}
