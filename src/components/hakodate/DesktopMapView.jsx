// ============================================================
// DesktopMapView — 左主區域全版地圖
// 含：geolocation、脈衝定位點、雙向標記互動、回至中心
// ============================================================
import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 注入脈衝動畫 CSS（只需注入一次）
// 插入彈窗 HTML 字串時用，避免地點名稱含 < > " 等字元破壞結構
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

let pulseStyleInjected = false;
function injectPulseStyle() {
  if (pulseStyleInjected) return;
  const s = document.createElement('style');
  s.textContent = `
    @keyframes hkd-pulse {
      0%   { transform:scale(1); opacity:.8; }
      100% { transform:scale(2.8); opacity:0; }
    }
    .hkd-user-dot { animation: hkd-pulse 1.6s ease-out infinite; }
  `;
  document.head.appendChild(s);
  pulseStyleInjected = true;
}

function makeSpotIcon(index, isActive) {
  const size = isActive ? 30 : 24;
  const bg = isActive ? '#8B6040' : '#C4956A';
  return L.divIcon({
    className: '',
    html: `<div style="background:${bg};width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,${isActive ? '.4' : '.25'});display:flex;align-items:center;justify-content:center;transition:all .2s;">
      <span style="transform:rotate(45deg);color:white;font-size:${isActive ? 11 : 9}px;font-weight:bold;">${index + 1}</span>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size - 4],
  });
}

function makeUserIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:18px;height:18px;">
      <div class="hkd-user-dot" style="position:absolute;inset:0;background:#3B82F6;border-radius:50%;opacity:.6;"></div>
      <div style="position:absolute;inset:2px;background:#3B82F6;border-radius:50%;border:2px solid white;box-shadow:0 2px 8px rgba(59,130,246,.6);z-index:1;"></div>
    </div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

export default function DesktopMapView({ day, activeSpotId, onSpotClick }) {
  const mapRef        = useRef(null);
  const mapInst       = useRef(null);
  const markersRef    = useRef({});   // { scheduleId: L.Marker }
  const userMarkerRef = useRef(null);

  const [userPos, setUserPos]     = useState(null);
  const [locating, setLocating]   = useState(false);
  const [geoError, setGeoError]   = useState(null);

  const spots = day.schedules.filter((s) => s.lat && s.lng);

  // ── 初始化地圖 ─────────────────────────────────────────────
  useEffect(() => {
    injectPulseStyle();
    if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
    markersRef.current = {};
    if (!mapRef.current || !spots.length) return;

    const map = L.map(mapRef.current, {
      center: [spots[0].lat, spots[0].lng],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OSM © CartoDB',
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    spots.forEach((s, i) => {
      const marker = L.marker([s.lat, s.lng], {
        icon: makeSpotIcon(i, false),
      }).addTo(map);

      const query = encodeURIComponent(`${s.name} 函館`);
      marker.bindPopup(
        `<div style="font-family:'Noto Serif TC',serif;min-width:160px;padding:2px 0;">
          <p style="font-size:13px;font-weight:600;color:#2B2015;margin:0 0 3px;">${escapeHtml(s.name)}</p>
          <p style="font-size:11px;color:#9C8060;margin:0 0 2px;">${escapeHtml(s.location)}</p>
          <p style="font-size:11px;color:#C4956A;margin:0 0 8px;font-style:italic;">${escapeHtml(s.time)}</p>
          <a href="https://www.google.com/maps/search/?api=1&query=${query}" target="_blank" rel="noopener noreferrer"
             style="display:inline-flex;align-items:center;gap:5px;font-size:11px;color:#5A4A3A;background:#F0EAD8;padding:5px 9px;border-radius:6px;text-decoration:none;font-weight:500;border:1px solid #E8DFCC;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            在 Google 地圖中查看
          </a>
        </div>`,
        { maxWidth: 240, className: 'hkd-popup' }
      );
      marker.on('click', () => onSpotClick(s.id));
      markersRef.current[s.id] = { marker, index: i, spot: s };
    });

    if (spots.length > 1) {
      map.fitBounds(L.latLngBounds(spots.map((s) => [s.lat, s.lng])), { padding: [50, 50] });
    }

    mapInst.current = map;
    return () => { map.remove(); mapInst.current = null; };
    // 重建地圖：日次切換、或當日行程被新增/修改/刪除（陣列 reference 改變）
  }, [day.day, day.schedules]);

  // ── 同步 activeSpotId：更換 icon 並飛至該點 ────────────────
  useEffect(() => {
    if (!mapInst.current) return;
    Object.entries(markersRef.current).forEach(([id, { marker, index }]) => {
      marker.setIcon(makeSpotIcon(index, id === activeSpotId));
    });
    if (activeSpotId && markersRef.current[activeSpotId]) {
      const { marker } = markersRef.current[activeSpotId];
      mapInst.current.flyTo(marker.getLatLng(), 15, { duration: 0.8 });
      marker.openPopup();
    }
  }, [activeSpotId]);

  // ── 定位使用者 ─────────────────────────────────────────────
  const locateUser = useCallback(() => {
    if (!navigator.geolocation) { setGeoError('瀏覽器不支援定位'); return; }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setLocating(false);
        const pos = [latitude, longitude];
        setUserPos(pos);
        if (!mapInst.current) return;
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(pos);
        } else {
          userMarkerRef.current = L.marker(pos, { icon: makeUserIcon(), zIndexOffset: 1000 })
            .bindPopup('<span style="font-size:12px;color:#3B82F6;">📍 你的位置</span>')
            .addTo(mapInst.current);
        }
        mapInst.current.flyTo(pos, 15, { duration: 0.8 });
      },
      (err) => { setLocating(false); setGeoError(err.message.slice(0, 30)); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ── 回至中心 ───────────────────────────────────────────────
  const flyToCenter = useCallback(() => {
    if (!mapInst.current) return;
    if (userPos) {
      mapInst.current.flyTo(userPos, 15, { duration: 0.8 });
    } else if (spots.length > 1) {
      mapInst.current.fitBounds(
        L.latLngBounds(spots.map((s) => [s.lat, s.lng])),
        { padding: [50, 50], duration: 0.8 }
      );
    } else if (spots.length === 1) {
      mapInst.current.flyTo([spots[0].lat, spots[0].lng], 14, { duration: 0.8 });
    }
  }, [userPos, spots]);

  return (
    <div className="relative w-full h-[55vh] md:h-full md:rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(44,32,21,0.12)' }}>
      {/* 地圖本體 */}
      <div ref={mapRef} className="w-full h-full" style={{ background: '#E8E0CC' }} />

      {/* 浮動控制面板 */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1000]">
        {/* 定位按鈕 */}
        <button
          onClick={locateUser}
          disabled={locating}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-medium shadow-lg transition-opacity"
          style={{ background: '#2B2015', color: '#F7F3EA', opacity: locating ? 0.7 : 1 }}
          title="取得目前位置"
        >
          {locating ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          )}
          {locating ? '定位中…' : userPos ? '重新定位' : '定位我的位置'}
        </button>

        {/* 回至中心 */}
        <button
          onClick={flyToCenter}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] font-medium shadow-lg"
          style={{ background: '#F7F3EA', color: '#2B2015', border: '1px solid #D4C9B0' }}
          title="回至中心"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          回至中心
        </button>

        {/* 定位狀態 */}
        {userPos && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px]"
            style={{ background: '#EEF6FF', color: '#3B82F6', border: '1px solid #BFDBFE' }}>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            已取得位置
          </div>
        )}
        {geoError && (
          <div className="px-3 py-2 rounded-xl text-[11px] max-w-[160px]"
            style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}>
            ⚠ {geoError}
          </div>
        )}
      </div>

      {/* 右下角天數標示 */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl text-[12px] z-[1000]"
        style={{ background: 'rgba(43,32,21,0.75)', color: '#F7F3EA', backdropFilter: 'blur(4px)' }}>
        Day {day.day} · {day.weekday} · {spots.length} 個景點
      </div>
    </div>
  );
}
