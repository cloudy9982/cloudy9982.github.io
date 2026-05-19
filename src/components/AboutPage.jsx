// ============================================================
// AboutPage — 關於我頁面
// 結構：大頭照 + Hook + 副標 → 三大板塊（科技 / 文字 / 旅行） → 個人簡介
// ============================================================
import React from 'react';
import AvatarEditor from './AvatarEditor';
import { ABOUT } from '../data/about';

export default function AboutPage({ avatarUrl, setAvatarUrl }) {
  return (
    <div className="animate-fade-in pb-10 max-w-2xl mx-auto">

      {/* ── 個人卡片：大頭照 + 筆名 + Hook ── */}
      <div className="bg-white dark:bg-[#252627] rounded-2xl p-8 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col items-center text-center">
        <AvatarEditor avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />

        <h1 className="text-[26px] font-bold text-[#333] dark:text-white mb-1">
          {ABOUT.penName}
        </h1>
        <p className="text-[13px] text-[#5bb98c] mb-5 tracking-wider">個人創作空間</p>

        <p className="text-[18px] font-medium text-[#333] dark:text-white leading-[1.7] max-w-md">
          {ABOUT.hook}
        </p>
        {ABOUT.subhook && (
          <p className="mt-3 text-[14px] text-[#888] dark:text-[#a9a9b3] leading-[1.9] max-w-md">
            {ABOUT.subhook}
          </p>
        )}

        <p className="mt-5 text-[12px] text-[#bbb] dark:text-[#555]">
          ✦ 點擊大頭照可即時更換圖片
        </p>
      </div>

      {/* ── 三大板塊 ── */}
      <div className="bg-white dark:bg-[#252627] rounded-2xl p-8 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none">
        <h2 className="text-[19px] font-bold text-[#333] dark:text-white mb-6 flex items-center gap-2">
          🗂 三大板塊
        </h2>
        <div className="flex flex-col gap-6">
          {ABOUT.pillars.map((p) => (
            <PillarBlock key={p.title} pillar={p} />
          ))}
        </div>
      </div>

      {/* ── 個人簡介 ── */}
      <div className="bg-white dark:bg-[#252627] rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none">
        <h2 className="text-[19px] font-bold text-[#333] dark:text-white mb-5 flex items-center gap-2">
          📖 個人簡介
        </h2>
        <div className="flex flex-col gap-4">
          {(Array.isArray(ABOUT.bio) ? ABOUT.bio : [ABOUT.bio]).map((para, i) => (
            <p key={i} className="text-[15px] text-[#666] dark:text-[#a9a9b3] leading-[1.9]">
              {para}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}

// 單一板塊：icon + 標題 + tagline + 定位 + 讀者價值
function PillarBlock({ pillar }) {
  return (
    <div className="border-l-4 border-[#5bb98c] pl-5">
      <p className="flex items-baseline gap-2 mb-1">
        <span className="text-[22px] leading-none">{pillar.icon}</span>
        <span className="text-[17px] font-bold text-[#333] dark:text-white">{pillar.title}</span>
      </p>
      {pillar.tagline && (
        <p className="text-[14px] text-[#5bb98c] mb-3 italic">{pillar.tagline}</p>
      )}
      <Row label="定位" value={pillar.positioning} />
      <Row label="讀者帶走" value={pillar.value} />
    </div>
  );
}

// 標籤 + 值 的一行（同舊版樣式以維持視覺一致）
function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-1">
      <span className="shrink-0 text-[13px] font-semibold text-[#5bb98c] w-20">{label}</span>
      <span className="text-[15px] text-[#666] dark:text-[#a9a9b3] leading-[1.8]">{value}</span>
    </div>
  );
}
