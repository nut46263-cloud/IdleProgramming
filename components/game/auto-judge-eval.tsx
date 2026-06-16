'use client';

import React, { useEffect, useState } from 'react';
import { EvaluationResult } from '@/lib/judge/auto-judge';
import { soundSystem } from '@/lib/sound/sound-system';
import { Play, RotateCcw, Award, CheckCircle, ArrowRight, ShieldX, Terminal, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutoJudgeEvalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: EvaluationResult | null;
  onNextStage?: () => void;
}

export default function AutoJudgeEval({ isOpen, onClose, evaluation, onNextStage }: AutoJudgeEvalProps) {
  const [scanning, setScanning] = useState(true);

  // Trigger evaluation sound effects
  useEffect(() => {
    if (isOpen && evaluation) {
      setScanning(true);
      
      // Scanning simulation
      const timer = setTimeout(() => {
        setScanning(false);
        // Play grade-specific audio
        if (evaluation.grade === 'Expert') {
          soundSystem.playLevelUp();
          import('canvas-confetti').then((confetti) => {
            confetti.default({ particleCount: 80, spread: 60 });
          });
        } else if (evaluation.grade === 'Ready') {
          soundSystem.playSuccess();
        } else if (evaluation.grade === 'Retry') {
          soundSystem.playFailure();
        } else {
          soundSystem.playCoin();
        }
      }, 1800); // 1.8 seconds scan animation

      return () => clearTimeout(timer);
    }
  }, [isOpen, evaluation]);

  if (!isOpen || !evaluation) return null;

  // Radar Chart Coordinate Helper
  // 5 metrics: Correctness (Tests), Structure, Quality, Efficiency, Completion
  const metrics = [
    { label: 'Tests', val: evaluation.correctness },
    { label: 'Structure', val: evaluation.structure },
    { label: 'Quality', val: evaluation.quality },
    { label: 'Efficiency', val: evaluation.efficiency },
    { label: 'Completion', val: evaluation.completion }
  ];

  const cx = 120;
  const cy = 120;
  const r = 80;
  const numPoints = metrics.length;

  const getPointsPath = (scale: number = 1) => {
    return metrics.map((m, i) => {
      const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
      const valRatio = (m.val / 100) * scale;
      const x = cx + r * valRatio * Math.cos(angle);
      const y = cy + r * valRatio * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  const getGridPath = (ratio: number) => {
    return metrics.map((_, i) => {
      const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
      const x = cx + r * ratio * Math.cos(angle);
      const y = cy + r * ratio * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ') + ' ' + (cx + r * ratio * Math.cos(-Math.PI/2)) + ',' + (cy + r * ratio * Math.sin(-Math.PI/2));
  };

  const isPass = evaluation.score >= 60;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        {scanning ? (
          /* Scanning Laser Overlay */
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-slate-900 border border-accent rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl shadow-accent/20"
          >
            <div className="absolute inset-0 scanner-line pointer-events-none opacity-45" />
            <div className="w-16 h-16 rounded-full bg-accent-glow border border-accent/30 flex items-center justify-center mx-auto mb-6">
              <Terminal className="w-8 h-8 text-accent animate-pulse" />
            </div>
            <h3 className="text-xl font-bold tracking-widest text-slate-100 neon-glow">COMPILING & EVALUATING</h3>
            <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-wider">Running static assertions and memory sandboxing...</p>
            
            {/* Simulating code stream lines */}
            <div className="mt-6 font-mono text-[10px] text-slate-500 bg-slate-950/50 p-4 rounded-xl text-left h-24 overflow-hidden space-y-1">
              <div className="animate-pulse">&gt; c_dungeon_eval: analyzing AST tree...</div>
              <div className="animate-pulse [animation-delay:0.2s]">&gt; running 4 custom assertions...</div>
              <div className="animate-pulse [animation-delay:0.4s]">&gt; mapping code memory overhead...</div>
              <div className="animate-pulse [animation-delay:0.6s]">&gt; calculating composite ranking formula...</div>
            </div>
          </motion.div>
        ) : (
          /* Final Results Card */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-slate-900 border border-border-dungeon rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 relative shadow-2xl"
          >
            {/* Left side: Radar Chart and Grade */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Tactical Evaluation</h3>
              
              {/* SVG Radar Chart */}
              <div className="relative w-60 h-60 flex items-center justify-center bg-slate-950/30 border border-border-dungeon rounded-2xl p-2">
                <svg width="240" height="240" className="overflow-visible">
                  {/* Concentric grid lines */}
                  {[0.25, 0.5, 0.75, 1.0].map((ratio, idx) => (
                    <polygon
                      key={idx}
                      points={getGridPath(ratio)}
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Axes lines */}
                  {metrics.map((_, i) => {
                    const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
                    const x = cx + r * Math.cos(angle);
                    const y = cy + r * Math.sin(angle);
                    return (
                      <line
                        key={i}
                        x1={cx}
                        y1={cy}
                        x2={x}
                        y2={y}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Player Stats Polygon (glowing neon fill) */}
                  <polygon
                    points={getPointsPath()}
                    fill="var(--accent-glow)"
                    stroke="var(--accent-color)"
                    strokeWidth="2.5"
                    className="transition-all duration-500 filter drop-shadow-[0_0_6px_var(--accent-glow-strong)]"
                  />

                  {/* Axis Labels */}
                  {metrics.map((m, i) => {
                    const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
                    const labelRadius = r + 16;
                    const x = cx + labelRadius * Math.cos(angle);
                    const y = cy + labelRadius * Math.sin(angle);
                    
                    let textAnchor: 'middle' | 'start' | 'end' = 'middle';
                    if (Math.cos(angle) > 0.1) textAnchor = 'start';
                    else if (Math.cos(angle) < -0.1) textAnchor = 'end';

                    return (
                      <text
                        key={i}
                        x={x}
                        y={y + 3}
                        fill="#94a3b8"
                        fontSize="9.5"
                        fontWeight="700"
                        textAnchor={textAnchor}
                        className="font-sans uppercase tracking-wider"
                      >
                        {m.label}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Composite Grade Overlay */}
              <div className="mt-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Final Rank</span>
                <h4 className={`text-2xl font-black tracking-wide uppercase ${
                  evaluation.grade === 'Expert' ? 'text-yellow-400 neon-glow' :
                  evaluation.grade === 'Ready' ? 'text-success-dungeon' :
                  evaluation.grade === 'Practice More' ? 'text-accent' : 'text-danger-dungeon'
                }`}>
                  {evaluation.grade}
                </h4>
                <p className="text-xs text-slate-400 mt-1 font-bold">SCORE: {evaluation.score} / 100</p>
              </div>
            </div>

            {/* Right side: Logs & Actions */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-300 flex items-center gap-1.5 mb-3">
                  <Terminal className="w-4 h-4 text-accent" />
                  <span>COMPILER LOGS</span>
                </h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-border-dungeon h-64 overflow-y-auto font-mono text-[10px] leading-relaxed text-slate-400 space-y-1.5 select-text">
                  {evaluation.logs.map((log, idx) => {
                    let color = 'text-slate-400';
                    if (log.includes('[Test 1 PASSED]') || log.includes('[Test 2 PASSED]') || log.includes('[Test 3 PASSED]') || log.includes('[Test Result] Passed')) {
                      color = 'text-success-dungeon';
                    } else if (log.includes('[Error]') || log.includes('[Test 1 FAILED]') || log.includes('[Test 2 FAILED]') || log.includes('[Test 3 FAILED]') || log.includes('[Compile Error]')) {
                      color = 'text-danger-dungeon';
                    } else if (log.includes('[Warning]')) {
                      color = 'text-warning-dungeon';
                    } else if (log.includes('[System]') || log.includes('[Info]')) {
                      color = 'text-slate-300';
                    }
                    return (
                      <div key={idx} className={color}>
                        {log}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evaluation Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-950 border border-border-dungeon hover:border-slate-500 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-900 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Stage</span>
                </button>
                
                {isPass ? (
                  <button
                    onClick={() => {
                      if (onNextStage) {
                        onNextStage();
                      } else {
                        onClose();
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-accent hover:scale-102 text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-accent/20"
                  >
                    <span>Proceed</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-danger-dungeon/20 border border-danger-dungeon/30 text-danger-dungeon text-xs font-bold rounded-xl cursor-pointer hover:bg-danger-dungeon/30 transition-all"
                  >
                    <ShieldX className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
