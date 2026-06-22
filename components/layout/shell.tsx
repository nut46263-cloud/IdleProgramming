'use client';

import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import DailyRewards from '../game/daily-rewards';
import AiMentorPanel from '../game/ai-mentor-panel';
import { useGame } from '@/contexts/GameContext';

export default function Shell({ children }: { children: React.ReactNode }) {
  const { activeTheme, isHydrated, isDayMode } = useGame();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center text-slate-400 font-medium">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-wider uppercase font-semibold text-xs">Entering the Dungeon...</span>
      </div>
    );
  }

  return (
    <div className={`theme-${activeTheme} ${isDayMode ? 'day-mode' : 'night-mode'} min-h-screen flex flex-row bg-bg-dungeon text-slate-100 transition-all duration-500`}>
      {/* Lofi Nature Background */}
      <div className="lofi-nature-container">
        {/* Sky layer */}
        <div className="lofi-sky" />
        
        {/* Sun/Moon body */}
        <div className="lofi-celestial" />

        {/* Floating Clouds */}
        <svg className="absolute top-[8%] left-0 w-full h-[35%] pointer-events-none" fill="none">
          <path className="lofi-cloud-1 fill-white/55" d="M 50 130 Q 70 80 120 100 Q 150 70 190 90 Q 230 80 250 110 Q 280 120 270 150 L 30 150 Z" transform="scale(1.2)" />
          <path className="lofi-cloud-2 fill-white/45" d="M 80 150 Q 110 90 170 110 Q 210 80 260 100 Q 300 90 320 130 L 50 150 Z" transform="scale(1.0)" />
        </svg>

        {/* Rolling Hills (Layered SVGs matching the lofi hills image) */}
        <svg className="absolute bottom-0 left-0 w-full h-[55%] pointer-events-none" viewBox="0 0 1440 600" preserveAspectRatio="none">
          {/* Back Hill */}
          <path className="hill-back" d="M 0 320 Q 350 180 720 270 Q 1090 380 1440 300 L 1440 600 L 0 600 Z" />
          
          {/* Mid Hill */}
          <path className="hill-mid" d="M 0 400 Q 300 280 680 410 Q 1060 540 1440 370 L 1440 600 L 0 600 Z" />

          {/* Front Hill */}
          <path className="hill-front" d="M 0 470 Q 400 350 820 460 Q 1240 560 1440 430 L 1440 600 L 0 600 Z" />

          {/* White and green flowers scattered across front hill */}
          <circle className="lofi-flower" cx="150" cy="510" r="3" />
          <circle className="lofi-flower" cx="280" cy="490" r="3.5" />
          <circle className="lofi-flower" cx="420" cy="530" r="2.5" />
          <circle className="lofi-flower" cx="590" cy="500" r="3" />
          <circle className="lofi-flower" cx="720" cy="520" r="2.5" />
          <circle className="lofi-flower" cx="950" cy="490" r="3.5" />
          <circle className="lofi-flower" cx="1100" cy="530" r="3" />
          <circle className="lofi-flower" cx="1320" cy="510" r="2.5" />
          
          {/* Large Stone / Rock in the bottom right corner (directly matches user's picture) */}
          <path className="lofi-stone" d="M 1120 600 L 1150 510 Q 1200 470 1260 480 Q 1320 495 1360 600 Z" />
        </svg>

        {/* Now Playing Banner (Lofi Chill Summer vibe) */}
        <div className="absolute top-28 left-6 hidden xl:block select-none pointer-events-none transition-opacity duration-300 opacity-60">
          <span className="text-[10px] font-black uppercase text-yellow-500 tracking-widest block animate-pulse">▶ NOW PLAYING</span>
          <span className="text-xs font-bold text-slate-100 block mt-0.5 font-mono">Playlist Lofi Chill Summer</span>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar Header */}
        <Topbar />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Global Game Overlay Elements */}
      <DailyRewards />
      <AiMentorPanel />
    </div>
  );
}
