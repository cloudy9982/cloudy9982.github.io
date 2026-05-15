// ============================================================
// DesktopSchedule — 可編輯的時間軸行程（含新增 / 刪除 / Google Maps 連結）
//   - editArr 為 null 時：唯讀模式，渲染 day.schedules
//   - editArr 為陣列時：編輯模式，操作對象是 editArr
// ============================================================
import React, { useState } from 'react';

// 產生 Google Maps 搜尋連結（新分頁開啟）
const gmapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function DesktopSchedule({
  day,
  editArr,
  onEditChange,
  onAddSchedule,
  onRemoveSchedule,
  onToggleEdit,
  onSave,
}) {
  const editMode = editArr !== null;
  const rows     = editMode ? editArr : day.schedules;

  // 兩段式刪除確認：第一次點擊記下 idx，再點一次同個按鈕才真的刪。
  const [pendingDelete, setPendingDelete] = useState(null);

  const handleDeleteClick = (idx) => {
    if (pendingDelete === idx) {
      onRemoveSchedule(idx);
      setPendingDelete(null);
    } else {
      setPendingDelete(idx);
    }
  };

  // 切換 / 儲存 / 取消時都清掉 pendingDelete，避免狀態殘留
  const handleSaveWrap   = () => { setPendingDelete(null); onSave(); };
  const handleToggleWrap = () => { setPendingDelete(null); onToggleEdit(); };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#F7F3EA', boxShadow: '0 2px 12px rgba(44,32,21,0.06)' }}
    >
      {/* 區塊標題列 */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 px-4 md:px-6 py-3 md:py-4"
        style={{ borderBottom: '1px solid #E8DFCC' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-none"
            style={{ background: '#2B2015' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-medium" style={{ color: '#2B2015' }}>今日行程</p>
            <p className="text-[12px] truncate" style={{ color: '#9C8060' }}>
              Day {day.day} · {day.date} · {rows.length} 個行程
            </p>
          </div>
        </div>

        {/* 編輯 / 儲存 / 取消按鈕 */}
        <div className="flex items-center gap-2 sm:flex-none">
          {editMode && (
            <button
              onClick={handleSaveWrap}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-[13px] font-medium transition-colors"
              style={{ background: '#2B2015', color: '#F7F3EA' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              儲存
            </button>
          )}
          <button
            onClick={handleToggleWrap}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-[13px] transition-colors"
            style={{
              background: '#F0EAD8',
              color: editMode ? '#C4956A' : '#5A4A3A',
              border: editMode ? '1px solid #C4956A' : '1px solid transparent',
            }}
            title={editMode ? '取消編輯' : '編輯行程'}
          >
            {editMode ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                取消
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                編輯
              </>
            )}
          </button>
        </div>
      </div>

      {/* 時間軸 */}
      <div className="px-4 md:px-6 py-3 md:py-4 relative">
        {/* 垂直軸線（手機 left:66px，桌面 left:82px） */}
        {rows.length > 0 && (
          <div
            className="absolute top-4 bottom-4 left-[66px] md:left-[82px]"
            style={{
              width: '1px',
              background: 'linear-gradient(to bottom, #C4956A80, #E8DFCC)',
            }}
          />
        )}

        <div className="space-y-1">
          {rows.map((s, i) => {
            const isPending = pendingDelete === i;
            return (
              <div key={s.id ?? i} className="relative flex items-start gap-3 md:gap-4 py-3">
                {/* 時間 */}
                <div className="w-12 md:w-14 flex-none pt-0.5">
                  {editMode ? (
                    <input
                      value={s.time}
                      onChange={(e) => onEditChange(i, 'time', e.target.value)}
                      placeholder="HH:MM"
                      className="w-full text-[13px] rounded-lg px-2 py-1 outline-none text-center"
                      style={{
                        background: '#F2EAD6',
                        color: '#5A4A3A',
                        border: '1px solid #C4956A',
                        fontFamily: "'Playfair Display', serif",
                      }}
                    />
                  ) : (
                    <span
                      className="text-[13px]"
                      style={{ color: '#9C8060', fontFamily: "'Playfair Display', serif" }}
                    >
                      {s.time}
                    </span>
                  )}
                </div>

                {/* 軸上圓點 */}
                <div
                  className="absolute flex-none w-3 h-3 rounded-full border-2 z-10 mt-1.5 left-[60px] md:left-[76px]"
                  style={{
                    background: editMode ? '#C4956A' : '#F7F3EA',
                    borderColor: '#C4956A',
                  }}
                />

                {/* 內容卡片 */}
                <div
                  className="flex-1 rounded-xl px-3 md:px-4 py-3 ml-4 transition-colors relative"
                  style={{
                    background: editMode ? '#F0EAD8' : '#F2EAD6',
                    border: editMode ? '1px solid #C4956A44' : '1px solid transparent',
                  }}
                >
                  {editMode ? (
                    <div className="space-y-2 pr-9">
                      <input
                        value={s.name}
                        onChange={(e) => onEditChange(i, 'name', e.target.value)}
                        className="w-full text-[15px] font-medium rounded-lg px-3 py-2 outline-none"
                        style={{
                          background: '#FDFBF4',
                          color: '#2B2015',
                          border: '1px solid #DDD3C0',
                        }}
                        placeholder="行程名稱"
                      />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          value={s.location}
                          onChange={(e) => onEditChange(i, 'location', e.target.value)}
                          className="w-full sm:flex-1 text-[12px] rounded-lg px-3 py-2 sm:py-1.5 outline-none"
                          style={{
                            background: '#FDFBF4',
                            color: '#5A4A3A',
                            border: '1px solid #DDD3C0',
                          }}
                          placeholder="地點（會自動對應地圖座標）"
                        />
                        <input
                          value={s.note}
                          onChange={(e) => onEditChange(i, 'note', e.target.value)}
                          className="w-full sm:flex-1 text-[12px] rounded-lg px-3 py-2 sm:py-1.5 outline-none"
                          style={{
                            background: '#FDFBF4',
                            color: '#5A4A3A',
                            border: '1px solid #DDD3C0',
                          }}
                          placeholder="備註"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[15px] font-medium leading-snug" style={{ color: '#2B2015' }}>
                        {s.name || <span style={{ color: '#B0A090', fontStyle: 'italic' }}>未命名行程</span>}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[12px]" style={{ color: '#9C8060' }}>{s.location}</p>
                        {s.location && (
                          <a
                            href={gmapsUrl(s.location)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`在 Google Maps 查看「${s.location}」`}
                            className="inline-flex items-center justify-center w-5 h-5 rounded-md transition-opacity opacity-60 hover:opacity-100"
                            style={{ background: '#E8DFCC' }}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5A4A3A" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </a>
                        )}
                      </div>
                      {s.note && (
                        <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: '#7A6A5A' }}>
                          {s.note}
                        </p>
                      )}
                    </>
                  )}

                  {/* 編輯模式：刪除按鈕（雙擊確認） */}
                  {editMode && (
                    <button
                      onClick={() => handleDeleteClick(i)}
                      onBlur={() => setPendingDelete((p) => (p === i ? null : p))}
                      title={isPending ? '再點一次確認刪除' : '刪除此行程'}
                      className="absolute top-2.5 right-2.5 flex items-center justify-center rounded-lg transition-all"
                      style={{
                        width: isPending ? 'auto' : '28px',
                        height: '28px',
                        padding: isPending ? '0 8px' : '0',
                        background: isPending ? '#C4956A' : '#E8DFCC',
                        color: isPending ? '#F7F3EA' : '#5A4A3A',
                      }}
                    >
                      {isPending ? (
                        <span className="text-[11px] font-medium whitespace-nowrap">再點一次確認</span>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* 編輯模式：新增行程按鈕 */}
          {editMode && (
            <button
              onClick={onAddSchedule}
              className="mt-2 ml-[72px] md:ml-[88px] flex items-center justify-center gap-1.5 w-[calc(100%-72px)] md:w-[calc(100%-88px)] py-2.5 rounded-xl text-[13px] font-medium transition-colors"
              style={{
                background: '#F0EAD8',
                color: '#C4956A',
                border: '1px dashed #C4956A',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              新增行程
            </button>
          )}

          {/* 唯讀模式且空陣列：給個提示（編輯模式進入時可加） */}
          {!editMode && rows.length === 0 && (
            <p className="text-center text-[13px] py-6" style={{ color: '#B0A090' }}>
              這一天還沒有行程，點右上「編輯」開始規劃
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
