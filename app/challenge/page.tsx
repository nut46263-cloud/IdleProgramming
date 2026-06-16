'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { 
  Flame, 
  Sparkles, 
  Coins, 
  Clock, 
  CheckCircle,
  Play,
  TrendingUp
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  world: string;
  stageId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Nightmare';
  passRate: number;
  timeEst: string;
  xpReward: number;
  coinReward: number;
  description: string;
}

export default function ChallengesPage() {
  const { soundEnabled, completedStages } = useGame();
  const [filter, setFilter] = useState<string>('ALL');

  const challenges: Challenge[] = [
    {
      id: 'html-btn',
      title: 'Dungeon Button Constructor',
      world: 'HTML',
      stageId: 'stage2',
      difficulty: 'Easy',
      passRate: 94,
      timeEst: '4 mins',
      xpReward: 30,
      coinReward: 20,
      description: 'Implement a structured button tag with a unique ID reference for layout compilation.'
    },
    {
      id: 'sql-select',
      title: 'SELECT Age Assertions',
      world: 'SQL',
      stageId: 'stage2',
      difficulty: 'Easy',
      passRate: 91,
      timeEst: '5 mins',
      xpReward: 30,
      coinReward: 20,
      description: 'Write a relational query statement filtering age rows within a SQL target users table.'
    },
    {
      id: 'js-double',
      title: 'Functional Array Doubler',
      world: 'JavaScript',
      stageId: 'stage2',
      difficulty: 'Medium',
      passRate: 79,
      timeEst: '10 mins',
      xpReward: 35,
      coinReward: 20,
      description: 'Map arrays function items using high-order loops to double output integers.'
    },
    {
      id: 'c-swap',
      title: 'Numeric Pointer Swapper',
      world: 'C',
      stageId: 'stage3',
      difficulty: 'Hard',
      passRate: 51,
      timeEst: '20 mins',
      xpReward: 45,
      coinReward: 30,
      description: 'Write memory reference swap function utilizing temporary variables and dereference parameters.'
    },
    {
      id: 'cpp-warrior',
      title: 'Class Object Warrior',
      world: 'C++',
      stageId: 'stage2',
      difficulty: 'Hard',
      passRate: 46,
      timeEst: '25 mins',
      xpReward: 35,
      coinReward: 20,
      description: 'Construct encapsulated Warrior structure and public attack functions.'
    },
    {
      id: 'c-malloc',
      title: 'Malloc Memory Allocation',
      world: 'C',
      stageId: 'stage5',
      difficulty: 'Nightmare',
      passRate: 18,
      timeEst: '40 mins',
      xpReward: 160,
      coinReward: 100,
      description: 'Synthesize raw pointers and buffer allocations. Simulate heap segment bindings.'
    },
    {
      id: 'js-loop',
      title: 'requestAnimationFrame Loop',
      world: 'JavaScript',
      stageId: 'stage5',
      difficulty: 'Nightmare',
      passRate: 15,
      timeEst: '45 mins',
      xpReward: 180,
      coinReward: 100,
      description: 'Defeat the script master using event loop scheduling and game ticks.'
    }
  ];

  const handleStartMission = () => {
    if (soundEnabled) {
      soundSystem.playClick();
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-success-dungeon border-success-dungeon/20 bg-success-dungeon/5';
      case 'Medium': return 'text-secondary border-secondary/20 bg-secondary/5';
      case 'Hard': return 'text-[#a855f7] border-[#a855f7]/20 bg-[#a855f7]/5';
      case 'Nightmare': return 'text-danger-dungeon border-danger-dungeon/20 bg-danger-dungeon/5';
      default: return 'text-slate-400 border-slate-500/20';
    }
  };

  const filteredChallenges = filter === 'ALL' 
    ? challenges 
    : challenges.filter(c => c.difficulty.toUpperCase() === filter);

  return (
    <div className="space-y-8 select-none pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 uppercase tracking-tight">PRACTICE CHALLENGES</h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-wider">Acquire bounties and XP by tackling isolated coding tasks</p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap p-1 bg-slate-950 border border-border-dungeon rounded-xl gap-1">
          {['ALL', 'EASY', 'MEDIUM', 'HARD', 'NIGHTMARE'].map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setFilter(diff);
                if (soundEnabled) soundSystem.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider cursor-pointer uppercase transition-all
                ${filter === diff 
                  ? 'bg-accent text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((c) => {
          const completedList = completedStages[c.world] || [];
          const isPassed = completedList.includes(c.stageId);

          return (
            <div 
              key={c.id}
              className={`p-6 border rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300
                ${isPassed 
                  ? 'bg-success-dungeon/5 border-success-dungeon/10 shadow-lg shadow-success-dungeon/5' 
                  : 'bg-slate-950/20 border-border-dungeon hover:border-slate-700 hover:bg-slate-950/40 shadow-md'
                }
              `}
            >
              <div className="space-y-4">
                {/* Header tag */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getDifficultyColor(c.difficulty)}`}>
                    {c.difficulty}
                  </span>
                  
                  {isPassed && (
                    <div className="flex items-center gap-1 text-[10px] text-success-dungeon font-bold uppercase select-none">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Passed</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-100 group-hover:text-accent truncate" title={c.title}>
                    {c.title}
                  </h3>
                  <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5 block">{c.world}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed h-12 overflow-hidden select-text">
                  {c.description}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border-dungeon/40">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <span className="font-bold text-[10px]">{c.passRate}% Pass Rate</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="font-bold text-[10px]">{c.timeEst}</span>
                  </div>
                </div>
              </div>

              {/* Footer pricing and CTA */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-dungeon/40">
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 px-2 py-1 bg-slate-950 border border-border-dungeon rounded-lg text-[9px] font-bold text-yellow-500">
                    <Coins className="w-3.5 h-3.5 text-yellow-500" />
                    <span>+{c.coinReward}g</span>
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-slate-950 border border-border-dungeon rounded-lg text-[9px] font-bold text-accent">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>+{c.xpReward}xp</span>
                  </span>
                </div>

                <Link
                  href={`/learn?world=${encodeURIComponent(c.world)}&stage=${c.stageId}`}
                  onClick={handleStartMission}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer
                    ${isPassed 
                      ? 'bg-slate-900 border border-success-dungeon/30 hover:border-success-dungeon text-success-dungeon' 
                      : 'bg-accent text-white shadow-md shadow-accent/10 hover:scale-102'
                    }
                  `}
                >
                  <Play className={`w-3 h-3 ${isPassed ? 'fill-success-dungeon text-success-dungeon' : 'fill-white'}`} />
                  <span>{isPassed ? 'Practice Again' : 'Start Mission'}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
