'use client';

import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import DailyRewards from '../game/daily-rewards';
import AiMentorPanel from '../game/ai-mentor-panel';
import { useGame } from '@/contexts/GameContext';

export default function Shell({ children }: { children: React.ReactNode }) {
  const { activeTheme, isHydrated } = useGame();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center text-slate-400 font-medium">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-wider uppercase font-semibold text-xs">Entering the Dungeon...</span>
      </div>
    );
  }

  return (
    <div className={`theme-${activeTheme} min-h-screen flex flex-row bg-bg-dungeon text-slate-100 transition-all duration-300 dungeon-grid`}>
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
