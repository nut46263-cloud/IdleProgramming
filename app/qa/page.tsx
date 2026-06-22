'use client';

import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Sparkles, 
  Coins, 
  Flame, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export default function QATriviaPage() {
  const { addXP, addCoins, soundEnabled } = useGame();

  const [activeCategory, setActiveCategory] = useState<string>('HTML');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  
  // Local Stats
  const [stats, setStats] = useState({
    answered: 0,
    correct: 0,
    streak: 0,
    highStreak: 0,
  });

  const categories = ['HTML', 'SQL', 'C', 'C++', 'JavaScript'];

  const questionDb: Record<string, Question[]> = {
    HTML: [
      {
        id: 1,
        question: 'What does HTML stand for?',
        options: [
          'HyperText Markup Language',
          'HighText Machine Language',
          'HyperText Markdown Link',
          'Hyperlink Text Multi Language'
        ],
        answerIndex: 0,
        explanation: 'HTML stands for HyperText Markup Language, which is the standard formatting language used to construct structure and scaffolding on webpages.'
      },
      {
        id: 2,
        question: 'Which HTML tag is used to render the largest primary heading?',
        options: ['<heading>', '<h6>', '<h1>', '<head>'],
        answerIndex: 2,
        explanation: '<h1> is semantic HTML tag reserved for the page\'s main heading. Other tags like <h2> through <h6> represent descending sub-sections.'
      },
      {
        id: 3,
        question: 'Which of the following elements represents a semantic layout tag in HTML5?',
        options: ['<div>', '<section>', '<span>', '<style>'],
        answerIndex: 1,
        explanation: '<section> describes its layout purpose semantically to both browsers and search engines, whereas <div> is a generic layout container.'
      },
      {
        id: 4,
        question: 'What is the correct tag attribute structure to set a hyperlink destination?',
        options: [
          '<a url="http://site.com">',
          '<a href="http://site.com">',
          '<a link="http://site.com">',
          '<link src="http://site.com">'
        ],
        answerIndex: 1,
        explanation: 'The <a> tag uses the "href" (Hypertext Reference) attribute to specify the destination URL of a link.'
      },
      {
        id: 5,
        question: 'Which element attribute specifies that an input field must be filled out before submitting?',
        options: ['validate', 'secure', 'required', 'placeholder'],
        answerIndex: 2,
        explanation: 'The "required" boolean attribute forces the browser form validation to ensure the input field contains data before form submission compiles.'
      }
    ],
    SQL: [
      {
        id: 1,
        question: 'What does SQL stand for?',
        options: [
          'Structured Question Language',
          'Simple Query Language',
          'Structured Query Language',
          'Schema Query Layout'
        ],
        answerIndex: 2,
        explanation: 'SQL stands for Structured Query Language, the standardized query language used to manage and manipulate relational databases.'
      },
      {
        id: 2,
        question: 'Which SQL keyword retrieves only distinct/non-duplicate column values?',
        options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'SINGLE'],
        answerIndex: 1,
        explanation: 'The DISTINCT keyword aggregates and filters query outputs to remove duplicate row items.'
      },
      {
        id: 3,
        question: 'How do you select all column fields from a table named "users"?',
        options: [
          'SELECT ALL FROM users',
          'SELECT * FROM users',
          'SELECT columns FROM users',
          'GET * FROM users'
        ],
        answerIndex: 1,
        explanation: 'The asterisk symbol (*) in SQL functions as a wildcard representing all table column fields.'
      },
      {
        id: 4,
        question: 'Which SQL clause filters grouped rows aggregated by SUM() or COUNT() functions?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP FILTER'],
        answerIndex: 1,
        explanation: 'The HAVING clause filters grouped records created by GROUP BY. The WHERE clause filters rows prior to groupings.'
      },
      {
        id: 5,
        question: 'What is a Primary Key in database schemas?',
        options: [
          'A key that unlocks password encryption',
          'A duplicate lookup indicator',
          'A unique column constraint identifying each row record',
          'An external pointer referencing foreign schemas'
        ],
        answerIndex: 2,
        explanation: 'A Primary Key specifies a column or set of columns whose values uniquely and explicitly identify each row record inside a table.'
      }
    ],
    C: [
      {
        id: 1,
        question: 'What is a Pointer variable in C?',
        options: [
          'An index offset tracker',
          'A variable that stores a memory address',
          'A floating-point numerical container',
          'A loop controller variable'
        ],
        answerIndex: 1,
        explanation: 'Pointers are variables that store the hex memory address of another variable rather than storing values directly.'
      },
      {
        id: 2,
        question: 'Which operator retrieves the memory address of a variable in C?',
        options: ['*', '&', 'ptr()', 'ref()'],
        answerIndex: 1,
        explanation: 'The ampersand (&) is the address-of operator in C. It returns the memory address location of a variable.'
      },
      {
        id: 3,
        question: 'Which function allocates dynamic uninitialized heap blocks in C?',
        options: ['alloc()', 'malloc()', 'new()', 'reserve()'],
        answerIndex: 1,
        explanation: 'malloc() (Memory Allocation) reserves a contiguous block of bytes on the heap and returns a void pointer to the block.'
      },
      {
        id: 4,
        question: 'What header file must be imported to run standard printf() output operations?',
        options: ['<stdlib.h>', '<conio.h>', '<stdio.h>', '<string.h>'],
        answerIndex: 2,
        explanation: '<stdio.h> (Standard Input/Output) defines core streams and output function declarations like printf() and scanf().'
      },
      {
        id: 5,
        question: 'What is the purpose of the free() statement in C?',
        options: [
          'Deletes target source files',
          'Resets CPU thread clock execution',
          'Deallocates memory blocks previously allocated on the heap',
          'Nullifies pointers to prevent segmentation faults'
        ],
        answerIndex: 2,
        explanation: 'The free() function deallocates heap segments allocated via malloc() or calloc() to prevent severe memory leaks.'
      }
    ],
    'C++': [
      {
        id: 1,
        question: 'Which operator specifies class inheritance derivations in C++?',
        options: [':', 'extends', 'inherits', 'subclass'],
        answerIndex: 0,
        explanation: 'C++ uses the colon (:) operator to specify derived inheritance structures (e.g. class Wizard : public Warrior).'
      },
      {
        id: 2,
        question: 'What is encapsulation in Object-Oriented Programming?',
        options: [
          'Dynamic runtime polymorphism binding',
          'Bundling data members and functions into a singular class unit',
          'Declaring virtual header templates',
          'Instantiating dynamic numeric arrays'
        ],
        answerIndex: 1,
        explanation: 'Encapsulation restricts direct access to object components by wrapping data properties and member functions into a single class.'
      },
      {
        id: 3,
        question: 'Which access modifier exposes members to any outside classes or objects?',
        options: ['private', 'protected', 'public', 'friend'],
        answerIndex: 2,
        explanation: 'Members declared under public: access specifier can be accessed and modified by any functions inside or outside the package.'
      },
      {
        id: 4,
        question: 'What is a Virtual Function in C++?',
        options: [
          'A placeholder method with no logic',
          'A base class method designed to be overridden in derived subclasses',
          'An inline assembly compiler directive',
          'A static math function that returns constants'
        ],
        answerIndex: 1,
        explanation: 'A virtual function ensures dynamic binding/polymorphism, enabling a derived class to override methods defined in base classes.'
      },
      {
        id: 5,
        question: 'What is the standard C++ output stream console indicator?',
        options: ['printf()', 'print()', 'cout', 'System.out'],
        answerIndex: 2,
        explanation: 'cout (Character Output) represents the standard console output stream buffer in C++, usually combined with the << insertion operator.'
      }
    ],
    JavaScript: [
      {
        id: 1,
        question: 'Which keyword declares a block-scoped variable that cannot be re-declared?',
        options: ['var', 'let', 'global', 'define'],
        answerIndex: 1,
        explanation: 'let and const declare block-scoped variables. Unlike var, let prevents variables from being re-declared within the same scope block.'
      },
      {
        id: 2,
        question: 'What does the operator expression "typeof null" return in JavaScript?',
        options: ['"null"', '"undefined"', '"object"', '"function"'],
        answerIndex: 2,
        explanation: 'In JavaScript, typeof null returns "object". This is a long-standing legacy bug from the original JS prototype design.'
      },
      {
        id: 3,
        question: 'Which array method applies a callback to map items and outputs a new array?',
        options: ['forEach()', 'map()', 'reduce()', 'push()'],
        answerIndex: 1,
        explanation: 'The map() method creates a new array populated with the results of calling a provided callback function on every element in the calling array.'
      },
      {
        id: 4,
        question: 'What does DOM stand for in frontend engineering?',
        options: [
          'Document Object Model',
          'Data Object Management',
          'Digital Order Modifier',
          'Direct Operations Module'
        ],
        answerIndex: 0,
        explanation: 'DOM stands for Document Object Model, the browser interface tree that represents and structures HTML pages as objects.'
      },
      {
        id: 5,
        question: 'What is a Closure in JavaScript scope execution?',
        options: [
          'Terminating a loop cycle early',
          'An inner function retaining access to variables in its outer parent scope',
          'Garbage collector clearing heap states',
          'Private encapsulation classes'
        ],
        answerIndex: 1,
        explanation: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment, allowing inner functions to access outer variables.'
      }
    ]
  };

  const activeQuestions = questionDb[activeCategory] || [];
  const currentQuestion = activeQuestions[currentQuestionIdx];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    if (soundEnabled) soundSystem.playClick();
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);

    const isCorrect = selectedOption === currentQuestion.answerIndex;
    
    // Stats updates
    const nextAnsweredCount = stats.answered + 1;
    const nextCorrectCount = isCorrect ? stats.correct + 1 : stats.correct;
    const nextStreak = isCorrect ? stats.streak + 1 : 0;
    const nextHighStreak = Math.max(stats.highStreak, nextStreak);

    setStats({
      answered: nextAnsweredCount,
      correct: nextCorrectCount,
      streak: nextStreak,
      highStreak: nextHighStreak
    });

    if (isCorrect) {
      if (soundEnabled) {
        soundSystem.playCoin();
      }
      addXP(15);
      addCoins(10);
      import('canvas-confetti').then((confetti) => {
        confetti.default({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
      });
    } else {
      if (soundEnabled) {
        soundSystem.playFailure();
      }
    }
  };

  const handleNextQuestion = () => {
    if (soundEnabled) soundSystem.playClick();
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Loop back to start
      setCurrentQuestionIdx(0);
    }
  };

  const handleCategoryChange = (cat: string) => {
    if (soundEnabled) soundSystem.playClick();
    setActiveCategory(cat);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const correctRate = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;

  return (
    <div className="space-y-8 select-none pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 uppercase tracking-tight">QUICK Q&A TRIVIA</h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium uppercase tracking-wider">Answer quick programming trivia to earn coins & XP</p>
        </div>

        {/* Category selector */}
        <div className="flex flex-wrap p-1 bg-slate-950 border border-border-dungeon rounded-xl gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider cursor-pointer uppercase transition-all
                ${activeCategory === cat 
                  ? 'bg-accent text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Left - Stats, Right - Game Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left column: stats scoreboard */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-2xl border border-border-dungeon bg-slate-950/20 space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>Scoreboard</span>
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="p-3 bg-slate-950/40 border border-border-dungeon/50 rounded-xl flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase leading-none font-bold">Accuracy</p>
                  <p className="font-extrabold text-sm mt-0.5 text-slate-100">{correctRate}%</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 border border-border-dungeon/50 rounded-xl flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase leading-none font-bold">Streak</p>
                  <p className="font-extrabold text-sm mt-0.5 text-slate-100">{stats.streak} / {stats.highStreak}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-border-dungeon/30 pt-3 text-xs text-slate-400">
              <div className="flex justify-between font-bold">
                <span>Total Answered</span>
                <span className="text-slate-200">{stats.answered}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Correct Answers</span>
                <span className="text-success-dungeon">{stats.correct}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Trivia Card */}
        <div className="lg:col-span-3">
          {currentQuestion ? (
            <div className="p-6 md:p-8 rounded-3xl border border-border-dungeon bg-slate-950/20 space-y-6 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="space-y-6">
                
                {/* Stage Header */}
                <div className="flex justify-between items-center select-none">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-border-dungeon text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Question {currentQuestionIdx + 1} / {activeQuestions.length}
                  </span>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold bg-slate-950 px-2 py-0.5 rounded border border-border-dungeon">
                      <Coins className="w-3 h-3" /> +10g
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-accent font-bold bg-slate-950 px-2 py-0.5 rounded border border-border-dungeon">
                      <Sparkles className="w-3 h-3" /> +15xp
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <h2 className="text-lg md:text-xl font-bold text-slate-100 leading-snug select-text">
                  {currentQuestion.question}
                </h2>

                {/* Answer Options Grid (4 Choices!) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectAnswer = idx === currentQuestion.answerIndex;
                    
                    let cardStyle = 'bg-slate-900 border-border-dungeon text-slate-300 hover:border-slate-500';
                    if (isAnswered) {
                      if (isCorrectAnswer) {
                        cardStyle = 'bg-success-dungeon/10 border-success-dungeon text-success-dungeon';
                      } else if (isSelected) {
                        cardStyle = 'bg-danger-dungeon/10 border-danger-dungeon text-danger-dungeon';
                      } else {
                        cardStyle = 'bg-slate-950/40 border-border-dungeon text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      cardStyle = 'bg-accent-glow border-accent text-accent';
                    }

                    const labels = ['A', 'B', 'C', 'D'];

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswered}
                        className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all text-xs font-bold leading-relaxed cursor-pointer
                          ${cardStyle}
                          ${!isAnswered ? 'hover:scale-[1.01]' : ''}
                        `}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black flex-shrink-0 text-[10px] border
                          ${isSelected 
                            ? 'bg-accent text-white border-accent' 
                            : isAnswered && isCorrectAnswer
                              ? 'bg-success-dungeon text-white border-success-dungeon'
                              : 'bg-slate-950 border-border-dungeon text-slate-500'
                          }
                        `}>
                          {labels[idx]}
                        </div>
                        <span className="pt-0.5">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation container */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4.5 rounded-2xl border border-border-dungeon bg-slate-950/50 space-y-2 select-text"
                    >
                      <h4 className="font-black text-xs text-accent flex items-center gap-1.5 uppercase tracking-wider">
                        <BookOpen className="w-4 h-4" />
                        <span>Explanation Detail</span>
                      </h4>
                      <p className="text-[11px] leading-relaxed text-slate-400">
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border-dungeon/30 select-none">
                {!isAnswered ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="w-full py-3.5 bg-accent hover:scale-102 transition-all font-black text-xs uppercase tracking-wider text-white shadow-lg shadow-accent/25 rounded-xl cursor-pointer disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    Lock in Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:scale-102 border border-border-dungeon hover:border-slate-500 transition-all font-black text-xs uppercase tracking-wider text-slate-200 rounded-xl cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-950/20 border border-border-dungeon rounded-3xl">
              <HelpCircle className="w-10 h-10 mx-auto mb-4 text-accent animate-pulse" />
              <h3 className="font-extrabold text-lg">No Questions Found</h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
