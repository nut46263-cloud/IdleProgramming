'use client';

import React from 'react';
import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { 
  Play, 
  Flame, 
  Trophy, 
  Target, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Lock,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { 
    xp, 
    level, 
    coins, 
    streak, 
    unlockedWorlds, 
    completedStages, 
    unlockedBadges, 
    soundEnabled 
  } = useGame();

  const handleButtonClick = () => {
    if (soundEnabled) {
      soundSystem.playClick();
    }
  };

  // Find next uncompleted stage for "Continue Journey"
  const getContinueJourneyLink = () => {
    const worlds = ['HTML', 'SQL', 'C', 'C++', 'JavaScript'];
    for (const w of worlds) {
      if (unlockedWorlds.includes(w)) {
        const completed = completedStages[w] || [];
        for (let i = 1; i <= 5; i++) {
          const stageId = `stage${i}`;
          if (!completed.includes(stageId)) {
            return {
              url: `/learn?world=${encodeURIComponent(w)}&stage=${stageId}`,
              world: w,
              stageNum: i
            };
          }
        }
      }
    }
    // Fallback if everything is completed
    return {
      url: '/roadmap',
      world: 'Roadmap',
      stageNum: 0
    };
  };

  const journey = getContinueJourneyLink();

  // Badges database for rendering
  const badgesList = [
    { id: 'first_step', name: 'First Step', desc: 'Completed your first stage', icon: Trophy, color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
    { id: 'html_master', name: 'HTML Builder', desc: 'Completed HTML world', icon: Award, color: 'text-orange-400 border-orange-500/20 bg-orange-500/5' },
    { id: 'sql_master', name: 'Data Overlord', desc: 'Completed SQL world', icon: Target, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
    { id: 'c_master', name: 'Pointer Pioneer', desc: 'Completed C world', icon: Sparkles, color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
    { id: 'wealthy', name: 'Treasure Hunter', desc: 'Accumulated 500 gold coins', icon: Trophy, color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' },
  ];

  return (
    <div className="space-y-8 select-none relative pb-12">
      {/* Animated particle particles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent/20"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 90}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Banner Banner */}
      <div className="relative z-10 p-8 md:p-12 rounded-3xl border border-border-dungeon bg-slate-950/40 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-glow border border-accent/20 text-xs font-semibold text-accent uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Season 1 active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-slate-100">
            LEARN. BUILD. <span className="text-accent neon-glow">PROVE.</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Enter the dungeon, write compilable code, defeat the bosses, and claim ultimate programming mastery.
          </p>

          <div className="pt-2">
            <Link 
              href={journey.url}
              onClick={handleButtonClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:scale-105 transition-all text-sm font-bold rounded-xl text-white shadow-lg shadow-accent/25 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {journey.stageNum > 0 
                  ? `Continue: ${journey.world} - Stage ${journey.stageNum}` 
                  : "Enter Roadmap"
                }
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Character Avatar Preview Widget */}
        <div className="flex-shrink-0 w-48 h-48 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-border-dungeon relative flex flex-col items-center justify-center p-4">
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900 border border-border-dungeon text-[9px] font-bold text-slate-400 uppercase">
            Gamer Card
          </div>
          <div className="w-20 h-20 rounded-full bg-accent-glow border border-accent flex items-center justify-center text-4xl font-extrabold text-accent shadow-lg shadow-accent/15 mb-2 animate-pulse">
            ⚔️
          </div>
          <p className="text-xs font-bold text-slate-200">Dev Ranger</p>
          <p className="text-[10px] text-accent/80 font-bold tracking-wider uppercase mt-0.5">LVL {level} Warrior</p>
        </div>
      </div>

      {/* Grid Layout of Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Weekly Mentor Report */}
        <div className="p-6 rounded-2xl border border-border-dungeon bg-slate-950/20 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <BrainCircuit className="w-4.5 h-4.5 text-accent" />
              <span>AI Mentor Report</span>
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-border-dungeon text-xs leading-relaxed text-slate-300 select-text">
                &ldquo;You are advancing quickly! Level {level} reached. Your code syntax in HTML was clean. Keep training on SQL joins and C pointers to unlock advanced ranks.&rdquo;
              </div>
              
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Syntax Precision</span>
                  <span className="font-bold text-success-dungeon">94%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-success-dungeon rounded-full" style={{ width: '94%' }} />
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Logic Compilation</span>
                  <span className="font-bold text-accent">86%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '86%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements widget */}
        <div className="p-6 rounded-2xl border border-border-dungeon bg-slate-950/20 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Trophy className="w-4.5 h-4.5 text-yellow-500" />
              <span>Recent Badges</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {badgesList.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                  <div 
                    key={badge.id}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all group relative cursor-pointer
                      ${isUnlocked 
                        ? badge.color
                        : 'bg-slate-950/40 border-border-dungeon text-slate-600'
                      }
                    `}
                    title={badge.desc}
                  >
                    {isUnlocked ? (
                      <badge.icon className="w-6 h-6 mb-1.5" />
                    ) : (
                      <Lock className="w-5 h-5 mb-2 text-slate-700" />
                    )}
                    <span className="text-[10px] font-bold leading-tight block truncate w-full">
                      {badge.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/profile"
            onClick={handleButtonClick}
            className="text-[11px] font-bold text-accent hover:underline flex items-center justify-end gap-1 mt-4"
          >
            <span>View All Badges</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Recent World Progress Widget */}
        <div className="p-6 rounded-2xl border border-border-dungeon bg-slate-950/20 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <TrendingUp className="w-4.5 h-4.5 text-success-dungeon" />
              <span>Language Mastery</span>
            </h3>
            
            <div className="space-y-3.5">
              {['HTML', 'SQL', 'C', 'C++', 'JavaScript'].map((w) => {
                const completed = completedStages[w] || [];
                const percent = Math.min((completed.length / 5) * 100, 100);
                const isUnlocked = unlockedWorlds.includes(w);

                return (
                  <div key={w} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-bold ${isUnlocked ? 'text-slate-200' : 'text-slate-600'}`}>
                        {w} {!isUnlocked && '🔒'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{percent}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-accent' : 'bg-slate-800'}`} 
                        style={{ width: `${percent}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
