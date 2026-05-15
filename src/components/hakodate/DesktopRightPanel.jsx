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
  }, [day.day, day.schedules]);

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
export default function DesktopRightPanel({
  tab, day, trip, expenses, onAdd, onRemove, activeSpotId, onSpotClick, fx,
  settlements = [], onSettle, onUndoSettle,
}) {
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
          const gmapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name} 函館`)}`;
          return (
            <div
              key={s.id}
              className="rounded-xl flex items-stretch overflow-hidden transition-all"
              style={{
                background: isActive ? '#2B2015' : '#F7F3EA',
                border: isActive ? 'none' : '1px solid #E8DFCC',
                boxShadow: isActive ? '0 2px 8px rgba(44,32,21,0.15)' : 'none',
              }}
            >
              {/* 左：跳到地圖 */}
              <button
                onClick={() => onSpotClick(isActive ? null : s.id)}
                className="flex-1 min-w-0 text-left px-4 py-3"
              >
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

              {/* 右：在 Google Maps 開啟 */}
              <a
                href={gmapsHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={`在 Google Maps 開啟「${s.name}」`}
                aria-label={`在 Google Maps 開啟 ${s.name}`}
                className="flex items-center justify-center px-3 flex-none transition-opacity hover:opacity-80"
                style={{
                  borderLeft: '1px solid ' + (isActive ? 'rgba(247,243,234,0.15)' : '#E8DFCC'),
                  color: isActive ? '#C4956A' : '#9C8060',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </a>
            </div>
          );
        })}
      </div>
    );
  }

  // ── 記帳 tab：今日 + 全程結算統計 ──────────────────────────
  if (tab === 'budget') {
    const todayExp  = expenses.filter((e) => e.day === day.day);
    const todayJPY  = todayExp.reduce((s, e) => s + Number(e.jpy), 0);

    // 全程統計（含已結清紀錄）— 給「全程支付統計」用，永遠呈現完整歷史
    const fullStats = calcSettlement(expenses);
    const { ikeShare, cloudyShare, ikePaid } = fullStats;
    const totalJPY  = expenses.reduce((s, e) => s + Number(e.jpy), 0);
    const cloudyPaid = totalJPY - ikePaid;

    // 未結清差額 — 給「最終結算」用，排除已被任何結算紀錄覆蓋的 expense
    const coveredIds = new Set(settlements.flatMap((s) => s.coveredExpenseIds || []));
    const pendingExpenses = expenses.filter((e) => !coveredIds.has(e.id));
    const { balance } = calcSettlement(pendingExpenses);

    const absBalance = Math.abs(balance);
    const debtor   = balance > 0 ? 'Ike' : 'Cloudy';
    const creditor = balance > 0 ? 'Cloudy' : 'Ike';
    const hasPending = pendingExpenses.length > 0 && absBalance >= 1;
    const isSettled  = !hasPending && settlements.length > 0 && expenses.length > 0;

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
        <SettlementCard
          hasPending={hasPending}
          isSettled={isSettled}
          balance={absBalance}
          debtor={debtor}
          creditor={creditor}
          fxReady={fxReady}
          twd={twd}
          onSettle={onSettle}
          onUndoSettle={onUndoSettle}
          lastSettlement={settlements[settlements.length - 1]}
        />

        {/* 匯率換算器 */}
        <BudgetConverter fx={fx} />
      </div>
    );
  }

  return null;
}

// ── 結算卡片 + Confetti ───────────────────────────────────────
// 噴砂動畫 CSS 注入：與 DesktopMapView 的 pulse 注入相同的 singleton 模式
let confettiStyleInjected = false;
function injectConfettiStyle() {
  if (confettiStyleInjected) return;
  const s = document.createElement('style');
  s.textContent = `
    @keyframes hkd-confetti {
      0%   { transform: translate3d(0,0,0) rotate(0deg);    opacity: 1; }
      100% { transform: translate3d(var(--dx,0px), 220px, 0) rotate(720deg); opacity: 0; }
    }
  `;
  document.head.appendChild(s);
  confettiStyleInjected = true;
}

const CONFETTI_COLORS = ['#C4956A', '#F7F3EA', '#7A9E9E', '#E8DFCC', '#8A9C70'];

function Confetti({ active }) {
  useEffect(() => { if (active) injectConfettiStyle(); }, [active]);
  if (!active) return null;
  const pieces = Array.from({ length: 28 }).map((_, i) => {
    const left = 5 + Math.random() * 90;
    const dx   = (Math.random() * 80 - 40).toFixed(0);
    const delay = (Math.random() * 0.35).toFixed(2);
    const duration = (1.4 + Math.random() * 0.8).toFixed(2);
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const isCircle = i % 2 === 0;
    return (
      <span key={i}
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: 0,
          width: '7px',
          height: '7px',
          background: color,
          borderRadius: isCircle ? '50%' : '2px',
          animation: `hkd-confetti ${duration}s cubic-bezier(.2,.7,.6,1) ${delay}s forwards`,
          '--dx': `${dx}px`,
        }}
      />
    );
  });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 'inherit' }}>
      {pieces}
    </div>
  );
}

function SettlementCard({ hasPending, isSettled, balance, debtor, creditor, fxReady, twd, onSettle, onUndoSettle, lastSettlement }) {
  const [confetti, setConfetti] = useState(false);

  const handleSettle = () => {
    if (!hasPending) return;
    if (!window.confirm('是否確認雙方已完成現金交割？')) return;
    onSettle?.();
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2200);
  };

  return (
    <div className="relative rounded-xl p-5 overflow-hidden" style={{ background: '#2B2015' }}>
      <p className="text-[11px] mb-3" style={{ color: '#9C8060' }}>最終結算</p>

      {hasPending ? (
        <>
          <p className="text-[13px] mb-1" style={{ color: '#BDB0A0' }}>
            <span style={{ color: '#C4956A', fontWeight: 600 }}>{debtor}</span>
            {' 應付給 '}
            <span style={{ color: '#C4956A', fontWeight: 600 }}>{creditor}</span>
          </p>
          <p className="text-[28px] font-bold" style={{ color: '#F7F3EA', fontFamily: "'Playfair Display',serif" }}>
            {fxReady ? `NT$${twd(balance).toLocaleString()}` : <span style={{ color: '#9C8060' }}>計算中…</span>}
          </p>
          <p className="text-[13px] mt-1" style={{ color: '#9C8060' }}>
            ¥{Math.round(balance).toLocaleString()} JPY
          </p>

          <button
            onClick={handleSettle}
            className="w-full mt-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
            style={{
              background: 'rgba(247,243,234,0.08)',
              color: '#F7F3EA',
              border: '1px solid rgba(196,149,106,0.45)',
            }}
          >
            確認已結清
          </button>
        </>
      ) : (
        <>
          <p className="text-[16px] font-medium" style={{ color: '#F7F3EA' }}>🎉 已結清，無需轉帳</p>
          {isSettled && (
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px dashed rgba(196,149,106,0.3)' }}>
              <span className="text-[11px]" style={{ color: '#9C8060' }}>
                {lastSettlement ? fmtTime(new Date(lastSettlement.settledAt).getTime()) : ''} 結算
              </span>
              <button
                onClick={onUndoSettle}
                className="text-[11px] underline transition-opacity hover:opacity-80"
                style={{ color: '#C4956A' }}
              >
                撤銷結算
              </button>
            </div>
          )}
        </>
      )}

      <Confetti active={confetti} />
    </div>
  );
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
