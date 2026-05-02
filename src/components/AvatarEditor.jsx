// ============================================================
// AvatarEditor — 點擊大頭照開啟彈窗，可貼上新 URL 即時更換
// 同時更新瀏覽器網址列的 ?avatar= 參數，分享連結時會保留設定
// ============================================================
import React, { useState } from 'react';
import { Camera, X } from './icons';
import { SITE_CONFIG } from '../data/siteConfig';

export default function AvatarEditor({ avatarUrl, setAvatarUrl }) {
  const [open, setOpen]       = useState(false);
  const [draft, setDraft]     = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError]     = useState('');

  const handleOpen = () => {
    setDraft(avatarUrl);
    setPreview(avatarUrl);
    setError('');
    setOpen(true);
  };

  const handleDraftChange = (e) => {
    const val = e.target.value;
    setDraft(val);
    setError('');
    if (val.startsWith('http')) setPreview(val);
  };

  const handleApply = () => {
    if (!draft.trim()) { setError('請輸入有效的圖片 URL'); return; }
    setAvatarUrl(draft.trim());

    // 更新網址列（無需重載頁面）
    const url = new URL(window.location.href);
    url.searchParams.set('avatar', draft.trim());
    window.history.replaceState({}, '', url.toString());

    setOpen(false);
  };

  const handleReset = () => {
    setAvatarUrl(SITE_CONFIG.avatarUrl);
    const url = new URL(window.location.href);
    url.searchParams.delete('avatar');
    window.history.replaceState({}, '', url.toString());
    setOpen(false);
  };

  return (
    <>
      {/* 大頭照 + 懸停提示 */}
      <div className="relative w-32 h-32 mb-5 group cursor-pointer" onClick={handleOpen} title="點擊更換大頭照">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover shadow-sm border border-gray-200 dark:border-[#333] transition-opacity group-hover:opacity-70"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x200?text=Avatar'; }}
        />
        {/* 懸停遮罩 */}
        <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
        {/* badge */}
        <div className="absolute bottom-1 right-1 bg-yellow-500 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md text-sm border-2 border-white dark:border-[#1a1a1a] pointer-events-none">
          {SITE_CONFIG.avatarBadge}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white dark:bg-[#252627] rounded-2xl p-7 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-bold text-[#333] dark:text-white">更換大頭照</h2>
              <button onClick={() => setOpen(false)} className="text-[#888] hover:text-[#333] dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            {preview && (
              <div className="flex justify-center mb-5">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#5bb98c]"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x200?text=?'; }}
                />
              </div>
            )}

            {/* URL input */}
            <label className="block text-[14px] text-[#666] dark:text-[#a9a9b3] mb-2">圖片 URL</label>
            <input
              type="text"
              value={draft}
              onChange={handleDraftChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full bg-[#f8f9fa] dark:bg-[#1a1a1a] text-[#333] dark:text-white rounded-xl px-4 py-3 text-[15px] border border-[#e0e0e0] dark:border-[#333] focus:outline-none focus:border-[#5bb98c] transition-colors mb-1"
            />
            {error && <p className="text-red-500 text-[13px] mb-2">{error}</p>}

            <p className="text-[12px] text-[#aaa] mb-6">
              ✦ URL 會以 <code className="bg-[#f0f0f0] dark:bg-[#323232] px-1 rounded">?avatar=</code> 參數存入瀏覽器網址列，重新整理後仍可保留。
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                className="flex-1 bg-[#5bb98c] hover:bg-[#4ea27a] text-white rounded-xl py-2.5 font-medium transition-colors"
              >
                套用
              </button>
              <button
                onClick={handleReset}
                className="px-5 bg-[#f8f9fa] dark:bg-[#323232] text-[#666] dark:text-[#a9a9b3] hover:bg-[#e0e0e0] dark:hover:bg-[#404040] rounded-xl py-2.5 font-medium transition-colors"
              >
                重設
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
