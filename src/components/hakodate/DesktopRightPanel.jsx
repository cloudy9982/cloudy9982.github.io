// ============================================================
// DesktopRightPanel — 右側輔助面板
// • 行程 tab → 迷你地圖 + 住宿快覽
// • 地圖 tab → 景點列表（雙向連動）
// • 記帳 tab → 今日小計 + 結算統計
// ============================================================
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CAT_COLOR = { 餐飲: '#C4956A', 交通: '#7A9E9E', 購物: '#9C8080', 住宿: '#8A9C70', 景點: '#9C8060', 其他: '#A09090' };

// 將時間戳格式化為 yyyy-MM-dd HH:mm
function fmtTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ── 迷你地圖（僅行程 tab 使用）────────────────────────────────
function MiniMap({ day }) {
  const ref = useRef(null);
  const inst = useRef(null);
  const spots = day.schedules.filter((s) => s.lat && s.lng);

  useEffect(() => {
    if (inst.current) { inst.current.remove(); inst.current = null; }
    if (!ref.current || !spots.length) return;
    const map = L.map(ref.current, { center: [spots[0].lat, spots[0].lng], zoom: 12, zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    spots.forEach((s, i) => {
      L.marker([s.lat, s.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="background:#C4956A;width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;">
            <span style="transform:rotate(45deg);color:white;font-size:8px;font-weight:bold;">${i + 1}</span></div>`,
          iconSize: [18, 18], iconAnchor: [9, 18],
        }),
      }).bindPopup(`<b style="font-size:11px">${s.name}</b>`).addTo(map);
    });
    if (spots.length > 1) map.fitBounds(L.latLngBounds(spots.map((s) => [s.lat, s.lng])), { padding: [15, 15] });
    inst.current = map;
    return () => { map.remove(); inst.current = null; };
  }, [day.day]);

  return <div ref={ref} style={{ height: '220px', background: '#E8E0CC' }} className="rounded-xl overflow-hidden" />;
}

// ── 結算計算 ───────────────────────────────────────────────────
function calcSettlement(expenses) {
  let ikeShare = 0;
  let ikePaid  = 0;
  expenses.forEach((e) => {
    const jpy = Number(e.jpy);
    if (e.payer === 'Ike') ikePaid += jpy;
    if (e.split === 'half')   ikeShare += jpy / 2;
    if (e.split === 'ike')    ikeShare += jpy;
    // split === 'cloudy' → ikeShare += 0
  });
  const balance = ikeShare - ikePaid; // + = Ike 欠 Cloudy；- = Cloudy 欠 Ike
  return { ikeShare, ikePaid, cloudyShare: expenses.reduce((s,e)=>s+Number(e.jpy),0) - ikeShare, balance };
}

// ── 主元件 ─────────────────────────────────────────────────────
export default function DesktopRightPanel({ tab, day, trip, expenses, onAdd, onRemove, activeSpotId, onSpotClick, fx }) {
  const rate    = fx?.rate ?? 0.21;
  const fxReady = fx && fx.lastUpdated;
  const twd     = (jpy) => Math.round(Number(jpy) * rate);

  // ── 行程 tab ──────────────────────────────────────────────
  if (tab === 'schedule') {
    return (
      <div className="p-4 space-y-4">
        <MiniMap day={day} />
        {/* 住宿資訊 */}
        <div className="rounded-xl p-4" style={{ background: '#F7F3EA', border: '1px solid #E8DFCC' }}>
          <p className="text-[11px] mb-2" style={{ color: '#C4956A', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Hotel</p>
          <p className="text-[15px] font-medium" style={{ color: '#2B2015' }}>{trip.hotel.name}</p>
          <p className="text-[12px] mt-0.5" style={{ color: '#9C8060' }}>{trip.hotel.nameEn}</p>
          <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '1px dashed #DDD3C0' }}>
            <span className="text-[12px]" style={{ color: '#5A4A3A' }}>{trip.hotel.checkIn} ～ {trip.hotel.checkOut}</span>
            <span className="text-[15px] font-bold" style={{ color: '#2B2015', fontFamily: "'Playfair Display',serif" }}>
              ¥{trip.hotel.totalJPY.toLocaleString()}
            </span>
          </div>
        </div>
        {/* 今日快覽 */}
        <div className="rounded-xl p-4" style={{ background: '#F7F3EA', border: '1px solid #E8DFCC' }}>
          <p className="text-[11px] mb-2.5" style={{ color: '#C4956A', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>Today at a Glance</p>
          <div className="space-y-1.5">
            {day.schedules.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center gap-2.5">
                <span className="text-[12px] w-10 flex-none text-right" style={{ color: '#9C8060', fontFamily: "'Playfair Display',serif" }}>{s.time}</span>
                <div className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: '#C4956A' }} />
                <span className="text-[13px] truncate" style={{ color: '#2B2015' }}>{s.name}</span>
              </div>
            ))}
            {day.schedules.length > 5 && (
              <p className="text-[11px] text-center pt-1" style={{ color: '#9C8060' }}>還有 {day.schedules.length - 5} 個行程</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 地圖 tab：景點列表雙向連動 ────────────────────────────
  if (tab === 'map') {
    const spots = day.schedules.filter((s) => s.lat && s.lng);
    return (
      <div className="p-4 space-y-2">
        <p className="text-[12px] pb-1" style={{ color: '#9C8060' }}>今日 {spots.length} 個景點 · 點擊跳至地圖</p>
        {spots.map((s, i) => {
          const isActive = s.id === activeSpotId;
          return (
            <button key={s.id} onClick={() => onSpotClick(isActive ? null : s.id)}
              className="w-full text-left rounded-xl px-4 py-3 transition-all"
              style={{
                background: isActive ? '#2B2015' : '#F7F3EA',
                border: isActive ? 'none' : '1px solid #E8DFCC',
                boxShadow: isActive ? '0 2px 8px rgba(44,32,21,0.15)' : 'none',
              }}>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center flex-none"
                  style={{ background: isActive ? '#C4956A' : '#E8DFCC', color: isActive ? 'white' : '#5A4A3A' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: isActive ? '#F7F3EA' : '#2B2015' }}>{s.name}</p>
                  <p className="text-[11px] truncate" style={{ color: isActive ? '#BDB0A0' : '#9C8060' }}>{s.location}</p>
                </div>
                <span className="text-[12px] flex-none" style={{ color: isActive ? '#C4956A' : '#9C8060', fontFamily: "'Playfair Display',serif" }}>
                  {s.time}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // ── 記帳 tab：今日 + 全程結算統計 ──────────────────────────
  if (tab === 'budget') {
    const todayExp  = expenses.filter((e) => e.day === day.day);
    const todayJPY  = todayExp.reduce((s, e) => s + Number(e.jpy), 0);
    const { ikeShare, cloudyShare, ikePaid, balance } = calcSettlement(expenses);
    const totalJPY  = expenses.reduce((s, e) => s + Number(e.jpy), 0);
    const cloudyPaid = totalJPY - ikePaid;

    const absBalance = Math.abs(balance);
    const debtor   = balance > 0 ? 'Ike' : 'Cloudy';
    const creditor = balance > 0 ? 'Cloudy' : 'Ike';

    return (
      <div className="p-4 space-y-4">
        {/* 今日小計 */}
        <div className="rounded-xl p-4" style={{ background: '#F0EAD8' }}>
          <p className="text-[11px] mb-1" style={{ color: '#9C8060' }}>本日支出 Day {day.day}</p>
          <p className="text-[28px] font-bold" style={{ color: '#2B2015', fontFamily: "'Playfair Display',serif" }}>
            {fxReady ? `NT$${twd(todayJPY).toLocaleString()}` : <span style={{ color: '#B0A090' }}>計算中…</span>}
          </p>
          <p className="text-[12px] mt-0.5" style={{ color: '#9C8060' }}>¥{todayJPY.toLocaleString()} JPY</p>
          <p className="text-[12px] mt-2" style={{ color: '#7A6A5A' }}>共 {todayExp.length} 筆</p>
        </div>

        {/* 全程支付統計 */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: '#F7F3EA', border: '1px solid #E8DFCC' }}>
          <p className="text-[11px]" style={{ color: '#C4956A', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>全程支付統計</p>
          {[
            { name: 'Cloudy', share: cloudyShare, paid: cloudyPaid, color: '#C4956A' },
            { name: 'Ike',    share: ikeShare,    paid: ikePaid,    color: '#7A9E9E' },
          ].map((p) => (
            <div key={p.name} className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                <span className="text-[13px] font-medium" style={{ color: '#2B2015' }}>{p.name}</span>
                <span className="text-[12px]" style={{ color: '#9C8060' }}>
                  應付 ¥{Math.round(p.share).toLocaleString()} · 實付 ¥{Math.round(p.paid).toLocaleString()}
                </span>
              </div>
              {/* 進度條 */}
              {totalJPY > 0 && (
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#E8DFCC' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(p.paid / totalJPY) * 100}%`, background: p.color }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 最終結算 */}
        <div className="rounded-xl p-5" style={{ background: '#2B2015' }}>
          <p className="text-[11px] mb-3" style={{ color: '#9C8060' }}>最終結算</p>
          {absBalance < 1 ? (
            <p className="text-[16px] font-medium" style={{ color: '#F7F3EA' }}>🎉 已結清，無需轉帳</p>
          ) : (
            <>
              <p className="text-[13px] mb-1" style={{ color: '#BDB0A0' }}>
                <span style={{ color: '#C4956A', fontWeight: 600 }}>{debtor}</span>
                {' 應付給 '}
                <span style={{ color: '#C4956A', fontWeight: 600 }}>{creditor}</span>
              </p>
              <p className="text-[28px] font-bold" style={{ color: '#F7F3EA', fontFamily: "'Playfair Display',serif" }}>
                {fxReady ? `NT$${twd(absBalance).toLocaleString()}` : <span style={{ color: '#9C8060' }}>計算中…</span>}
              </p>
              <p className="text-[13px] mt-1" style={{ color: '#9C8060' }}>
                ¥{Math.round(absBalance).toLocaleString()} JPY
              </p>
            </>
          )}
        </div>

        {/* 匯率換算器 */}
        <BudgetConverter fx={fx} />
      </div>
    );
  }

  return null;
}

// ── 匯率換算小組件 ───────────────────────────────────────────
function BudgetConverter({ fx }) {
  const [jpy, setJpy] = useState('');
  const rate     = fx?.rate ?? 0.21;
  const loading  = !!fx?.loading;
  const isFb     = !!fx?.isFallback;
  const updated  = fx?.lastUpdated;
  const showNT   = jpy && (!loading || updated);   // 已有過快取也能即時換算

  return (
    <div className="rounded-xl p-4" style={{ background: '#F7F3EA', border: '1px solid #E8DFCC' }}>
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px]" style={{ color: '#C4956A', fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>匯率換算</p>
        <button
          onClick={() => fx?.refresh?.()}
          disabled={loading}
          title="重新抓取匯率"
          className="flex items-center justify-center w-6 h-6 rounded-full transition-opacity"
          style={{ background: '#E8DFCC', opacity: loading ? 0.5 : 1 }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5A4A3A" strokeWidth="2.5"
            className={loading ? 'animate-spin' : ''}>
            <path d="M21 12a9 9 0 11-3-6.7L21 8" /><path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1.5 rounded-lg px-2.5 py-2" style={{ background: '#F2EAD6', border: '1px solid #E8DFCC' }}>
          <span className="text-[12px] font-medium flex-none" style={{ color: '#5A4A3A' }}>¥</span>
          <input type="number" value={jpy} onChange={(e) => setJpy(e.target.value)} placeholder="0"
            className="flex-1 bg-transparent text-[14px] outline-none min-w-0" style={{ color: '#2B2015', fontFamily: "'Playfair Display',serif" }} />
        </div>
        <span style={{ color: '#9C8060' }}>→</span>
        <div className="flex-1 flex items-center gap-1.5 rounded-lg px-2.5 py-2" style={{ background: '#F2EAD6', border: '1px solid #E8DFCC' }}>
          <span className="text-[12px] font-medium flex-none" style={{ color: '#5A4A3A' }}>NT$</span>
          <span className="text-[14px]" style={{ color: showNT ? '#2B2015' : '#B0A090', fontFamily: "'Playfair Display',serif" }}>
            {loading && !updated
              ? '載入中…'
              : showNT
                ? Math.round(parseFloat(jpy) * rate).toLocaleString()
                : '0'}
          </span>
        </div>
      </div>

      {/* 匯率資訊揭露 */}
      <div className="mt-3 pt-2.5 space-y-0.5" style={{ borderTop: '1px dashed #DDD3C0' }}>
        <p className="text-[10px]" style={{ color: '#9C8060' }}>
          1 JPY = <span style={{ color: '#5A4A3A', fontFamily: "'Playfair Display',serif" }}>{rate.toFixed(4)}</span> TWD
          {isFb && <span style={{ color: '#C4956A', marginLeft: 6 }}>· 保底匯率</span>}
        </p>
        <p className="text-[10px]" style={{ color: '#9C8060' }}>
          數據來源：臺灣銀行當日匯率參考
        </p>
        <p className="text-[10px]" style={{ color: '#B0A090' }}>
          最後更新：{updated ? fmtTime(updated) : (loading ? '抓取中…' : '尚未更新')}
        </p>
        {fx?.error && !isFb && (
          <p className="text-[10px]" style={{ color: '#C4956A' }}>⚠ {fx.error}（沿用快取匯率）</p>
        )}
        {fx?.error && isFb && (
          <p className="text-[10px]" style={{ color: '#C4956A' }}>⚠ 無法取得即時匯率，已套用保底值 0.21</p>
        )}
      </div>
    </div>
  );
}
