'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

export default function AiMentorPanel() {
  const { soundEnabled } = useGame();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect current world and stage from query params
  const activeWorld = searchParams?.get('world') || 'HTML';
  const activeStage = searchParams?.get('stage') || 'stage1';

  // Initial welcome message based on active world
  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: `Greetings, Initiate. I am your Cyber-Mentor. I notice you are training in the **${activeWorld}** sector. What programming scroll or compiler issue shall we decipher?`,
      },
    ]);
  }, [activeWorld, activeStage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getMentorResponses = (promptType: 'hint' | 'explain' | 'debug') => {
    // Stage based mock answers
    const database: Record<string, Record<string, Record<string, string>>> = {
      HTML: {
        stage1: {
          hint: "Read through the syntax slideshow on the left. The tags represent structure. Mark each item on the checklist once complete!",
          explain: "HTML stands for HyperText Markup Language. It defines the layout and skeleton structure of a webpage using tags like <div>, <p>, and <h1>.",
          debug: "I see no syntax violations in the concept slides. Complete the slide deck, then progress to Stage 2: Practice!"
        },
        stage2: {
          hint: "Make sure you create a button with: `<button id=\"btn-dungeon\">Enter Dungeon</button>`. Check spelling and spacing!",
          explain: "The `id` attribute uniquely identifies this button on the page. In CSS or JS, you access it via `#btn-dungeon`.",
          debug: "Check your code block! Double check if you typed `id=\"btn-dungeon\"` correctly. Capitalization matters: `btn-dungeon` is not `Btn-Dungeon`."
        },
        stage5: {
          hint: "Include all four structural tags: `<header>`, `<nav>`, `<section>`, and `<footer>` in a single document.",
          explain: "Semantic tags describe their meaning to both the browser and developer, helping search engine crawlers (SEO) read your document layout.",
          debug: "Ensure each tag is correctly closed with its matching closing tag (e.g. `</nav>` closing `<nav>`)."
        }
      },
      SQL: {
        stage2: {
          hint: "Your query should be: `SELECT * FROM users WHERE age > 18;`.",
          explain: "SQL SELECT statements fetch records from a table. The WHERE clause filters results based on conditional assertions.",
          debug: "Check for missing semicolons (;) or spelling errors in table name 'users' or column name 'age'."
        }
      },
      C: {
        stage2: {
          hint: "Create a pointer by adding an asterisk: `int *ptr = &var;` where `var` is the source variable name.",
          explain: "Pointers store reference memory addresses in C. The `&` symbol retrieve the hexadecimal address of a standard variable.",
          debug: "Verify you used pointer declarations: `int *` and address references: `&`."
        }
      },
      JavaScript: {
        stage2: {
          hint: "Use `array.map(num => num * 2)` inside your function to return the doubled array.",
          explain: "The `map` method is a higher-order array function in JS that loops over items, runs a callback, and returns a new populated array.",
          debug: "Ensure the function is named exactly `doubleArray` and returns a value. If map is missing, efficiency metrics will fall."
        }
      }
    };

    const worldData = database[activeWorld] || {};
    const stageData = worldData[activeStage] || worldData['stage2'] || {
      hint: `Inside ${activeWorld}, review syntax constraints and ensure all identifiers match the instructions.`,
      explain: `${activeWorld} forms the core programming engine for this world stage. Mastering this will unlock the Project Boss.`,
      debug: `Review your code keywords. Check variable scopes, bracket pairs, or syntax terminations.`
    };

    return stageData[promptType];
  };

  const handleQuickPrompt = (type: 'hint' | 'explain' | 'debug', label: string) => {
    if (isTyping) return;
    if (soundEnabled) soundSystem.playClick();

    // User Message
    setMessages(prev => [...prev, { sender: 'user', text: label }]);
    setIsTyping(true);

    // Simulated Bot Typing delay
    setTimeout(() => {
      const response = getMentorResponses(type);
      setMessages(prev => [...prev, { sender: 'bot', text: response }]);
      setIsTyping(false);
      if (soundEnabled) soundSystem.playCoin();
    }, 1000);
  };

  return (
    <>
      {/* Floating AI Bot button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (soundEnabled) soundSystem.playClick();
        }}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-accent border border-accent/20 text-white font-bold hover:scale-110 shadow-lg shadow-accent/20 z-40 transition-transform cursor-pointer"
        title="Consult AI Mentor"
      >
        <Bot className="w-5 h-5 animate-pulse" />
      </button>

      {/* Chat Interface Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 50, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 50, scale: 0.9, opacity: 0 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[480px] bg-slate-900 border border-border-dungeon rounded-2xl flex flex-col shadow-2xl shadow-accent/10 z-40 overflow-hidden"
          >
            {/* Panel Header */}
            <div className="bg-slate-950 p-4 border-b border-border-dungeon flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-glow border border-accent/30 flex items-center justify-center">
                  <Bot className="w-4.5 h-4.5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-100 tracking-wider">AI CYBER-MENTOR</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-dungeon animate-ping" />
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">Consulting stage ({activeWorld})</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (soundEnabled) soundSystem.playClick();
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-transparent hover:border-border-dungeon cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/20">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed
                      ${m.sender === 'user'
                        ? 'bg-accent text-white rounded-br-none'
                        : 'bg-slate-900 border border-border-dungeon text-slate-200 rounded-bl-none'
                      }
                    `}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-border-dungeon text-slate-400 rounded-xl rounded-bl-none px-3.5 py-2.5 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Panel */}
            <div className="p-3 bg-slate-950/40 border-t border-border-dungeon space-y-2 select-none">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Tactical Commands</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleQuickPrompt('hint', 'Request Hint')}
                  className="px-2 py-2 text-[10px] font-bold bg-slate-900 border border-border-dungeon hover:border-accent hover:text-accent rounded-lg text-slate-300 cursor-pointer text-center truncate"
                >
                  Give Hint
                </button>
                <button
                  onClick={() => handleQuickPrompt('explain', 'Explain Concept')}
                  className="px-2 py-2 text-[10px] font-bold bg-slate-900 border border-border-dungeon hover:border-accent hover:text-accent rounded-lg text-slate-300 cursor-pointer text-center truncate"
                >
                  Explain
                </button>
                <button
                  onClick={() => handleQuickPrompt('debug', 'Audit Bugs')}
                  className="px-2 py-2 text-[10px] font-bold bg-slate-900 border border-border-dungeon hover:border-accent hover:text-accent rounded-lg text-slate-300 cursor-pointer text-center truncate"
                >
                  Audit Bugs
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
