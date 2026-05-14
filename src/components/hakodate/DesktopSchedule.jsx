// ============================================================
// DesktopSchedule — 可編輯的時間軸行程
// ============================================================
import React from 'react';

export default function DesktopSchedule({
  day,
  editMode,
  editData,
  onEditChange,
  onToggleEdit,
  onSave,
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#F7F3EA', boxShadow: '0 2px 12px rgba(44,32,21,0.06)' }}
    >
      {/* 區塊標題列 */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid #E8DFCC' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#2B2015' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-medium" style={{ color: '#2B2015' }}>今日行程</p>
            <p className="text-[12px]" style={{ color: '#9C8060' }}>
              Day {day.day} · {day.date} · {day.schedules.length} 個行程
            </p>
          </div>
        </div>

        {/* 編輯 / 儲存按鈕 */}
        <div className="flex items-center gap-2">
          {editMode && (
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-colors"
              style={{ background: '#2B2015', color: '#F7F3EA' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              儲存
            </button>
          )}
          <button
            onClick={onToggleEdit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] transition-colors"
            style={{
              background: editMode ? '#F0EAD8' : '#F0EAD8',
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
      <div className="px-6 py-4 relative">
        {/* 垂直軸線 */}
        <div
          className="absolute top-4 bottom-4"
          style={{
            left: '82px',
            width: '1px',
            background: 'linear-gradient(to bottom, #C4956A80, #E8DFCC)',
          }}
        />

        <div className="space-y-1">
          {day.schedules.map((s, i) => {
            const cur = editData[s.id] || s;
            return (
              <div key={s.id} className="relative flex items-start gap-4 py-3">
                {/* 時間 */}
                <div className="w-14 flex-none pt-0.5">
                  {editMode ? (
                    <input
                      value={cur.time}
                      onChange={(e) => onEditChange(s.id, 'time', e.target.value)}
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
                  className="absolute flex-none w-3 h-3 rounded-full border-2 z-10 mt-1.5"
                  style={{
                    left: '75px',
                    background: editMode ? '#C4956A' : '#F7F3EA',
                    borderColor: '#C4956A',
                  }}
                />

                {/* 內容卡片 */}
                <div
                  className="flex-1 rounded-xl px-4 py-3 ml-4 transition-colors"
                  style={{
                    background: editMode ? '#F0EAD8' : '#F2EAD6',
                    border: editMode ? '1px solid #C4956A44' : '1px solid transparent',
                  }}
                >
                  {editMode ? (
                    <div className="space-y-2">
                      <input
                        value={cur.name}
                        onChange={(e) => onEditChange(s.id, 'name', e.target.value)}
                        className="w-full text-[15px] font-medium rounded-lg px-3 py-1.5 outline-none"
                        style={{
                          background: '#FDFBF4',
                          color: '#2B2015',
                          border: '1px solid #DDD3C0',
                        }}
                        placeholder="行程名稱"
                      />
                      <div className="flex gap-2">
                        <input
                          value={cur.location}
                          onChange={(e) => onEditChange(s.id, 'location', e.target.value)}
                          className="flex-1 text-[12px] rounded-lg px-3 py-1.5 outline-none"
                          style={{
                            background: '#FDFBF4',
                            color: '#5A4A3A',
                            border: '1px solid #DDD3C0',
                          }}
                          placeholder="地點"
                        />
                        <input
                          value={cur.note}
                          onChange={(e) => onEditChange(s.id, 'note', e.target.value)}
                          className="flex-1 text-[12px] rounded-lg px-3 py-1.5 outline-none"
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
                        {s.name}
                      </p>
                      <p className="text-[12px] mt-0.5" style={{ color: '#9C8060' }}>{s.location}</p>
                      {s.note && (
                        <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: '#7A6A5A' }}>
                          {s.note}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
