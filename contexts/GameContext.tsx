'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundSystem } from '@/lib/sound/sound-system';

export type ThemeType = 'purple' | 'cyan' | 'amber';

export interface GameContextProps {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  unlockedWorlds: string[];
  completedStages: Record<string, string[]>; // world -> list of completed stageIds
  unlockedBadges: string[];
  activeTheme: ThemeType;
  soundEnabled: boolean;
  isHydrated: boolean;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  completeStage: (worldId: string, stageId: string) => void;
  unlockWorld: (worldId: string) => void;
  unlockBadge: (badgeId: string) => void;
  setTheme: (theme: ThemeType) => void;
  setSoundEnabled: (enabled: boolean) => void;
  resetGame: () => void;
  claimDailyReward: (dayIndex: number) => void;
  claimedDays: number[];
  isDayMode: boolean;
  toggleDayMode: () => void;
}

const LOCAL_STORAGE_KEY = 'dev_dungeon_game_state';

interface GameState {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActiveDate: string;
  unlockedWorlds: string[];
  completedStages: Record<string, string[]>;
  unlockedBadges: string[];
  activeTheme: ThemeType;
  soundEnabled: boolean;
  claimedDays: number[];
  isDayMode: boolean;
}

const defaultState: GameState = {
  xp: 0,
  level: 1,
  coins: 50,
  streak: 1,
  lastActiveDate: '',
  unlockedWorlds: ['HTML'],
  completedStages: {
    HTML: [],
    SQL: [],
    C: [],
    'C++': [],
    JavaScript: [],
  },
  unlockedBadges: [],
  activeTheme: 'purple',
  soundEnabled: true,
  claimedDays: [],
  isDayMode: true,
};

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Check streak logic on load
          const today = new Date().toDateString();
          let currentStreak = parsed.streak || 1;
          let lastDate = parsed.lastActiveDate || '';

          if (lastDate && lastDate !== today) {
            const lastActiveTime = new Date(lastDate).getTime();
            const todayTime = new Date(today).getTime();
            const diffTime = Math.abs(todayTime - lastActiveTime);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              currentStreak += 1;
            } else if (diffDays > 1) {
              currentStreak = 1; // Streak broken
            }
            lastDate = today;
          } else if (!lastDate) {
            lastDate = today;
          }

          const loadedState = {
            ...defaultState,
            ...parsed,
            streak: currentStreak,
            lastActiveDate: lastDate,
          };
          setState(loadedState);
          soundSystem.setEnabled(loadedState.soundEnabled);
        } catch (e) {
          console.error("Failed to parse local storage state", e);
        }
      } else {
        // First time initialization
        const today = new Date().toDateString();
        setState(prev => ({ ...prev, lastActiveDate: today }));
      }
      setIsHydrated(true);
    }
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  // Sound sync
  useEffect(() => {
    soundSystem.setEnabled(state.soundEnabled);
  }, [state.soundEnabled]);

  const addXP = (amount: number) => {
    setState(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let leveledUp = false;

      // level-up threshold formula: level * 100
      let xpNeeded = newLevel * 100;
      while (newXP >= xpNeeded) {
        newXP -= xpNeeded;
        newLevel += 1;
        xpNeeded = newLevel * 100;
        leveledUp = true;
      }

      if (leveledUp) {
        setTimeout(() => {
          soundSystem.playLevelUp();
          // Import dynamic canvas-confetti inside function to ensure client execution
          import('canvas-confetti').then((confetti) => {
            confetti.default({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 }
            });
          });
        }, 100);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  const addCoins = (amount: number) => {
    setState(prev => {
      const newCoins = prev.coins + amount;
      let badges = [...prev.unlockedBadges];
      if (newCoins >= 500 && !badges.includes('wealthy')) {
        badges.push('wealthy');
        soundSystem.playSuccess();
      }
      return {
        ...prev,
        coins: newCoins,
        unlockedBadges: badges,
      };
    });
  };

  const completeStage = (worldId: string, stageId: string) => {
    setState(prev => {
      const completed = prev.completedStages[worldId] || [];
      if (completed.includes(stageId)) return prev; // already completed

      const newCompleted = [...completed, stageId];
      const updatedStages = {
        ...prev.completedStages,
        [worldId]: newCompleted,
      };

      // Check badge unlocks
      const badges = [...prev.unlockedBadges];
      if (!badges.includes('first_step')) {
        badges.push('first_step');
      }

      // Check if world is fully completed (5 stages)
      const worldBadges: Record<string, string> = {
        HTML: 'html_master',
        SQL: 'sql_master',
        C: 'c_master',
        'C++': 'cpp_master',
        JavaScript: 'js_master',
      };

      if (newCompleted.length === 5 && worldBadges[worldId] && !badges.includes(worldBadges[worldId])) {
        badges.push(worldBadges[worldId]);
      }

      return {
        ...prev,
        completedStages: updatedStages,
        unlockedBadges: badges,
      };
    });
  };

  const unlockWorld = (worldId: string) => {
    setState(prev => {
      if (prev.unlockedWorlds.includes(worldId)) return prev;
      return {
        ...prev,
        unlockedWorlds: [...prev.unlockedWorlds, worldId],
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setState(prev => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId],
      };
    });
  };

  const setTheme = (theme: ThemeType) => {
    setState(prev => ({ ...prev, activeTheme: theme }));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, soundEnabled: enabled }));
  };

  const claimDailyReward = (dayIndex: number) => {
    setState(prev => {
      if (prev.claimedDays.includes(dayIndex)) return prev;
      return {
        ...prev,
        claimedDays: [...prev.claimedDays, dayIndex]
      };
    });
  };

  const resetGame = () => {
    const today = new Date().toDateString();
    setState({
      ...defaultState,
      lastActiveDate: today,
    });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const toggleDayMode = () => {
    setState(prev => ({ ...prev, isDayMode: !prev.isDayMode }));
    if (state.soundEnabled) {
      soundSystem.playClick();
    }
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        isHydrated,
        addXP,
        addCoins,
        completeStage,
        unlockWorld,
        unlockBadge,
        setTheme,
        setSoundEnabled,
        resetGame,
        claimDailyReward,
        toggleDayMode,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
