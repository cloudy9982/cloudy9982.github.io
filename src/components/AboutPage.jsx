// ============================================================
// AboutPage — 關於我頁面
// 包含大頭照（可直接在此點擊更換）、個人介紹、創作偏好、避雷聲明
// ============================================================
import React from 'react';
import AvatarEditor from './AvatarEditor';
import { ABOUT } from '../data/about';

export default function AboutPage({ avatarUrl, setAvatarUrl }) {
  return (
    <div className="animate-fade-in pb-10 max-w-2xl mx-auto">

      {/* ── 個人卡片 ── */}
      <div className="bg-white dark:bg-[#252627] rounded-2xl p-8 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col items-center text-center">
        
        {/* 大頭照（可點擊更換） */}
        <AvatarEditor avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />

        <h1 className="text-[26px] font-bold text-[#333] dark:text-white mb-1">
          {ABOUT.penName}
        </h1>
        <p className="text-[13px] text-[#5bb98c] mb-5 tracking-wider">個人創作空間</p>

        <p className="text-[15px] text-[#666] dark:text-[#a9a9b3] leading-[1.9] max-w-md">
          {ABOUT.bio}
        </p>

        {/* 更換頭像提示 */}
        <p className="mt-4 text-[12px] text-[#bbb] dark:text-[#555]">
          ✦ 點擊大頭照可即時更換圖片
        </p>
      </div>

      {/* ── 創作偏好 ── */}
      <div className="bg-white dark:bg-[#252627] rounded-2xl p-8 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none">
        <h2 className="text-[19px] font-bold text-[#333] dark:text-white mb-5 flex items-center gap-2">
          ⚔️ 創作偏好與守備範圍
        </h2>

        <div className="flex flex-col gap-4">
          <Row label="主推 CP" value={ABOUT.preferences.mainCP} />
          <Row label="文字調性" value={ABOUT.preferences.style} />
          <Row label="代表作" value={ABOUT.preferences.representative} />
        </div>
      </div>

      {/* ── 避雷聲明 ── */}
      <div className="bg-white dark:bg-[#252627] rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none">
        <h2 className="text-[19px] font-bold text-[#333] dark:text-white mb-5 flex items-center gap-2">
          ⚠️ 避雷聲明
        </h2>
        <ul className="flex flex-col gap-3">
          {ABOUT.warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-[#666] dark:text-[#a9a9b3] leading-[1.8]">
              <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-[#5bb98c]" />
              {w}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

// 小工具：標籤 + 值 的一行
function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
      <span className="shrink-0 text-[13px] font-semibold text-[#5bb98c] w-20">{label}</span>
      <span className="text-[15px] text-[#666] dark:text-[#a9a9b3] leading-[1.8]">{value}</span>
    </div>
  );
}
