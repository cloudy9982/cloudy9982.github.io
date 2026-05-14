// ============================================================
// BudgetView — 記帳分帳，JPY → TWD 換算
// ============================================================
import React, { useState } from 'react';

const RATE = 0.21; // 預設匯率
const CATEGORIES = ['餐飲', '交通', '購物', '住宿', '景點', '其他'];

const CAT_COLORS = {
  餐飲: '#C4956A',
  交通: '#7A9E9E',
  購物: '#9C8080',
  住宿: '#8A9C70',
  景點: '#9C8060',
  其他: '#A09090',
};

export default function BudgetView({ expenses, currentDay, onAdd, onRemove }) {
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'total'
  const [form, setForm] = useState({ name: '', jpy: '', category: '餐飲' });
  const [showForm, setShowForm] = useState(false);
  const [jpyInput, setJpyInput] = useState('');
  const [twdResult, setTwdResult] = useState('');

  const todayExpenses = expenses.filter((e) => e.day === currentDay.day);
  const displayExpenses = viewMode === 'daily' ? todayExpenses : expenses;

  const totalJPY = displayExpenses.reduce((s, e) => s + Number(e.jpy), 0);
  const totalTWD = Math.round(totalJPY * RATE);

  const handleAdd = () => {
    if (!form.name || !form.jpy) return;
    onAdd({ ...form, day: currentDay.day, date: currentDay.date });
    setForm({ name: '', jpy: '', category: '餐飲' });
    setShowForm(false);
  };

  const handleConvert = (val) => {
    setJpyInput(val);
    const num = parseFloat(val);
    setTwdResult(isNaN(num) ? '' : Math.round(num * RATE).toLocaleString());
  };

  return (
    <div className="px-4 pt-2 pb-6 space-y-4">

      {/* 每日 / 累積 切換 */}
      <div
        className="flex rounded-full p-1"
        style={{ background: '#E8DFCC' }}
      >
        {['daily', 'total'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className="flex-1 py-2.5 rounded-full text-[14px] font-medium transition-all"
            style={{
              background: viewMode === mode ? '#2B2015' : 'transparent',
              color: viewMode === mode ? '#F7F3EA' : '#9C8060',
            }}
          >
            {mode === 'daily' ? '每日 Daily' : '累積 Total'}
          </button>
        ))}
      </div>

      {/* 支出總覽卡 */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#F0EAD8', boxShadow: '0 2px 12px rgba(44,32,21,0.06)' }}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[13px]" style={{ color: '#9C8060' }}>
              {viewMode === 'daily' ? `本日支出 ${currentDay.date.slice(5).replace('-', '/')}` : '累計支出'}
            </p>
            <p
              className="text-[13px] mt-0.5"
              style={{ color: '#C4956A', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
              Total
            </p>
          </div>
          {/* 硬幣圖示 */}
          <svg width="52" height="36" viewBox="0 0 52 36" fill="none" opacity="0.4">
            <ellipse cx="36" cy="20" rx="14" ry="14" fill="#C4956A" />
            <ellipse cx="36" cy="20" rx="14" ry="14" fill="none" stroke="#9C8060" strokeWidth="1.5" />
            <ellipse cx="22" cy="22" rx="14" ry="14" fill="#9C8060" />
            <text x="22" y="26" textAnchor="middle" fontSize="11" fill="white" fontFamily="serif">¥</text>
            <text x="36" y="24" textAnchor="middle" fontSize="9" fill="white" fontFamily="serif">$</text>
          </svg>
        </div>

        <p
          className="text-[36px] font-bold leading-none mb-1"
          style={{ color: '#2B2015', fontFamily: "'Playfair Display', serif" }}
        >
          NT$ {totalTWD.toLocaleString()}
        </p>
        {totalJPY > 0 ? (
          <p className="text-[14px]" style={{ color: '#9C8060' }}>
            ¥{totalJPY.toLocaleString()} JPY
          </p>
        ) : (
          <p className="text-[14px]" style={{ color: '#B0A090' }}>尚無支出記錄</p>
        )}
      </div>

      {/* 匯率換算 */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#F7F3EA', boxShadow: '0 2px 8px rgba(44,32,21,0.05)' }}
      >
        <p className="text-[12px] tracking-widest mb-3" style={{ color: '#C4956A', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
          匯率換算 Currency
        </p>
        <div className="flex items-center gap-2">
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#F2EAD6', border: '1px solid #E8DFCC' }}
          >
            <span className="text-[13px] font-medium" style={{ color: '#5A4A3A' }}>JPY ¥</span>
            <input
              type="number"
              value={jpyInput}
              onChange={(e) => handleConvert(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent text-[15px] outline-none min-w-0"
              style={{ color: '#2B2015', fontFamily: "'Playfair Display', serif" }}
            />
          </div>
          <span className="text-[16px]" style={{ color: '#9C8060' }}>→</span>
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#F2EAD6', border: '1px solid #E8DFCC' }}
          >
            <span className="text-[13px] font-medium" style={{ color: '#5A4A3A' }}>TWD $</span>
            <span
              className="flex-1 text-[15px]"
              style={{ color: twdResult ? '#2B2015' : '#B0A090', fontFamily: "'Playfair Display', serif" }}
            >
              {twdResult || '0'}
            </span>
          </div>
        </div>
        <p className="text-[11px] mt-2 text-center" style={{ color: '#B0A090' }}>
          1 JPY ≈ {RATE} TWD · 預設匯率（可調整）
        </p>
      </div>

      {/* 支出清單 */}
      {displayExpenses.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#F7F3EA', boxShadow: '0 2px 8px rgba(44,32,21,0.05)' }}
        >
          {displayExpenses.map((e, i) => (
            <div key={e.id}>
              <div className="flex items-center gap-3 px-5 py-3">
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                  style={{ background: `${CAT_COLORS[e.category]}22`, color: CAT_COLORS[e.category] }}
                >
                  {e.category}
                </span>
                <span className="flex-1 text-[14px]" style={{ color: '#2B2015' }}>{e.name}</span>
                <div className="text-right">
                  <p className="text-[15px] font-bold" style={{ color: '#2B2015', fontFamily: "'Playfair Display', serif" }}>
                    ¥{Number(e.jpy).toLocaleString()}
                  </p>
                  <p className="text-[11px]" style={{ color: '#9C8060' }}>
                    NT${Math.round(Number(e.jpy) * RATE).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => onRemove(e.id)} className="ml-1 opacity-40 hover:opacity-80">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A4A3A" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {i < displayExpenses.length - 1 && (
                <div style={{ borderTop: '1px dashed #E8DFCC', marginLeft: '20px', marginRight: '20px' }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 新增支出表單 */}
      {showForm ? (
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ background: '#F7F3EA', border: '1px solid #C4956A' }}
        >
          <input
            type="text"
            placeholder="支出名稱（例：海鮮丼）"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl px-4 py-2.5 text-[14px] outline-none"
            style={{ background: '#F2EAD6', color: '#2B2015', border: '1px solid #E8DFCC' }}
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="金額 JPY"
              value={form.jpy}
              onChange={(e) => setForm((f) => ({ ...f, jpy: e.target.value }))}
              className="flex-1 rounded-xl px-4 py-2.5 text-[14px] outline-none"
              style={{ background: '#F2EAD6', color: '#2B2015', border: '1px solid #E8DFCC' }}
            />
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="rounded-xl px-3 py-2.5 text-[13px] outline-none"
              style={{ background: '#F2EAD6', color: '#5A4A3A', border: '1px solid #E8DFCC' }}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          {form.jpy && (
            <p className="text-[12px]" style={{ color: '#9C8060' }}>
              ≈ NT$ {Math.round(Number(form.jpy) * RATE).toLocaleString()} TWD
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 rounded-xl text-[14px] font-medium"
              style={{ background: '#2B2015', color: '#F7F3EA' }}
            >
              記錄支出
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl text-[14px]"
              style={{ background: '#E8DFCC', color: '#5A4A3A' }}
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-2xl text-[15px] font-medium flex items-center justify-center gap-2"
          style={{ background: '#2B2015', color: '#F7F3EA' }}
        >
          <span className="text-[20px] leading-none">+</span>
          新增支出
        </button>
      )}
    </div>
  );
}
