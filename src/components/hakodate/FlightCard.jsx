// ============================================================
// FlightCard — 可展開的航班資訊卡（動畫 accordion）
// ============================================================
import React from 'react';

function FlightRow({ flight, label }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: '#F2EAD6', border: '1px solid #E8DFCC' }}
    >
      {/* 標籤 */}
      <p
        className="text-[11px] tracking-widest mb-3 font-medium"
        style={{ color: '#C4956A', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
      >
        {label}
      </p>

      {/* 主要航班資訊 */}
      <div className="flex items-center gap-4">
        {/* 出發 */}
        <div className="text-center">
          <p className="text-[28px] font-bold leading-none" style={{ color: '#2B2015', fontFamily: "'Playfair Display', serif" }}>
            {flight.departTime}
          </p>
          <p className="text-[13px] mt-1 font-medium" style={{ color: '#5A4A3A' }}>{flight.from}</p>
          <p className="text-[11px]" style={{ color: '#9C8060' }}>{flight.fromCity}</p>
        </div>

        {/* 飛行路徑 */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[12px]" style={{ color: '#9C8060' }}>{flight.duration}</span>
          <div className="w-full relative flex items-center">
            <div className="flex-1 h-px" style={{ background: '#C4956A' }} />
            <svg className="mx-1 flex-none" width="20" height="20" viewBox="0 0 24 24" fill="#C4956A">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
            </svg>
            <div className="flex-1 h-px" style={{ background: '#C4956A' }} />
          </div>
          <span className="text-[11px]" style={{ color: '#9C8060' }}>{flight.date}</span>
        </div>

        {/* 抵達 */}
        <div className="text-center">
          <p className="text-[28px] font-bold leading-none" style={{ color: '#2B2015', fontFamily: "'Playfair Display', serif" }}>
            {flight.arriveTime}
          </p>
          <p className="text-[13px] mt-1 font-medium" style={{ color: '#5A4A3A' }}>{flight.to}</p>
          <p className="text-[11px]" style={{ color: '#9C8060' }}>{flight.toCity}</p>
        </div>
      </div>

      {/* 航班細節 */}
      <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px dashed #DDD3C0' }}>
        <span
          className="text-[12px] px-2.5 py-1 rounded-full font-medium"
          style={{ background: '#C4956A22', color: '#C4956A' }}
        >
          {flight.airline}
        </span>
        <span className="text-[12px]" style={{ color: '#7A6A5A' }}>
          {flight.aircraft} · {flight.flightNo}
        </span>
        <span
          className="text-[12px] px-2.5 py-1 rounded-full ml-auto"
          style={{ background: '#E8DFCC', color: '#5A4A3A' }}
        >
          {flight.cabin}
        </span>
      </div>
    </div>
  );
}

export default function FlightCard({ flights, expanded, onToggle }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#F7F3EA', boxShadow: '0 2px 12px rgba(44,32,21,0.06)' }}
    >
      {/* 觸發列 */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#F0EAD8]"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#2B2015' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-[15px] font-medium" style={{ color: '#2B2015' }}>出發資訊 · 航班時刻表</p>
            <p className="text-[12px] mt-0.5" style={{ color: '#9C8060' }}>
              {flights.outbound.flightNo} · {flights.inbound.flightNo}
            </p>
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
          style={{
            background: '#E8DFCC',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A4A3A" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* 展開內容 */}
      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          maxHeight: expanded ? '600px' : '0px',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="px-6 pb-6 space-y-3">
          <FlightRow flight={flights.outbound} label="去程 Outbound" />
          <FlightRow flight={flights.inbound} label="回程 Inbound" />
        </div>
      </div>
    </div>
  );
}
