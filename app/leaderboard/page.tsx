'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { 
  Trophy, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  ArrowUp,
  User
} from 'lucide-react';

interface LeaderboardPlayer {
  rank: number;
  name: string;
  isPlayer: boolean;
  level: number;
  xp: number;
  badge: string;
}

export default function Leaderboard() {
  const { level, xp, soundEnabled } = useGame();
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 58 });

  // Simulate countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate current player's cumulative XP
  // E.g. level 1 requires 0 accum, level 2 requires 100 accum, etc.
  // Formula: Sum_{i=1}^{level-1} (i * 100) + xp
  const getCumulativeXp = (lvl: number, currentXp: number) => {
    let total = 0;
    for (let i = 1; i < lvl; i++) {
      total += i * 100;
    }
    return total + currentXp;
  };

  const playerCumulativeXp = getCumulativeXp(level, xp);

  // Setup list of players
  const rawPlayers = [
    { name: 'ByteKnight', level: 12, xp: 6200, badge: '🧙‍♂️ Archmage', isPlayer: false },
    { name: 'ShadowCoder', level: 8, xp: 2800, badge: '⚔️technomancer', isPlayer: false },
    { name: 'NovaDev', level: 5, xp: 1200, badge: '🛡️ Script Knight', isPlayer: false },
    { name: 'CodeGhost', level: 2, xp: 250, badge: '🍃 Code Novice', isPlayer: false },
    { name: 'You (Hero Player)', level: level, xp: playerCumulativeXp, badge: '🛡️ Script Novice', isPlayer: true }
  ];

  // Sort players dynamically by cumulative XP
  const sortedPlayers = [...rawPlayers].sort((a, b) => b.xp - a.xp);

  // Re-assign rank keys based on index
  const players: LeaderboardPlayer[] = sortedPlayers.map((p, idx) => ({
    rank: idx + 1,
    name: p.name,
    isPlayer: p.isPlayer,
    level: p.level,
    xp: p.xp,
    badge: p.isPlayer 
      ? level >= 20 ? '🧙‍♂️ Archmage' : level >= 15 ? '⚔️ technomancer' : level >= 10 ? '🛡️ Technomancer' : level >= 5 ? '🛡️ Script Knight' : '🍃 Code Novice'
      : p.badge
  }));

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 2: return 'text-slate-300 bg-slate-300/10 border-slate-300/20';
      case 3: return 'text-amber-600 bg-amber-600/10 border-amber-600/20';
      default: return 'text-slate-500 bg-slate-950 border-border-dungeon';
    }
  };

  return (
    <div className="space-y-8 select-none pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 uppercase tracking-tight">LEADERBOARDS</h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-wider">Compete against top developers in the Obsidian League</p>
        </div>

        {/* Weekly Countdown Timer Widget */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-950/60 border border-border-dungeon rounded-2xl">
          <Clock className="w-5 h-5 text-accent animate-pulse" />
          <div>
            <p className="text-[9px] text-slate-500 font-bold uppercase leading-none">Weekly league resets in</p>
            <p className="font-bold text-xs font-mono text-slate-200 mt-1">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Grid */}
      <div className="border border-border-dungeon bg-slate-950/20 rounded-3xl overflow-hidden p-6 space-y-4">
        {/* Table Headings */}
        <div className="grid grid-cols-12 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-border-dungeon/30 pb-3">
          <div className="col-span-2">Rank</div>
          <div className="col-span-5 sm:col-span-6">Developer</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-3 sm:col-span-2 text-right">Total XP</div>
        </div>

        {/* Players list */}
        <div className="space-y-2">
          {players.map((p) => (
            <div
              key={p.name}
              className={`grid grid-cols-12 items-center p-4 border rounded-2xl transition-all duration-300
                ${p.isPlayer 
                  ? 'bg-accent-glow border-accent shadow-md shadow-accent/10 scale-[1.01]' 
                  : 'bg-slate-950/40 border-border-dungeon hover:border-slate-800'
                }
              `}
            >
              {/* Rank column */}
              <div className="col-span-2">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-black text-xs ${getRankBadgeColor(p.rank)}`}>
                  {p.rank}
                </div>
              </div>

              {/* Username & Avatar column */}
              <div className="col-span-5 sm:col-span-6 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white
                  ${p.isPlayer 
                    ? 'bg-gradient-to-tr from-accent to-purple-500' 
                    : 'bg-slate-900 border border-border-dungeon text-slate-400'
                  }
                `}>
                  {p.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className={`font-bold text-xs sm:text-sm leading-tight truncate ${p.isPlayer ? 'text-accent neon-glow' : 'text-slate-200'}`}>
                    {p.name}
                  </h4>
                  <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5 block truncate">
                    {p.badge}
                  </span>
                </div>
              </div>

              {/* Level column */}
              <div className="col-span-2 text-center">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-border-dungeon text-[10px] font-black text-slate-300">
                  {p.level}
                </span>
              </div>

              {/* Total XP column */}
              <div className="col-span-3 sm:col-span-2 text-right flex items-center justify-end gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm text-slate-100 font-mono">
                  {p.xp}
                </span>
                <span className="text-[9px] text-slate-500 font-bold">XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
