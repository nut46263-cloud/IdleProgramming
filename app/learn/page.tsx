'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import { soundSystem } from '@/lib/sound/sound-system';
import { judgeCode, EvaluationResult } from '@/lib/judge/auto-judge';
import AutoJudgeEval from '@/components/game/auto-judge-eval';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  BookOpen, 
  HelpCircle, 
  ArrowLeft,
  CheckCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Code,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function LearnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    addXP, 
    addCoins, 
    completeStage, 
    soundEnabled,
    completedStages
  } = useGame();

  const activeWorld = searchParams?.get('world') || 'HTML';
  const activeStage = searchParams?.get('stage') || 'stage1';

  // State Management
  const [code, setCode] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);

  // Stage 1 slideshow state
  const [activeSlide, setActiveSlide] = useState(0);
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Lesson & Templates Database
  const lessonDb: Record<string, Record<string, {
    title: string;
    instructions: string;
    template: string;
    slides?: { title: string; content: string }[];
    bullets: string[];
    xp: number;
    coins: number;
  }>> = {
    HTML: {
      stage1: {
        title: 'HTML Structure & Semantic Tags',
        instructions: 'Study the slides on the right. Understand tags, properties, and layouts. Mark all checkboxes in the concepts check to complete this lesson.',
        bullets: ['Tags define structural hierarchy.', 'Semantic layouts describe layout context (nav, footer).', 'Attributes customize elements (id, class).'],
        xp: 10,
        coins: 10,
        slides: [
          { title: 'What is HTML?', content: 'HTML (HyperText Markup Language) forms the skeletal scaffolding of all web apps. It uses hierarchical tags wrapped in angle brackets (e.g. <div>content</div>).' },
          { title: 'The Power of Semantic Tags', content: 'Semantic tags (like <header>, <nav>, <section>, <footer>) communicate structural meaning to search engines (SEO) and developers, replacing generic divs.' },
          { title: 'Element Attributes', content: 'Attributes customize tags with extra controls. The id attribute (e.g. id="my-btn") uniquely distinguishes a tag in the document object model.' }
        ],
        template: ''
      },
      stage2: {
        title: 'Button Practice',
        instructions: 'Write a single button element in the editor. Set its id attribute to "btn-dungeon" and write the text "Enter Dungeon" inside it.',
        bullets: ['Must use <button> tag.', 'Must set attribute id="btn-dungeon".', 'Must close the button tag correctly.'],
        xp: 30,
        coins: 20,
        template: '<!-- Create your button tag below -->\n'
      },
      stage3: {
        title: 'Itemized Lists',
        instructions: 'Construct an unordered list (<ul>) containing exactly three list items (<li>) describing your dungeon gear (e.g. Sword, Shield, Potions).',
        bullets: ['Wrap in <ul> tags.', 'Create at least 3 separate <li> tag entries.', 'Ensure tags are closed.'],
        xp: 40,
        coins: 30,
        template: '<!-- Create your unordered list with 3 list items -->\n'
      },
      stage4: {
        title: 'Auto Judge Checklist',
        instructions: 'Write a button with class "btn-neon" and id "btn-dungeon" containing the label "Run Mission". Make sure it is clean and documented.',
        bullets: ['Create button.', 'Add id="btn-dungeon".', 'Close tags.'],
        xp: 50,
        coins: 40,
        template: '<!-- Write button code -->\n'
      },
      stage5: {
        title: 'Portfolio Boss',
        instructions: 'Construct a complete semantic layout containing: a <header>, a <nav>, a <section>, and a <footer> to defeat the HTML Boss.',
        bullets: ['Include <header> tag.', 'Include <nav> tag.', 'Include <section> tag.', 'Include <footer> tag.'],
        xp: 150,
        coins: 100,
        template: '<!-- Build a semantic page structure below -->\n<header>\n  \n</header>\n'
      }
    },
    SQL: {
      stage1: {
        title: 'Relational Database Sanctuary',
        instructions: 'Study the slides on the right. Understand query structures, conditions, and groupings. Check all concept boxes to proceed.',
        bullets: ['SQL retrieves data from relational tables.', 'SELECT specifies columns to fetch.', 'WHERE sets conditional filtering criteria.'],
        xp: 10,
        coins: 10,
        slides: [
          { title: 'Relational Tables', content: 'SQL interacts with tables arranged in columns and rows. Database tables utilize schemas containing data types and constraints.' },
          { title: 'Filtering with WHERE', content: 'Use the WHERE clause to selectively choose records. Operators include =, >, <, LIKE, and IN.' },
          { title: 'Aggegations & Groups', content: 'GROUP BY aggregates data according to categories. SUM(), COUNT(), and AVG() calculate totals across grouped columns.' }
        ],
        template: ''
      },
      stage2: {
        title: 'SELECT Users Age',
        instructions: 'Write a SQL query that fetches all fields (*) from the "users" table, filtering for records where the user\'s "age" is greater than 18.',
        bullets: ['Use SELECT * statement.', 'Target table name: users.', 'WHERE condition: age > 18.'],
        xp: 30,
        coins: 20,
        template: '-- Write your query below to select users over age 18\n'
      },
      stage3: {
        title: 'Aggregated Gold',
        instructions: 'Write a SQL statement that selects and groups "gold" totals by player "rank", using the GROUP BY clause and SUM(gold) function.',
        bullets: ['Must contain GROUP BY rank.', 'Must contain SUM(gold) aggregation.'],
        xp: 40,
        coins: 30,
        template: '-- Write grouping query below\n'
      },
      stage4: {
        title: 'Assert Conditions',
        instructions: 'Write a SQL query selecting * from users table where age > 18. Include a comment starting with -- to explain your query.',
        bullets: ['Write valid query.', 'Include inline comments.'],
        xp: 50,
        coins: 40,
        template: '-- Write query\n'
      },
      stage5: {
        title: 'JOIN Boss',
        instructions: 'Synthesize data across schemas. Write a JOIN statement combining the "users" and "badges" tables to defeat the SQL Boss.',
        bullets: ['Must utilize JOIN or INNER JOIN statement.'],
        xp: 150,
        coins: 100,
        template: '-- Combine users and badges tables using JOIN\nSELECT * FROM users\n'
      }
    },
    C: {
      stage1: {
        title: 'Pointers & Address Logic',
        instructions: 'Study memory architecture and address indicators. Check all boxes to proceed.',
        bullets: ['C allocates local variables in stack memory.', 'Pointers are variables that store hexadecimal memory addresses.', 'Use & to get addresses, * to dereference.'],
        xp: 15,
        coins: 10,
        slides: [
          { title: 'What is Memory?', content: 'Every variable sits in a hardware slot identified by a hex memory address. C allows us to view and manipulate this memory.' },
          { title: 'Reference Operator (&)', content: 'The ampersand (&) retrieves the address of a variable. E.g. &var yields the address of var.' },
          { title: 'Pointers (*)', content: 'Pointers are specialized variables holding addresses. Declared using an asterisk (e.g. int *ptr).' }
        ],
        template: ''
      },
      stage2: {
        title: 'Pointer Memory reference',
        instructions: 'Inside the main function, declare a pointer to an integer named "ptr" and assign it the address of "var" (&var).',
        bullets: ['Declare pointer: int *ptr.', 'Assign reference address: &var.'],
        xp: 35,
        coins: 20,
        template: '#include <stdio.h>\n\nint main() {\n    int var = 100;\n    // Declare ptr and assign it &var below\n    \n    return 0;\n}'
      },
      stage3: {
        title: 'Numeric Swapper',
        instructions: 'Write the body of the "swap" function. It takes two pointer arguments (int *a, int *b) and swaps their dereferenced values using a temp variable.',
        bullets: ['Swap values by dereferencing *a and *b.', 'Use a temporary variable (int temp).'],
        xp: 45,
        coins: 30,
        template: '#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    // Write swapping logic below\n    \n}\n\nint main() {\n    int x = 5, y = 10;\n    swap(&x, &y);\n    return 0;\n}'
      },
      stage4: {
        title: 'Pointer Compiles',
        instructions: 'Assign value 50 to integer var using pointer ptr. Ensure comments are present.',
        bullets: ['Use *ptr = 50.', 'Write inline comments.'],
        xp: 55,
        coins: 40,
        template: '#include <stdio.h>\n\nint main() {\n    int var = 10;\n    int *ptr = &var;\n    // Set var to 50 using ptr here\n    \n    return 0;\n}'
      },
      stage5: {
        title: 'Malloc Boss',
        instructions: 'Allocate memory dynamically for a struct or block using malloc, then free the memory to defeat the C pointer Boss.',
        bullets: ['Use malloc function.', 'Use free function.'],
        xp: 160,
        coins: 100,
        template: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // Dynamically allocate memory, then free it below\n    \n    return 0;\n}'
      }
    },
    'C++': {
      stage1: {
        title: 'Object Oriented C++',
        instructions: 'Read virtual classes and scopes slides. Check all boxes to proceed.',
        bullets: ['Classes encapsulate members and functions.', 'Access specifiers (public, private) limit visibility.', 'Polymorphism allows dynamic method binding.'],
        xp: 15,
        coins: 10,
        slides: [
          { title: 'Classes & Objects', content: 'C++ classes group data attributes and actions together. Objects are concrete instantiations of these classes.' },
          { title: 'Access Scopes', content: 'Public scope allows external classes to call variables and methods. Private scope locks variables within class bounds.' },
          { title: 'Virtual Polymorphism', content: 'Use virtual functions and overrides to let sub-classes implement custom methods while retaining base types.' }
        ],
        template: ''
      },
      stage2: {
        title: 'Warrior Instance',
        instructions: 'Declare a class named "Warrior" with a public block. Include a member function "void attack()" inside the class that outputs messages.',
        bullets: ['Define class Warrior.', 'Define public: scope.', 'Implement attack() function.'],
        xp: 35,
        coins: 20,
        template: '#include <iostream>\nusing namespace std;\n\n// Create Warrior class below\n\nint main() {\n    return 0;\n}'
      },
      stage3: {
        title: 'Inherited Wizard',
        instructions: 'Create a "Wizard" class that inherits from "Warrior" (class Wizard : public Warrior). Override the attack method using the virtual override system.',
        bullets: ['Wizard derives from Warrior.', 'Override attack function.'],
        xp: 45,
        coins: 30,
        template: '#include <iostream>\nusing namespace std;\n\nclass Warrior {\npublic:\n    virtual void attack() {\n        cout << "Slash!" << endl;\n    }\n};\n\n// Create Wizard class below inheriting from Warrior\n'
      },
      stage4: {
        title: 'Polymorphic Compiles',
        instructions: 'Implement virtual methods and templates in a test script. Ensure code is commented.',
        bullets: ['Use templates (<typename T>).', 'Add comments.'],
        xp: 55,
        coins: 40,
        template: '#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nclass Combatant {\n  // Implement structure\n};\n'
      },
      stage5: {
        title: 'RPG Battle Boss',
        instructions: 'Declare templates or subclass loops to orchestrate an RPG battle state algorithm to defeat the C++ Boss.',
        bullets: ['Use templates or polymorph virtual bindings.'],
        xp: 170,
        coins: 100,
        template: '#include <iostream>\nusing namespace std;\n\ntemplate <typename T>\nvoid fight(T player) {\n    // Implement fight logic\n}\n'
      }
    },
    JavaScript: {
      stage1: {
        title: 'JavaScript Event Loops & Functions',
        instructions: 'Master closures, scopes, and map methods. Check all boxes to proceed.',
        bullets: ['Arrays support map and reduce operations.', 'Map applies callbacks and outputs loaded arrays.', 'Event loops schedule animations dynamically.'],
        xp: 15,
        coins: 10,
        slides: [
          { title: 'Functional Arrays', content: 'Modern JS relies on functional transformations. Map, filter, and reduce avoid manual index loops and mutations.' },
          { title: 'Array.map()', content: 'The map method takes a callback function and populates a brand new array with output elements.' },
          { title: 'The Event Loop', content: 'JavaScript runs in a single thread. Timers and animation ticks schedule calculations asynchronously.' }
        ],
        template: ''
      },
      stage2: {
        title: 'Array Double',
        instructions: 'Implement a function named "doubleArray" that takes an array "arr" as an argument, and returns a new array with all values doubled using the map function.',
        bullets: ['Function named doubleArray.', 'Use .map() method.', 'Double each value (* 2).'],
        xp: 35,
        coins: 20,
        template: 'function doubleArray(arr) {\n  // Return a new array with values doubled using .map()\n  \n}'
      },
      stage3: {
        title: 'Vowel Counting',
        instructions: 'Implement a function named "countVowels" that takes a string "str" and returns the number of vowels (a, e, i, o, u) present in it.',
        bullets: ['Function named countVowels.', 'Iterate and check vowels.', 'Return count.'],
        xp: 45,
        coins: 30,
        template: 'function countVowels(str) {\n  // Count and return vowels in str\n  \n}'
      },
      stage4: {
        title: 'Dojo Assertions',
        instructions: 'Write doubleArray array mapping function with inline comments.',
        bullets: ['Use map.', 'Write comments.'],
        xp: 55,
        coins: 40,
        template: '// doubleArray method\nfunction doubleArray(arr) {\n  \n}'
      },
      stage5: {
        title: 'Dojo Game Loop Boss',
        instructions: 'Orchestrate a ticking game scheduler using requestAnimationFrame or setInterval logic to defeat the JS Dojo Boss.',
        bullets: ['Use requestAnimationFrame or setInterval.'],
        xp: 180,
        coins: 100,
        template: 'function runGameLoop() {\n  // Schedule game loop frames below\n  \n}\n'
      }
    }
  };

  const currentStageData = lessonDb[activeWorld]?.[activeStage];

  // Set template code when world or stage changes
  useEffect(() => {
    if (currentStageData) {
      setCode(currentStageData.template);
      setConsoleLogs([`[System] Code workspace initialized for ${activeWorld} - ${currentStageData.title}.`]);
      // Reset slide stats
      setActiveSlide(0);
      setChecks([false, false, false]);
    }
  }, [activeWorld, activeStage]);

  if (!currentStageData) {
    return (
      <div className="p-8 text-center text-slate-400">
        <AlertCircle className="w-10 h-10 mx-auto mb-4 text-danger-dungeon animate-pulse" />
        <h3 className="font-extrabold text-lg">STAGE ERROR</h3>
        <p className="text-xs mt-2">The requested sector or world stage could not be decoded.</p>
        <Link href="/roadmap" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-300">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </Link>
      </div>
    );
  }

  // Handle slide completion (Stage 1 Learn)
  const handleCheckChange = (index: number) => {
    if (soundEnabled) soundSystem.playClick();
    const updated = [...checks];
    updated[index] = !updated[index];
    setChecks(updated);
  };

  const handleCompleteLesson = () => {
    // Stage completed rewards
    completeStage(activeWorld, activeStage);
    addXP(currentStageData.xp);
    addCoins(currentStageData.coins);
    
    setConsoleLogs(prev => [...prev, `[System] Concept checklist cleared!`, `[Reward] +${currentStageData.xp} XP`, `[Reward] +${currentStageData.coins} Coins`]);

    if (soundEnabled) {
      soundSystem.playSuccess();
    }
    
    import('canvas-confetti').then((confetti) => {
      confetti.default({ particleCount: 120, spread: 80 });
    });

    // Automatically navigate back to roadmap
    setTimeout(() => {
      router.push('/roadmap');
    }, 2000);
  };

  const handleReset = () => {
    setCode(currentStageData.template);
    setConsoleLogs(prev => [...prev, `[System] Code workspace reset to default template.`]);
    if (soundEnabled) soundSystem.playClick();
  };

  const handleRunCode = () => {
    if (soundEnabled) soundSystem.playClick();
    setConsoleLogs(prev => [...prev, `[Compiler] Compiling submission...`, `[Compiler] Running custom assertion suite...`]);

    const result = judgeCode(activeWorld, activeStage, code);
    setEvalResult(result);
    setIsEvaluationOpen(true);
  };

  const handleNextStage = () => {
    setIsEvaluationOpen(false);
    completeStage(activeWorld, activeStage);
    addXP(currentStageData.xp);
    addCoins(currentStageData.coins);

    // Save and route back to roadmap
    router.push('/roadmap');
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] select-none">
      {/* Header breadcrumb bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/roadmap"
            onClick={() => soundEnabled && soundSystem.playClick()}
            className="p-2.5 bg-slate-900 border border-border-dungeon rounded-xl hover:border-slate-500 text-slate-400 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 uppercase leading-none tracking-tight">{currentStageData.title}</h1>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-1 flex items-center gap-1.5">
              <span>{activeWorld}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>{activeStage.replace('stage', 'Stage ')}</span>
            </p>
          </div>
        </div>
      </div>

      {activeStage === 'stage1' ? (
        /* ==================== STAGE 1: LEARN SLIDESHOW VIEW ==================== */
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 overflow-y-auto">
          {/* Left panel: Info & Bullets */}
          <div className="p-6 md:p-8 border border-border-dungeon bg-slate-950/20 rounded-2xl space-y-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-accent-glow border border-accent/20 flex items-center justify-center text-accent">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-200">World Objectives</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2 select-text">{currentStageData.instructions}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Concept Highlights</h4>
                <ul className="space-y-2 select-text">
                  {currentStageData.bullets.map((b, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-xl border border-border-dungeon space-y-1.5 font-mono text-[10px] text-slate-500">
              {consoleLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>

          {/* Right panel: Slide Player & Checklist */}
          <div className="p-6 md:p-8 border border-border-dungeon bg-slate-950/20 rounded-2xl flex flex-col justify-between overflow-y-auto">
            {currentStageData.slides && (
              <div className="space-y-6">
                {/* Slide Card */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-border-dungeon h-48 flex flex-col justify-between relative select-text">
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-900 border border-border-dungeon text-[8px] font-black text-slate-500">
                    SLIDE {activeSlide + 1} / {currentStageData.slides.length}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-accent tracking-wide">{currentStageData.slides[activeSlide].title}</h4>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{currentStageData.slides[activeSlide].content}</p>
                  </div>
                  {/* Slider controls */}
                  <div className="flex justify-between items-center border-t border-border-dungeon/50 pt-3">
                    <button
                      onClick={() => {
                        setActiveSlide(prev => Math.max(prev - 1, 0));
                        if (soundEnabled) soundSystem.playClick();
                      }}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
                      disabled={activeSlide === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveSlide(prev => Math.min(prev + 1, currentStageData.slides!.length - 1));
                        if (soundEnabled) soundSystem.playClick();
                      }}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
                      disabled={activeSlide === currentStageData.slides.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Concept checklist */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scroll Comprehension</h4>
                  <div className="space-y-2">
                    {currentStageData.slides.map((slide, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleCheckChange(idx)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all
                          ${checks[idx] 
                            ? 'bg-success-dungeon/5 border-success-dungeon/20 text-success-dungeon' 
                            : 'bg-slate-950/40 border-border-dungeon text-slate-400'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={checks[idx]}
                          readOnly
                          className="w-4 h-4 rounded border-slate-700 text-accent focus:ring-accent accent-accent cursor-pointer"
                        />
                        <span className="text-xs font-semibold">{slide.title} read and understood</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Complete Button */}
            <div className="pt-6 border-t border-border-dungeon/30">
              <button
                onClick={handleCompleteLesson}
                disabled={!checks.every(Boolean)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent hover:scale-102 transition-all font-black text-xs uppercase tracking-wider text-white shadow-lg shadow-accent/20 rounded-xl cursor-pointer disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4.5 h-4.5" />
                <span>Complete Lesson & Claim Rewards</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== STAGES 2-5: INTERACTIVE PRACTICE EDITOR ==================== */
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          {/* Left panel: Task detail instructions */}
          <div className="p-6 md:p-8 border border-border-dungeon bg-slate-950/20 rounded-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-accent-glow border border-accent/20 flex items-center justify-center text-accent">
                <Code className="w-6 h-6 animate-pulse" />
              </div>
              
              <div>
                <h3 className="font-extrabold text-slate-200">Objective Challenge</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2 select-text">{currentStageData.instructions}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Test Requirements</h4>
                <ul className="space-y-2 select-text">
                  {currentStageData.bullets.map((b, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Console logs */}
            <div>
              <h4 className="font-bold text-xs text-slate-300 flex items-center gap-1.5 mb-2.5">
                <Terminal className="w-4 h-4 text-accent" />
                <span>CONSOLE OUTPUT</span>
              </h4>
              <div className="bg-slate-950 p-4 rounded-xl border border-border-dungeon h-36 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1 select-text">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('[Error]') ? 'text-danger-dungeon' : log.includes('[Compiler]') ? 'text-accent' : ''}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Editor workspace */}
          <div className="flex flex-col justify-between p-6 border border-border-dungeon bg-slate-950/20 rounded-2xl min-h-0">
            {/* Custom styled reactive code editor */}
            <div className="flex font-mono text-xs bg-slate-950 border border-border-dungeon rounded-xl overflow-hidden flex-1 mb-4 select-text">
              {/* Line Numbers column */}
              <div className="bg-slate-900/60 text-slate-600 px-3 py-4 text-right select-none border-r border-border-dungeon min-w-[36px] overflow-hidden leading-relaxed">
                {lines.map((_, idx) => (
                  <div key={idx} className="h-5">{idx + 1}</div>
                ))}
              </div>
              {/* Text Area */}
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent text-slate-100 p-4 outline-none resize-none overflow-y-auto leading-relaxed focus:bg-slate-950/30 whitespace-pre font-mono h-full"
                spellCheck="false"
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between border-t border-border-dungeon/30 pt-4 select-none">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4.5 py-3 bg-slate-950 border border-border-dungeon hover:border-slate-500 rounded-xl text-xs font-bold text-slate-300 transition-colors cursor-pointer hover:bg-slate-900"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Template</span>
              </button>

              <button
                onClick={handleRunCode}
                className="flex items-center gap-1.5 px-6 py-3 bg-accent hover:scale-102 transition-all rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md shadow-accent/20 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Compile & Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Judge Popup Modal */}
      <AutoJudgeEval
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
        evaluation={evalResult}
        onNextStage={handleNextStage}
      />
    </div>
  );
}
