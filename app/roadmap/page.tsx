'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  HelpCircle,
  BookOpen, 
  Code2, 
  Target, 
  Award,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Stage {
  id: string;
  name: string;
  type: 'learn' | 'practice' | 'challenge' | 'judge' | 'boss';
  desc: string;
  xp: number;
  coins: number;
  icon: any;
}

interface World {
  id: string;
  name: string;
  desc: string;
  badge: string;
  accent: string;
  stages: Stage[];
}

export default function Roadmap() {
  const { 
    completedStages, 
    unlockedWorlds, 
    unlockWorld, 
    soundEnabled 
  } = useGame();

  const [selectedWorldId, setSelectedWorldId] = useState<string>('HTML');

  const handleWorldClick = (worldId: string, isUnlocked: boolean) => {
    if (soundEnabled) {
      soundSystem.playClick();
    }
    if (isUnlocked) {
      setSelectedWorldId(worldId);
    }
  };

  const handleStageClick = () => {
    if (soundEnabled) {
      soundSystem.playClick();
    }
  };

  const worlds: World[] = [
    {
      id: 'HTML',
      name: 'HTML World',
      desc: 'The basics of web design. Learn to construct pages with semantic tags.',
      badge: '🕸️ Web Initiate',
      accent: 'var(--accent-color)',
      stages: [
        { id: 'stage1', name: 'Intro to Tags', type: 'learn', desc: 'Read basic markup slides and complete structural checkboxes.', xp: 10, coins: 10, icon: BookOpen },
        { id: 'stage2', name: 'Button Practice', type: 'practice', desc: 'Write a button in the interactive editor with a custom identifier.', xp: 30, coins: 20, icon: Code2 },
        { id: 'stage3', name: 'Itemized Lists', type: 'challenge', desc: 'Construct a bulleted list of items inside the console.', xp: 40, coins: 30, icon: Target },
        { id: 'stage4', name: 'Auto Judge Checklist', type: 'judge', desc: 'Pass test assertions on tag attributes and formatting.', xp: 50, coins: 40, icon: Zap },
        { id: 'stage5', name: 'Portfolio Boss', type: 'boss', desc: 'Construct a multi-section page utilizing HTML5 semantic layout rules.', xp: 150, coins: 100, icon: Award }
      ]
    },
    {
      id: 'SQL',
      name: 'SQL Sanctuary',
      desc: 'Master databases. Run queries, filter records, and join tables.',
      badge: '💾 Database Adept',
      accent: '#00D9FF',
      stages: [
        { id: 'stage1', name: 'SQL Query Basics', type: 'learn', desc: 'Understand relational database architecture and tables.', xp: 10, coins: 10, icon: BookOpen },
        { id: 'stage2', name: 'Users SELECT', type: 'practice', desc: 'Write query to select filtered age records from users.', xp: 30, coins: 20, icon: Code2 },
        { id: 'stage3', name: 'Aggregated Gold', type: 'challenge', desc: 'Group database table elements by custom rank keys.', xp: 40, coins: 30, icon: Target },
        { id: 'stage4', name: 'Assert Conditions', type: 'judge', desc: 'Pass validation tests on query structure and constraints.', xp: 50, coins: 40, icon: Zap },
        { id: 'stage5', name: 'Join Boss', type: 'boss', desc: 'Synthesize data across multiple foreign key schemas with tables JOIN.', xp: 150, coins: 100, icon: Award }
      ]
    },
    {
      id: 'C',
      name: 'C Crypt',
      desc: 'Close to the metal. Learn variable memory pointers, structures, and malloc.',
      badge: '⚙️ Hardware Pioneer',
      accent: '#a855f7',
      stages: [
        { id: 'stage1', name: 'C Syntax Basics', type: 'learn', desc: 'Master variables, standard inputs, outputs and main loops.', xp: 15, coins: 10, icon: BookOpen },
        { id: 'stage2', name: 'Pointer Memory', type: 'practice', desc: 'Create reference memory addresses using pointers.', xp: 35, coins: 20, icon: Code2 },
        { id: 'stage3', name: 'Numeric Swapper', type: 'challenge', desc: 'Pass values by reference to modify storage locations.', xp: 45, coins: 30, icon: Target },
        { id: 'stage4', name: 'Pointer Compiles', type: 'judge', desc: 'Ensure pointer dereferences execute compile validations.', xp: 55, coins: 40, icon: Zap },
        { id: 'stage5', name: 'Malloc Boss', type: 'boss', desc: 'Simulate memory allocator heap management blocks.', xp: 160, coins: 100, icon: Award }
      ]
    },
    {
      id: 'C++',
      name: 'C++ Castle',
      desc: 'Object-oriented programming. Build classes, subclasses, and battle loops.',
      badge: '🏰 Object Overlord',
      accent: '#ec4899',
      stages: [
        { id: 'stage1', name: 'C++ OOP Concepts', type: 'learn', desc: 'Understand objects, classes, and encapsulation rules.', xp: 15, coins: 10, icon: BookOpen },
        { id: 'stage2', name: 'Warrior Instance', type: 'practice', desc: 'Construct class and public actions within C++ format.', xp: 35, coins: 20, icon: Code2 },
        { id: 'stage3', name: 'Inherited Wizard', type: 'challenge', desc: 'Derive subclasses and override base attacks.', xp: 45, coins: 30, icon: Target },
        { id: 'stage4', name: 'Polymorphic Compiles', type: 'judge', desc: 'Check virtual runtime bindings and template parameters.', xp: 55, coins: 40, icon: Zap },
        { id: 'stage5', name: 'rpg Battle Boss', type: 'boss', desc: 'Synthesize class architectures into dynamic battle states.', xp: 170, coins: 100, icon: Award }
      ]
    },
    {
      id: 'JavaScript',
      name: 'JavaScript Dojo',
      desc: 'The scripting engine. Work with event arrays, map, and animation ticks.',
      badge: '⚡ Script Emperor',
      accent: '#eab308',
      stages: [
        { id: 'stage1', name: 'JavaScript Basics', type: 'learn', desc: 'Understand scopes, values, and closures.', xp: 15, coins: 10, icon: BookOpen },
        { id: 'stage2', name: 'Array Double', type: 'practice', desc: 'Map elements to output doubled values.', xp: 35, coins: 20, icon: Code2 },
        { id: 'stage3', name: 'Vowel Counting', type: 'challenge', desc: 'Count letters using string loops and conditional checks.', xp: 45, coins: 30, icon: Target },
        { id: 'stage4', name: 'Dojo Assertions', type: 'judge', desc: 'Pass test assertions on scopes and return types.', xp: 55, coins: 40, icon: Zap },
        { id: 'stage5', name: 'Retro Game Loop Boss', type: 'boss', desc: 'Synthesize requestAnimationFrame tick engines.', xp: 180, coins: 100, icon: Award }
      ]
    }
  ];

  // Dynamically check world unlock states based on previous world completions
  const isWorldUnlocked = (worldId: string) => {
    if (worldId === 'HTML') return true;
    const worldIndex = worlds.findIndex(w => w.id === worldId);
    if (worldIndex === -1) return false;
    
    // Check if the previous world has all 5 stages completed
    const prevWorld = worlds[worldIndex - 1];
    const prevCompletions = completedStages[prevWorld.id] || [];
    return prevCompletions.length === 5;
  };

  // Automatically unlock next world if completed
  useEffect(() => {
    worlds.forEach((w) => {
      if (w.id !== 'HTML' && isWorldUnlocked(w.id) && !unlockedWorlds.includes(w.id)) {
        unlockWorld(w.id);
        if (soundEnabled) {
          soundSystem.playLevelUp();
        }
      }
    });
  }, [completedStages, unlockedWorlds]);

  return (
    <div className="space-y-8 select-none pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-100 uppercase tracking-tight">PROGRESSION ROADMAP</h1>
        <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-wider">Complete worlds to unlock advance coding sectors</p>
      </div>

      {/* World nodes path */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 border border-border-dungeon bg-slate-950/20 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-accent/5 opacity-20 pointer-events-none" />

        {worlds.map((w, idx) => {
          const isUnlocked = isWorldUnlocked(w.id);
          const isSelected = selectedWorldId === w.id;
          const completedCount = completedStages[w.id]?.length || 0;
          const isCompleted = completedCount === 5;

          return (
            <React.Fragment key={w.id}>
              {/* World node button */}
              <div className="flex flex-col items-center relative z-10">
                <button
                  onClick={() => handleWorldClick(w.id, isUnlocked)}
                  className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer relative
                    ${isSelected 
                      ? 'bg-accent border-accent text-white scale-110 shadow-lg shadow-accent/20' 
                      : isUnlocked 
                        ? isCompleted
                          ? 'bg-slate-900 border-success-dungeon text-success-dungeon hover:bg-slate-900/60 shadow-lg shadow-success-dungeon/10'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 hover:scale-105 shadow-md shadow-black/30'
                        : 'bg-slate-950/80 border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'
                    }
                  `}
                  disabled={!isUnlocked}
                >
                  {isUnlocked ? (
                    isCompleted ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <span className="font-black text-lg">{w.id.slice(0, 3)}</span>
                    )
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}

                  {/* Level text */}
                  {isUnlocked && (
                    <span className="absolute -bottom-2 px-2 py-0.5 bg-slate-950 border border-border-dungeon text-[8px] font-black rounded-full text-slate-300">
                      {completedCount}/5
                    </span>
                  )}
                </button>
                
                <span className={`text-xs font-extrabold mt-3.5 tracking-wider ${isSelected ? 'text-accent' : isUnlocked ? 'text-slate-300' : 'text-slate-600'}`}>
                  {w.name}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{w.badge.split(' ').slice(1).join(' ')}</span>
              </div>

              {/* Laser line between nodes (desktop) */}
              {idx < worlds.length - 1 && (
                <div className="hidden md:block flex-1 h-[2px] bg-slate-800 relative min-w-8">
                  {isWorldUnlocked(worlds[idx + 1].id) && (
                    <div 
                      className={`absolute inset-0 transition-all duration-300 ${isCompleted ? 'bg-success-dungeon' : 'bg-accent animate-pulse'}`}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected World Details & Stage Checklist */}
      <AnimatePresence mode="wait">
        {selectedWorldId && (
          <motion.div
            key={selectedWorldId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="p-6 md:p-8 border border-border-dungeon bg-slate-950/30 rounded-3xl space-y-6"
          >
            {/* World Header info */}
            <div>
              <span className="text-xs font-extrabold tracking-wider uppercase text-accent">ACTIVE WORLD SECTOR</span>
              <h2 className="text-2xl font-black text-slate-100">{worlds.find(w => w.id === selectedWorldId)?.name}</h2>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed max-w-xl">{worlds.find(w => w.id === selectedWorldId)?.desc}</p>
            </div>

            {/* Stages vertical flow list */}
            <div className="space-y-3">
              {worlds.find(w => w.id === selectedWorldId)?.stages.map((stage, sIdx) => {
                const completedList = completedStages[selectedWorldId] || [];
                const isCompleted = completedList.includes(stage.id);

                // Stage is unlocked if it's stage1 or the previous stage in the list is completed
                const isStageUnlocked = sIdx === 0 || completedList.includes(worlds.find(w => w.id === selectedWorldId)!.stages[sIdx - 1].id);

                return (
                  <div
                    key={stage.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                      ${isStageUnlocked
                        ? isCompleted
                          ? 'bg-success-dungeon/5 border-success-dungeon/10 text-slate-300'
                          : 'bg-slate-900 border-border-dungeon text-slate-300 hover:border-slate-600 hover:bg-slate-900/60'
                        : 'bg-slate-950/60 border-slate-950 text-slate-600 opacity-60'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl border flex items-center justify-center
                        ${isStageUnlocked
                          ? isCompleted
                            ? 'bg-success-dungeon/10 border-success-dungeon/20 text-success-dungeon'
                            : 'bg-accent-glow border-accent/20 text-accent'
                          : 'bg-slate-950 border-slate-900 text-slate-700'
                        }
                      `}>
                        <stage.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm tracking-wide text-slate-200">{stage.name}</h4>
                          <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-border-dungeon text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            Stage {sIdx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed max-w-lg">{stage.desc}</p>
                      </div>
                    </div>

                    {/* Actions & Rewards */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Rewards */}
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-slate-950/80 border border-border-dungeon rounded-lg text-[10px] font-bold text-yellow-500">
                          {stage.coins}g
                        </span>
                        <span className="px-2 py-1 bg-slate-950/80 border border-border-dungeon rounded-lg text-[10px] font-bold text-accent">
                          {stage.xp}xp
                        </span>
                      </div>

                      {/* Launch CTA */}
                      {isStageUnlocked ? (
                        isCompleted ? (
                          <div className="flex items-center gap-1.5 text-xs text-success-dungeon font-semibold select-none pr-2">
                            <CheckCircle2 className="w-4.5 h-4.5" />
                            <span>Passed</span>
                          </div>
                        ) : (
                          <Link
                            href={`/learn?world=${encodeURIComponent(selectedWorldId)}&stage=${stage.id}`}
                            onClick={handleStageClick}
                            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-accent hover:scale-102 transition-all text-xs font-extrabold rounded-xl text-white shadow-md shadow-accent/15 cursor-pointer"
                          >
                            <span>Launch</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )
                      ) : (
                        <div className="flex items-center gap-1 text-slate-600 text-xs font-semibold select-none pr-4">
                          <Lock className="w-4 h-4" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
