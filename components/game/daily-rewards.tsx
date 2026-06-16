'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { Gift, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyRewards() {
  const { coins, addCoins, claimDailyReward, claimedDays, soundEnabled } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  // Auto open if there is a day available and not yet claimed
  useEffect(() => {
    // Check if the current day index in the weekly loop is ready to be claimed
    // Simulating checking if day index 1-7 is not yet claimed. 
    // If user has claimed fewer days than 1, we suggest opening it on start.
    const hasUnclaimedDays = claimedDays.length < 7;
    const lastClaimedIndex = claimedDays.length > 0 ? Math.max(...claimedDays) : 0;
    
    // We open it automatically on startup once if the first reward is not claimed
    if (claimedDays.length === 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [claimedDays]);

  const rewards = [
    { day: 1, amount: 50, label: '50g' },
    { day: 2, amount: 100, label: '100g' },
    { day: 3, amount: 150, label: '150g' },
    { day: 4, amount: 200, label: '200g' },
    { day: 5, amount: 250, label: '250g' },
    { day: 6, amount: 300, label: '300g' },
    { day: 7, amount: 500, label: '500g Epic' },
  ];

  const handleClaim = (day: number, amount: number) => {
    if (claimedDays.includes(day)) return;

    if (soundEnabled) {
      soundSystem.playCoin();
    }
    
    // Add coins
    addCoins(amount);
    claimDailyReward(day);

    // Trigger confetti
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });
  };

  const currentAvailableDay = claimedDays.length + 1;

  return (
    <>
      {/* Floating Gift Box Button to trigger manually */}
      <button
        onClick={() => {
          setIsOpen(true);
          if (soundEnabled) soundSystem.playClick();
        }}
        className="fixed bottom-6 left-6 p-4 rounded-full bg-yellow-500 border border-yellow-400 text-slate-950 font-bold hover:scale-110 shadow-lg shadow-yellow-500/20 z-40 transition-transform cursor-pointer flex items-center gap-2 animate-bounce"
      >
        <Gift className="w-5 h-5" />
        {claimedDays.length < 7 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-extrabold">
            !
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-border-dungeon rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl shadow-accent/20"
            >
              {/* Decorative backgrounds */}
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (soundEnabled) soundSystem.playClick();
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-950/40 rounded-full border border-border-dungeon cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Gift className="w-8 h-8 text-yellow-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 neon-glow">
                  DAILY BOUNTY
                </h2>
                <p className="text-sm text-slate-400 mt-1.5">
                  Log in every day to claim gold coins to fund your coding adventures!
                </p>
              </div>

              {/* Grid of days */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-8">
                {rewards.map((r) => {
                  const isClaimed = claimedDays.includes(r.day);
                  const isAvailable = r.day === currentAvailableDay;
                  const isFuture = r.day > currentAvailableDay;

                  return (
                    <div
                      key={r.day}
                      onClick={() => isAvailable && handleClaim(r.day, r.amount)}
                      className={`relative flex flex-col items-center p-3 rounded-xl border transition-all select-none
                        ${isClaimed 
                          ? 'bg-slate-950/60 border-success-dungeon/20 text-success-dungeon opacity-80' 
                          : isAvailable 
                            ? 'bg-accent/10 border-accent text-accent cursor-pointer hover:scale-105 hover:bg-accent/20 shadow-md shadow-accent/10' 
                            : 'bg-slate-950/40 border-border-dungeon text-slate-500 opacity-60'
                        }
                      `}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider mb-2">Day {r.day}</span>
                      
                      {isClaimed ? (
                        <CheckCircle2 className="w-6 h-6 text-success-dungeon mb-2" />
                      ) : (
                        <Gift className={`w-6 h-6 mb-2 ${isAvailable ? 'text-accent animate-bounce' : 'text-slate-600'}`} />
                      )}

                      <span className={`text-xs font-extrabold ${isAvailable ? 'text-slate-100' : ''}`}>
                        {r.label}
                      </span>

                      {/* Glowing effect for the Epic Day 7 */}
                      {r.day === 7 && !isClaimed && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Details */}
              <div className="text-center">
                {claimedDays.length === 7 ? (
                  <p className="text-sm text-success-dungeon font-semibold flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>All rewards claimed! Check back next week.</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Next claim available in <span className="font-semibold text-slate-300">24 hours</span>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
