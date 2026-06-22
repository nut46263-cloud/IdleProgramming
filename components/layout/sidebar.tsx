'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { 
  LayoutDashboard, 
  Map, 
  Flame, 
  Trophy, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  Gamepad2,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();
  const { level, soundEnabled } = useGame();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
    { name: 'Practice', path: '/challenge', icon: Flame },
    { name: 'Q&A Trivia', path: '/qa', icon: HelpCircle },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLinkClick = () => {
    if (soundEnabled) {
      soundSystem.playClick();
    }
  };

  const getRank = (lvl: number) => {
    if (lvl >= 20) return 'Archmage';
    if (lvl >= 15) return 'Spellsword';
    if (lvl >= 10) return 'Technomancer';
    if (lvl >= 5) return 'Script Knight';
    return 'Code Novice';
  };

  return (
    <div 
      className={`relative border-r border-border-dungeon bg-slate-950/80 backdrop-blur-md transition-all duration-300 flex flex-col h-screen select-none z-30
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Brand header */}
      <div className="p-6 border-b border-border-dungeon flex items-center justify-between">
        {!collapsed && (
          <Link 
            href="/dashboard" 
            onClick={handleLinkClick}
            className="flex items-center gap-2 font-extrabold tracking-wider text-xl text-accent neon-glow"
          >
            <Gamepad2 className="w-6 h-6 animate-bounce" />
            <span>DEV DUNGEON</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto text-accent neon-glow">
            <Gamepad2 className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={handleLinkClick}
              className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden
                ${isActive 
                  ? 'text-accent border border-accent/20 bg-accent-glow' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50'
                }
              `}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator" 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-accent"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-accent' : ''}`} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Character info */}
      <div className="p-4 border-t border-border-dungeon bg-slate-950/50">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-accent/20">
              {getRank(level).charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-950">
              {level}
            </div>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-slate-200 leading-tight truncate">Hero Player</h4>
              <p className="text-[11px] text-accent/80 font-medium tracking-wider uppercase truncate">{getRank(level)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => {
          setCollapsed(!collapsed);
          handleLinkClick();
        }}
        className="absolute bottom-16 -right-3 w-6 h-6 bg-slate-900 border border-border-dungeon rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer hover:border-accent shadow-lg shadow-black/50 hover:bg-slate-800"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}
