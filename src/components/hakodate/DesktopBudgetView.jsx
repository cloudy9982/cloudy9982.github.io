// ============================================================
// DesktopBudgetView — 左主區域完整記帳列表 + 分帳邏輯
// 角色：Cloudy / Ike　模式：均分 / Cloudy全付 / Ike全付
// ============================================================
import React, { useState } from 'react';

const RATE       = 0.21;
const CATEGORIES = ['餐飲', '交通', '購物', '住宿', '景點', '其他'];
const CAT_COLOR  = { 餐飲: '#C4956A', 交通: '#7A9E9E', 購物: '#9C8080', 住宿: '#8A9C70', 景點: '#9C8060', 其他: '#A09090' };
const SPLITS     = [
  { id: 'half',   label: '均分',       short: '½' },
  { id: 'cloudy', label: 'Cloudy 全付', short: 'C' },
  { id: 'ike',    label: 'Ike 全付',   short: 'I' },
];

const INIT_FORM = { name: '', jpy: '', category: '餐飲', payer: 'Cloudy', split: 'half' };

export default function DesktopBudgetView({ expenses, currentDay, onAdd, onRemove, onUpdateSplit }) {
  const [form, setForm]         = useState(INIT_FORM);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('today'); // 'today' | 'all'

  const todayExp   = expenses.filter((e) => e.day === currentDay.day);
  const displayExp = viewMode === 'today' ? todayExp : expenses;

  const handleAdd = () => {
    if (!form.name.trim() || !form.jpy) return;
    onAdd({ ...form, day: currentDay.day, date: currentDay.date });
    setForm(INIT_FORM);
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      {/* 切換：今日 / 全程 */}
      <div className="flex items-center gap-3">
        {['today', 'all'].map((m) => (
          <button key={m} onClick={() => setViewMode(m)}
            className="px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
            style={{ background: viewMode === m ? '#2B2015' : '#F7F3EA', color: viewMode === m ? '#F7F3EA' : '#5A4A3A', border: viewMode === m ? 'none' : '1px solid #E8DFCC' }}>
            {m === 'today' ? `今日 Day ${currentDay.day}` : '全程總覽'}
          </button>
        ))}
        <span className="text-[13px] ml-auto" style={{ color: '#9C8060' }}>
          共 {displayExp.length} 筆 · ¥{displayExp.reduce((s, e) => s + Number(e.jpy), 0).toLocaleString()}
        </span>
      </div>

      {/* ── 主列表 ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#F7F3EA', boxShadow: '0 2px 12px rgba(44,32,21,0.06)' }}>
        {/* 表頭 */}
        <div className="grid text-[11px] font-medium px-5 py-3"
          style={{ gridTemplateColumns: '80px 1fr 80px 100px 80px 160px 36px', color: '#9C8060', borderBottom: '1px solid #E8DFCC', background: '#F0EAD8' }}>
          <span>日期</span>
          <span>項目</span>
          <span>類別</span>
          <span className="text-right">金額</span>
          <span className="text-center">支付者</span>
          <span className="text-center">分帳模式</span>
          <span />
        </div>

        {displayExp.length === 0 ? (
          <div className="text-center py-12 text-[14px]" style={{ color: '#B0A090' }}>
            尚無記錄，點擊下方「新增支出」開始記帳
          </div>
        ) : (
          <div>
            {displayExp.map((e, i) => (
              <div key={e.id}>
                <div className="grid items-center px-5 py-3.5"
                  style={{ gridTemplateColumns: '80px 1fr 80px 100px 80px 160px 36px' }}>
                  {/* 日期 */}
                  <span className="text-[12px]" style={{ color: '#9C8060', fontFamily: "'Playfair Display',serif" }}>
                    {e.date?.slice(5).replace('-', '/')}
                  </span>
                  {/* 項目 */}
                  <span className="text-[14px] font-medium truncate" style={{ color: '#2B2015' }}>{e.name}</span>
                  {/* 類別 badge */}
                  <span>
                    <span className="inline-block text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: `${CAT_COLOR[e.category]}22`, color: CAT_COLOR[e.category] }}>
                      {e.category}
                    </span>
                  </span>
                  {/* 金額 */}
                  <div className="text-right">
                    <p className="text-[14px] font-bold" style={{ color: '#2B2015', fontFamily: "'Playfair Display',serif" }}>
                      ¥{Number(e.jpy).toLocaleString()}
                    </p>
                    <p className="text-[11px]" style={{ color: '#9C8060' }}>
                      NT${Math.round(Number(e.jpy) * RATE).toLocaleString()}
                    </p>
                  </div>
                  {/* 支付者 */}
                  <div className="flex justify-center">
                    <span className="text-[12px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: e.payer === 'Cloudy' ? '#C4956A22' : '#7A9E9E22', color: e.payer === 'Cloudy' ? '#C4956A' : '#7A9E9E' }}>
                      {e.payer}
                    </span>
                  </div>
                  {/* 分帳模式 (3 按鈕) */}
                  <div className="flex gap-1 justify-center">
                    {SPLITS.map((sp) => (
                      <button key={sp.id} onClick={() => onUpdateSplit(e.id, sp.id)}
                        title={sp.label}
                        className="w-8 h-7 rounded-lg text-[11px] font-medium transition-all"
                        style={{
                          background: e.split === sp.id ? '#2B2015' : '#E8DFCC',
                          color: e.split === sp.id ? '#F7F3EA' : '#7A6A5A',
                        }}>
                        {sp.short}
                      </button>
                    ))}
                  </div>
                  {/* 刪除 */}
                  <button onClick={() => onRemove(e.id)} className="flex justify-center opacity-40 hover:opacity-80 transition-opacity">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5A4A3A" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
                {i < displayExp.length - 1 && (
                  <div style={{ borderTop: '1px dashed #E8DFCC', marginInline: '20px' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 新增支出表單 ── */}
      {showForm ? (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: '#F7F3EA', border: '1.5px solid #C4956A', boxShadow: '0 2px 12px rgba(44,32,21,0.06)' }}>
          <p className="text-[14px] font-medium" style={{ color: '#2B2015' }}>新增支出</p>

          {/* 第一行：項目 + 金額 */}
          <div className="flex gap-3">
            <input type="text" placeholder="支出項目（例：海鮮丼）" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="flex-1 rounded-xl px-4 py-2.5 text-[14px] outline-none"
              style={{ background: '#F2EAD6', color: '#2B2015', border: '1px solid #E8DFCC' }} />
            <input type="number" placeholder="金額 JPY" value={form.jpy}
              onChange={(e) => setForm((f) => ({ ...f, jpy: e.target.value }))}
              className="w-36 rounded-xl px-4 py-2.5 text-[14px] outline-none"
              style={{ background: '#F2EAD6', color: '#2B2015', border: '1px solid #E8DFCC' }} />
            {form.jpy && (
              <div className="flex items-center px-3 rounded-xl text-[13px] flex-none"
                style={{ background: '#F0EAD8', color: '#7A6A5A' }}>
                ≈ NT${Math.round(Number(form.jpy) * RATE).toLocaleString()}
              </div>
            )}
          </div>

          {/* 第二行：類別 + 支付者 + 分帳 */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[12px] flex-none" style={{ color: '#9C8060' }}>類別</span>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="rounded-xl px-3 py-2 text-[13px] outline-none"
                style={{ background: '#F2EAD6', color: '#5A4A3A', border: '1px solid #E8DFCC' }}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] flex-none" style={{ color: '#9C8060' }}>支付者</span>
              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #E8DFCC' }}>
                {['Cloudy', 'Ike'].map((p) => (
                  <button key={p} onClick={() => setForm((f) => ({ ...f, payer: p }))}
                    className="px-4 py-2 text-[13px] font-medium transition-all"
                    style={{ background: form.payer === p ? '#2B2015' : '#F2EAD6', color: form.payer === p ? '#F7F3EA' : '#5A4A3A' }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] flex-none" style={{ color: '#9C8060' }}>分帳</span>
              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #E8DFCC' }}>
                {SPLITS.map((sp) => (
                  <button key={sp.id} onClick={() => setForm((f) => ({ ...f, split: sp.id }))}
                    className="px-3 py-2 text-[12px] font-medium transition-all"
                    style={{ background: form.split === sp.id ? '#2B2015' : '#F2EAD6', color: form.split === sp.id ? '#F7F3EA' : '#5A4A3A' }}
                    title={sp.label}>
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAdd}
              className="flex-1 py-3 rounded-xl text-[14px] font-medium"
              style={{ background: '#2B2015', color: '#F7F3EA' }}>
              確認記錄
            </button>
            <button onClick={() => { setShowForm(false); setForm(INIT_FORM); }}
              className="px-6 py-3 rounded-xl text-[14px]"
              style={{ background: '#E8DFCC', color: '#5A4A3A' }}>
              取消
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-2xl text-[14px] font-medium flex items-center justify-center gap-2"
          style={{ background: '#2B2015', color: '#F7F3EA' }}>
          <span className="text-[20px] leading-none">+</span> 新增支出
        </button>
      )}
    </div>
  );
}
