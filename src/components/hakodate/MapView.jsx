// ============================================================
// MapView — Leaflet 地圖，顯示當日景點
// ============================================================
import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 修正 Leaflet 預設 icon 路徑問題
delete L.Icon.Default.prototype._getIconUrl;

function createCustomIcon(color = '#C4956A', label = '') {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${color};
        width:28px; height:28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="transform:rotate(45deg); color:white; font-size:10px; font-weight:bold;">${label}</span>
      </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

export default function MapView({ currentDay, trip }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const spots = currentDay.schedules.filter((s) => s.lat && s.lng);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (!mapRef.current || spots.length === 0) return;

    const center = [spots[0].lat, spots[0].lng];
    const map = L.map(mapRef.current, {
      center,
      zoom: 13,
      zoomControl: false,
    });

    // CartoDB Voyager 地圖（暖色調，與 UI 搭配）
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OSM, © CartoDB',
      maxZoom: 18,
    }).addTo(map);

    // 加入控制按鈕（右下）
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 加入景點標記
    spots.forEach((s, i) => {
      const marker = L.marker([s.lat, s.lng], {
        icon: createCustomIcon('#C4956A', i + 1),
      }).addTo(map);
      marker.bindPopup(
        `<div style="font-family:'Noto Serif TC',serif; min-width:120px;">
          <p style="font-size:13px; font-weight:600; color:#2B2015; margin:0 0 4px;">${s.name}</p>
          <p style="font-size:11px; color:#9C8060; margin:0;">${s.location}</p>
          ${s.note ? `<p style="font-size:11px; color:#5A4A3A; margin:4px 0 0; border-top:1px dashed #ddd; padding-top:4px;">${s.note}</p>` : ''}
        </div>`,
        { maxWidth: 220 }
      );
    });

    // 自動縮放以顯示所有點
    if (spots.length > 1) {
      const bounds = L.latLngBounds(spots.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [currentDay.day]);

  return (
    <div className="flex flex-col h-full">
      {/* 地圖主體 */}
      <div
        ref={mapRef}
        className="flex-1"
        style={{ minHeight: '320px', background: '#E8E0CC' }}
      />

      {/* 底部資訊列 */}
      <div
        className="flex-none px-4 py-4"
        style={{ background: '#F7F3EA', borderTop: '1px solid #E8DFCC' }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-lg"
            style={{ background: '#F2EAD6', color: '#5A4A3A' }}
          >
            行程 + 收藏 ▾
          </button>
          <div className="flex gap-4 text-[13px]">
            <div>
              <span style={{ color: '#9C8060' }}>SPOTS</span>
              <span className="ml-2 font-bold" style={{ color: '#2B2015', fontFamily: "'Playfair Display', serif" }}>
                {spots.length}
              </span>
            </div>
            <div>
              <span style={{ color: '#9C8060' }}>YOU</span>
              <span className="ml-2" style={{ color: '#B0A090' }}>未取得</span>
            </div>
          </div>
        </div>

        {/* 景點清單橫向捲動 */}
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {spots.map((s, i) => (
            <div
              key={i}
              className="flex-none rounded-xl px-3 py-2 min-w-[130px]"
              style={{ background: '#F2EAD6', border: '1px solid #E8DFCC' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: '#C4956A', flexShrink: 0 }}
                >
                  {i + 1}
                </span>
                <span className="text-[12px] font-medium truncate" style={{ color: '#2B2015' }}>{s.name}</span>
              </div>
              <p className="text-[11px] truncate" style={{ color: '#9C8060' }}>{s.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
