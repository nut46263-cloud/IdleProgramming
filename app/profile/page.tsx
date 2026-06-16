'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { 
  Trophy, 
  User, 
  Award, 
  Sparkles, 
  Coins, 
  Edit3, 
  Check, 
  Lock, 
  ShieldAlert,
  Flame,
  Gamepad
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Badge {
  id: string;
  name: string;
  desc: string;
  reward: string;
  icon: string;
}

export default function ProfilePage() {
  const { 
    level, 
    xp, 
    coins, 
    streak, 
    completedStages, 
    unlockedBadges, 
    soundEnabled,
    resetGame
  } = useGame();

  // Profile local states with localStorage persistence
  const [playerName, setPlayerName] = useState('Hero Player');
  const [activeAvatar, setActiveAvatar] = useState('⚔️');
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('dev_dungeon_player_name');
      const savedAvatar = localStorage.getItem('dev_dungeon_player_avatar');
      if (savedName) setPlayerName(savedName);
      if (savedAvatar) setActiveAvatar(savedAvatar);
    }
  }, []);

  const saveProfileData = (name: string, avatar: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dev_dungeon_player_name', name);
      localStorage.setItem('dev_dungeon_player_avatar', avatar);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setActiveAvatar(avatar);
    saveProfileData(playerName, avatar);
    if (soundEnabled) soundSystem.playCoin();
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    saveProfileData(playerName, activeAvatar);
    if (soundEnabled) soundSystem.playSuccess();
  };

  const handleResetClick = () => {
    if (confirm("Are you sure you want to delete all dungeon progress, coins, streaks, and reset your level?")) {
      resetGame();
      if (soundEnabled) soundSystem.playFailure();
      window.location.reload();
    }
  };

  const avatars = ['⚔️', '🧙‍♂️', '🛡️', '⚙️', '⚡', '🤖', '🐲', '👾'];

  const badges: Badge[] = [
    { id: 'first_step', name: 'First Step', desc: 'Unlock by completing your very first world stage.', reward: '+10 XP', icon: '🚀' },
    { id: 'html_master', name: 'Web Architect', desc: 'Unlock by completing all 5 stages in HTML World.', reward: '+150 XP', icon: '🕸️' },
    { id: 'sql_master', name: 'Data Overlord', desc: 'Unlock by completing all 5 stages in SQL World.', reward: '+150 XP', icon: '💾' },
    { id: 'c_master', name: 'Pointer Pioneer', desc: 'Unlock by completing all 5 stages in C Crypt.', reward: '+160 XP', icon: '⚙️' },
    { id: 'cpp_master', name: 'Object Overlord', desc: 'Unlock by completing all 5 stages in C++ Castle.', reward: '+170 XP', icon: '🏰' },
    { id: 'js_master', name: 'Script Emperor', desc: 'Unlock by completing all 5 stages in JS Dojo.', reward: '+180 XP', icon: '⚡' },
    { id: 'wealthy', name: 'Treasure Hunter', desc: 'Accumulate 500 gold coins in your wallet.', reward: 'Gold Hoarder Title', icon: '💰' }
  ];

  const bosses = [
    { world: 'HTML', bossName: 'Semantic Port Golem', desc: 'Defeat HTML world boss using standard structural tags.', stageId: 'stage5', icon: '🦖' },
    { world: 'SQL', bossName: 'Relational Join Wyrm', desc: 'Defeat SQL boss using multi-table foreign keys JOIN.', stageId: 'stage5', icon: '🐉' },
    { world: 'C', bossName: 'Heap Memory Gargoyle', desc: 'Defeat C boss utilizing alloc blocks and free addresses.', stageId: 'stage5', icon: '👹' },
    { world: 'C++', bossName: 'Polymorphic Golem', desc: 'Defeat C++ boss utilizing dynamic bindings and templates.', stageId: 'stage5', icon: '⚔️' },
    { world: 'JavaScript', bossName: 'Event Loop Archlich', desc: 'Defeat JS boss orchestrating requestAnimationFrame frames.', stageId: 'stage5', icon: '🧙' }
  ];

  return (
    <div className="space-y-8 select-none pb-12">
      {/* Profile Header Card */}
      <div className="p-6 md:p-8 border border-border-dungeon bg-slate-950/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          {/* Avatar Selector */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center text-5xl shadow-lg shadow-accent/20 select-none">
              {activeAvatar}
            </div>
            <div className="flex gap-1 p-1 bg-slate-900 border border-border-dungeon rounded-lg">
              {avatars.slice(0, 4).map(av => (
                <button
                  key={av}
                  onClick={() => handleAvatarSelect(av)}
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-slate-800 cursor-pointer transition-transform hover:scale-110
                    ${activeAvatar === av ? 'bg-accent/20 border border-accent text-white' : 'text-slate-400'}
                  `}
                >
                  {av}
                </button>
              ))}
            </div>
            <div className="flex gap-1 p-1 bg-slate-900 border border-border-dungeon rounded-lg -mt-1">
              {avatars.slice(4).map(av => (
                <button
                  key={av}
                  onClick={() => handleAvatarSelect(av)}
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-slate-800 cursor-pointer transition-transform hover:scale-110
                    ${activeAvatar === av ? 'bg-accent/20 border border-accent text-white' : 'text-slate-400'}
                  `}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Title Card */}
          <div className="text-center sm:text-left space-y-2.5">
            {isEditingName ? (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-slate-900 border border-accent rounded-xl px-3 py-1.5 text-slate-100 font-bold text-lg focus:outline-none"
                  maxLength={18}
                />
                <button
                  onClick={handleNameSave}
                  className="p-2 bg-accent rounded-xl hover:bg-accent/80 text-white cursor-pointer"
                >
                  <Check className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight leading-none select-text">{playerName}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-slate-500 hover:text-white hover:bg-slate-900 border border-transparent hover:border-border-dungeon rounded-lg cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 select-none">
              <span className="px-2.5 py-1 rounded-lg bg-accent-glow border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-wider">
                Level {level}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-500" />
                <span>{streak} Day Streak</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3 h-3 text-yellow-500" />
                <span>{coins} Gold</span>
              </span>
            </div>
          </div>
        </div>

        {/* Danger reset settings */}
        <div className="flex-shrink-0">
          <button
            onClick={handleResetClick}
            className="px-4 py-2.5 bg-danger-dungeon/10 border border-danger-dungeon/20 text-danger-dungeon hover:bg-danger-dungeon/20 text-xs font-bold rounded-xl cursor-pointer transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Language Mastery bars */}
        <div className="p-6 md:p-8 border border-border-dungeon bg-slate-950/20 rounded-3xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Award className="w-4.5 h-4.5 text-accent" />
            <span>Language Mastery levels</span>
          </h3>

          <div className="space-y-4">
            {['HTML', 'SQL', 'C', 'C++', 'JavaScript'].map((w) => {
              const completedList = completedStages[w] || [];
              const percent = Math.min((completedList.length / 5) * 100, 100);

              return (
                <div key={w} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">{w}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{percent}% Completed</span>
                  </div>
                  <div className="h-2.5 bg-slate-900 rounded-full border border-border-dungeon overflow-hidden p-[1px]">
                    <div
                      style={{ width: `${percent}%` }}
                      className="h-full bg-accent rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements / Badges Cabinet */}
        <div className="p-6 md:p-8 border border-border-dungeon bg-slate-950/20 rounded-3xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Trophy className="w-4.5 h-4.5 text-yellow-500" />
            <span>Badges Collection</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {badges.map((b) => {
              const isUnlocked = unlockedBadges.includes(b.id);
              return (
                <div
                  key={b.id}
                  onClick={() => isUnlocked && setSelectedBadge(b)}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all select-none relative
                    ${isUnlocked 
                      ? 'bg-slate-900 border-accent/20 hover:border-accent text-accent cursor-pointer hover:scale-103 shadow-md shadow-accent/5' 
                      : 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-60'
                    }
                  `}
                >
                  <span className={`text-2xl mb-1.5 ${isUnlocked ? 'filter drop-shadow-[0_0_4px_var(--accent-glow-strong)]' : 'grayscale'}`}>
                    {b.icon}
                  </span>
                  <span className="text-[10px] font-bold tracking-tight block truncate w-full">
                    {b.name}
                  </span>
                  {!isUnlocked && (
                    <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-slate-950 border border-border-dungeon">
                      <Lock className="w-2.5 h-2.5 text-slate-700" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Boss Gallery */}
      <div className="p-6 md:p-8 border border-border-dungeon bg-slate-950/20 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
          <Gamepad className="w-4.5 h-4.5 text-accent animate-pulse" />
          <span>Boss Defeat Gallery</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {bosses.map((boss) => {
            const completedList = completedStages[boss.world] || [];
            const isDefeated = completedList.includes(boss.stageId);

            return (
              <div
                key={boss.world}
                className={`p-4 border rounded-2xl flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300
                  ${isDefeated 
                    ? 'bg-success-dungeon/5 border-success-dungeon/20 text-slate-300' 
                    : 'bg-slate-950/40 border-border-dungeon text-slate-600 opacity-60'
                  }
                `}
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl
                    ${isDefeated ? 'bg-success-dungeon/10 text-success-dungeon' : 'bg-slate-900 border border-border-dungeon'}
                  `}>
                    {isDefeated ? boss.icon : '🔒'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-200">{boss.bossName}</h4>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{boss.world} Sector</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight select-text">
                    {boss.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-dungeon/30 w-full">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider
                    ${isDefeated 
                      ? 'bg-success-dungeon/20 text-success-dungeon border border-success-dungeon/30' 
                      : 'bg-slate-950 text-slate-600 border border-slate-900'
                    }
                  `}>
                    {isDefeated ? 'DEFEATED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-slate-900 border border-accent rounded-2xl p-6 text-center shadow-2xl shadow-accent/20"
            >
              <div className="w-16 h-16 rounded-full bg-accent-glow border border-accent/30 flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">
                {selectedBadge.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-100 tracking-wider uppercase">{selectedBadge.name}</h3>
              <p className="text-xs text-slate-400 mt-2 select-text">{selectedBadge.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-border-dungeon rounded-lg text-xs font-bold text-yellow-500">
                <Coins className="w-3.5 h-3.5 text-yellow-500" />
                <span>Award: {selectedBadge.reward}</span>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedBadge(null);
                    if (soundEnabled) soundSystem.playClick();
                  }}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-border-dungeon rounded-xl text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Close Cabinet
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
