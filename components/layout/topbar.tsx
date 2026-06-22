'use client';

import React from 'react';
import { useGame, ThemeType } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { 
  Coins, 
  Flame, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Moon,
  Sun
} from 'lucide-react';

export default function Topbar() {
  const { 
    xp, 
    level, 
    coins, 
    streak, 
    soundEnabled, 
    setSoundEnabled, 
    activeTheme, 
    setTheme,
    isDayMode,
    toggleDayMode
  } = useGame();

  const xpNeeded = level * 100;
  const xpPercent = Math.min((xp / xpNeeded) * 100, 100);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    if (nextVal) {
      soundSystem.playClick();
    }
  };

  const changeTheme = (theme: ThemeType) => {
    setTheme(theme);
    if (soundEnabled) {
      soundSystem.playCoin();
    }
  };

  return (
    <header className="border-b border-border-dungeon bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between z-20 select-none">
      {/* XP Progress Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md mr-4">
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>LEVEL {level}</span>
            </span>
            <span className="tracking-wider uppercase">{xp} / {xpNeeded} XP</span>
          </div>
          <div className="h-2.5 bg-slate-900 rounded-full border border-border-dungeon overflow-hidden p-[1px]">
            <div 
              style={{ width: `${xpPercent}%` }}
              className="h-full bg-accent rounded-full transition-all duration-500 shadow-[0_0_8px_var(--accent-glow-strong)]"
            />
          </div>
        </div>
      </div>

      {/* Stats and Controls */}
      <div className="flex items-center gap-6">
        {/* Streak Flame */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-950/20 border border-red-500/20 rounded-xl">
          <Flame className="w-5 h-5 text-red-500 animate-flame" />
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Streak</p>
            <p className="font-bold text-sm text-red-400 leading-tight">{streak} Days</p>
          </div>
        </div>

        {/* Coins Wallet */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-yellow-950/20 border border-yellow-500/20 rounded-xl">
          <Coins className="w-5 h-5 text-yellow-500 animate-pulse" />
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Coins</p>
            <p className="font-bold text-sm text-yellow-400 leading-tight">{coins}g</p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-[1px] h-8 bg-border-dungeon hidden sm:block" />

        {/* Theme customization */}
        <div className="items-center gap-2 hidden sm:flex">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Theme</span>
          <div className="flex p-1 bg-slate-900 border border-border-dungeon rounded-lg gap-1">
            <button
              onClick={() => changeTheme('purple')}
              className={`w-6 h-6 rounded-md bg-[#6c63ff] border cursor-pointer transition-transform hover:scale-110
                ${activeTheme === 'purple' ? 'border-white scale-105' : 'border-transparent'}
              `}
              title="Purple Glow"
            />
            <button
              onClick={() => changeTheme('cyan')}
              className={`w-6 h-6 rounded-md bg-[#00d9ff] border cursor-pointer transition-transform hover:scale-110
                ${activeTheme === 'cyan' ? 'border-white scale-105' : 'border-transparent'}
              `}
              title="Cyan Storm"
            />
            <button
              onClick={() => changeTheme('amber')}
              className={`w-6 h-6 rounded-md bg-[#ffc857] border cursor-pointer transition-transform hover:scale-110
                ${activeTheme === 'amber' ? 'border-white scale-105' : 'border-transparent'}
              `}
              title="Amber Cyberpunk"
            />
          </div>
        </div>

        {/* Day/Night toggle button */}
        <button
          onClick={toggleDayMode}
          className="p-2.5 bg-slate-900 border border-border-dungeon hover:border-accent rounded-xl text-slate-400 hover:text-white cursor-pointer transition-all duration-200 flex items-center justify-center"
          title={isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
        >
          {isDayMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
        </button>

        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          className="p-2.5 bg-slate-900 border border-border-dungeon hover:border-accent rounded-xl text-slate-400 hover:text-white cursor-pointer transition-all duration-200"
          title={soundEnabled ? 'Mute Retro SFX' : 'Enable Retro SFX'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-accent" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
