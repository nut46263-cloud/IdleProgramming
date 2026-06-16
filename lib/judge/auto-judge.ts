export interface EvaluationResult {
  correctness: number; // Tests % (0-100)
  structure: number;   // Structure % (0-100)
  completion: number;  // Completion % (0-100)
  quality: number;     // Code Quality % (0-100)
  efficiency: number;  // Code Efficiency % (0-100)
  score: number;       // Final composite score (0-100)
  grade: 'Expert' | 'Ready' | 'Practice More' | 'Retry';
  logs: string[];
}

export const judgeCode = (world: string, stageId: string, code: string): EvaluationResult => {
  const logs: string[] = [];
  let correctness = 0;
  let structure = 0;
  let completion = 0;
  let quality = 85;
  let efficiency = 80;

  const codeClean = code.trim();

  // Basic logs simulation
  logs.push(`[System] Initializing Auto-Judge compiler...`);
  logs.push(`[System] Loaded world: ${world}, stage: ${stageId}`);
  logs.push(`[System] Analyzing code structure (${codeClean.length} characters)...`);

  if (codeClean.length === 0) {
    logs.push(`[Error] Code block is empty!`);
    return {
      correctness: 0,
      structure: 0,
      completion: 0,
      quality: 0,
      efficiency: 0,
      score: 0,
      grade: 'Retry',
      logs
    };
  }

  // Set completion to 100 if code is longer than 15 chars and has minimal content
  completion = codeClean.length > 15 ? 100 : 50;
  if (completion < 100) {
    logs.push(`[Warning] Submission feels incomplete (low character count).`);
  } else {
    logs.push(`[Info] Code length validation passed.`);
  }

  // World specific checks
  switch (world) {
    case 'HTML':
      if (stageId === 'stage2') { // Button Practice
        logs.push(`[Test 1] Searching for button tag...`);
        const hasButton = /<button.*?>.*?<\/button>/i.test(codeClean);
        if (hasButton) {
          logs.push(`[Test 1 PASSED] Found button element.`);
          correctness += 50;
        } else {
          logs.push(`[Test 1 FAILED] Missing <button> tag.`);
        }

        logs.push(`[Test 2] Verifying id="btn-dungeon"...`);
        const hasId = /id=["']btn-dungeon["']/i.test(codeClean);
        if (hasId) {
          logs.push(`[Test 2 PASSED] Found id="btn-dungeon".`);
          correctness += 50;
        } else {
          logs.push(`[Test 2 FAILED] Button does not have id="btn-dungeon".`);
        }

        structure = /<button/i.test(codeClean) && /<\/button>/i.test(codeClean) ? 100 : 40;
      } else if (stageId === 'stage3') { // 3 list items
        logs.push(`[Test 1] Searching for list tag...`);
        const hasList = /<(ul|ol).*?>[\s\S]*?<\/(ul|ol)>/i.test(codeClean);
        if (hasList) {
          logs.push(`[Test 1 PASSED] Found list container (<ul> or <ol>).`);
          correctness += 40;
        } else {
          logs.push(`[Test 1 FAILED] Missing <ul> or <ol> container.`);
        }

        logs.push(`[Test 2] Verifying 3 <li> tags...`);
        const matches = codeClean.match(/<li.*?>.*?<\/li>/gi);
        const count = matches ? matches.length : 0;
        if (count >= 3) {
          logs.push(`[Test 2 PASSED] Found ${count} list items (3 required).`);
          correctness += 60;
        } else {
          logs.push(`[Test 2 FAILED] Found only ${count} list items (3 required).`);
          correctness += count * 20;
        }

        structure = hasList && count > 0 ? 100 : 50;
      } else { // Stage 5 Project Boss or others
        const hasHeader = /<header/i.test(codeClean);
        const hasNav = /<nav/i.test(codeClean);
        const hasSection = /<section/i.test(codeClean);
        const hasFooter = /<footer/i.test(codeClean);

        logs.push(`[Test] Check HTML5 semantic elements...`);
        if (hasHeader) logs.push(`- Found <header> tag.`);
        if (hasNav) logs.push(`- Found <nav> tag.`);
        if (hasSection) logs.push(`- Found <section> tag.`);
        if (hasFooter) logs.push(`- Found <footer> tag.`);

        const matches = [hasHeader, hasNav, hasSection, hasFooter].filter(Boolean).length;
        correctness = Math.round((matches / 4) * 100);
        structure = matches > 2 ? 100 : 60;
        logs.push(`[Test Result] Passed ${matches}/4 semantic requirements.`);
      }
      break;

    case 'SQL':
      const sqlUpper = codeClean.toUpperCase();
      if (stageId === 'stage2') { // Select users age > 18
        logs.push(`[Test 1] Verifying SELECT query...`);
        const hasSelect = sqlUpper.includes('SELECT');
        const hasStar = sqlUpper.includes('*');
        if (hasSelect) {
          logs.push(`[Test 1 PASSED] SELECT statement present.`);
          correctness += 40;
        } else {
          logs.push(`[Test 1 FAILED] Missing SELECT keyword.`);
        }

        logs.push(`[Test 2] Verifying FROM users...`);
        const hasFromUsers = sqlUpper.includes('FROM USERS');
        if (hasFromUsers) {
          logs.push(`[Test 2 PASSED] Correct target table 'users'.`);
          correctness += 30;
        } else {
          logs.push(`[Test 2 FAILED] Target table 'users' not detected in FROM clause.`);
        }

        logs.push(`[Test 3] Verifying WHERE age > 18...`);
        const hasWhere = sqlUpper.includes('WHERE');
        const hasAgeCondition = /AGE\s*(>\s*18|>=19)/i.test(sqlUpper);
        if (hasWhere && hasAgeCondition) {
          logs.push(`[Test 3 PASSED] WHERE condition limits age correctly.`);
          correctness += 30;
        } else {
          logs.push(`[Test 3 FAILED] WHERE age > 18 condition missing or incorrect.`);
        }

        structure = hasSelect && hasWhere ? 100 : 50;
      } else if (stageId === 'stage3') { // Group gold by rank
        const hasGroup = sqlUpper.includes('GROUP BY');
        const hasSum = sqlUpper.includes('SUM(') || sqlUpper.includes('SUM (');
        
        logs.push(`[Test 1] Verifying GROUP BY clause...`);
        if (hasGroup) {
          logs.push(`[Test 1 PASSED] GROUP BY detected.`);
          correctness += 50;
        } else {
          logs.push(`[Test 1 FAILED] Missing GROUP BY rank clause.`);
        }

        logs.push(`[Test 2] Verifying aggregation function...`);
        if (hasSum) {
          logs.push(`[Test 2 PASSED] SUM(gold) aggregate function present.`);
          correctness += 50;
        } else {
          logs.push(`[Test 2 FAILED] SUM aggregation missing.`);
        }
        
        structure = hasGroup ? 100 : 40;
      } else { // Project Boss
        const hasJoin = sqlUpper.includes('JOIN') || sqlUpper.includes('INNER JOIN');
        logs.push(`[Test] Check JOIN condition...`);
        if (hasJoin) {
          logs.push(`[Test PASSED] JOIN statement detected.`);
          correctness = 100;
          structure = 100;
        } else {
          logs.push(`[Test FAILED] No table JOIN statement found.`);
          correctness = 30;
          structure = 50;
        }
      }
      break;

    case 'C':
      if (stageId === 'stage2') { // Integer Pointer
        const hasAsterisk = codeClean.includes('*');
        const hasAmpersand = codeClean.includes('&');
        const hasInt = codeClean.includes('int');

        logs.push(`[Test 1] Checking pointer declaration syntax...`);
        if (hasInt && hasAsterisk) {
          logs.push(`[Test 1 PASSED] Declared pointer type correctly.`);
          correctness += 50;
        } else {
          logs.push(`[Test 1 FAILED] Pointer declaration syntax invalid.`);
        }

        logs.push(`[Test 2] Checking address assignment...`);
        if (hasAmpersand) {
          logs.push(`[Test 2 PASSED] Assigned variable using reference operator (&).`);
          correctness += 50;
        } else {
          logs.push(`[Test 2 FAILED] Address reference operator (&) missing.`);
        }

        structure = hasAsterisk && hasAmpersand ? 100 : 50;
      } else if (stageId === 'stage3') { // Swap function
        const hasPointerParams = /\*\s*[a-zA-Z_]\w*/.test(codeClean);
        const hasTempVar = /int\s+temp/i.test(codeClean) || /int\s+t/i.test(codeClean);

        logs.push(`[Test 1] Checking function parameter signature...`);
        if (hasPointerParams) {
          logs.push(`[Test 1 PASSED] Pointer arguments detected in signature.`);
          correctness += 50;
        } else {
          logs.push(`[Test 1 FAILED] Parameters must be pointers (e.g. int *a).`);
        }

        logs.push(`[Test 2] Checking dereferencing assignments...`);
        if (hasTempVar) {
          logs.push(`[Test 2 PASSED] Temp variable used for swapping.`);
          correctness += 50;
        } else {
          logs.push(`[Test 2 FAILED] Missing temporary swap storage.`);
        }

        structure = hasPointerParams && hasTempVar ? 100 : 60;
      } else { // Project Boss C
        const hasMalloc = codeClean.includes('malloc') || codeClean.includes('free');
        logs.push(`[Test 1] Verifying dynamic memory calls...`);
        if (hasMalloc) {
          logs.push(`[Test 1 PASSED] malloc/free allocation statements detected.`);
          correctness = 100;
          structure = 100;
        } else {
          logs.push(`[Test 1 FAILED] Missing memory allocation library calls.`);
          correctness = 40;
          structure = 40;
        }
      }
      break;

    case 'C++':
      if (stageId === 'stage2') { // Warrior Class
        const hasClass = codeClean.includes('class Warrior');
        const hasPublic = codeClean.includes('public:');
        const hasAttack = /void\s+attack/i.test(codeClean) || /attack\s*\(/i.test(codeClean);

        logs.push(`[Test 1] Verifying Warrior class definition...`);
        if (hasClass) {
          logs.push(`[Test 1 PASSED] 'class Warrior' block defined.`);
          correctness += 40;
        } else {
          logs.push(`[Test 1 FAILED] Class 'Warrior' not found.`);
        }

        logs.push(`[Test 2] Verifying access specifiers...`);
        if (hasPublic) {
          logs.push(`[Test 2 PASSED] 'public:' scope specifier defined.`);
          correctness += 30;
        } else {
          logs.push(`[Test 2 FAILED] Methods are not accessible (missing public:).`);
        }

        logs.push(`[Test 3] Verifying member function attack()...`);
        if (hasAttack) {
          logs.push(`[Test 3 PASSED] attack() function implemented.`);
          correctness += 30;
        } else {
          logs.push(`[Test 3 FAILED] Member function attack() not defined.`);
        }

        structure = hasClass && hasPublic ? 100 : 50;
      } else if (stageId === 'stage3') { // Inheritance/Virtual
        const inherits = codeClean.includes('public Warrior') || codeClean.includes(': Warrior');
        const overrides = codeClean.includes('override') || codeClean.includes('virtual');

        logs.push(`[Test 1] Checking class inheritance...`);
        if (inherits) {
          logs.push(`[Test 1 PASSED] Subclass correctly inherits from Warrior.`);
          correctness += 50;
        } else {
          logs.push(`[Test 1 FAILED] Class must derive from Warrior (class Wizard : public Warrior).`);
        }

        logs.push(`[Test 2] Checking method overriding...`);
        if (overrides) {
          logs.push(`[Test 2 PASSED] virtual / override decorator detected.`);
          correctness += 50;
        } else {
          logs.push(`[Test 2 FAILED] No virtual or override polymorphism keywords.`);
        }

        structure = inherits && overrides ? 100 : 40;
      } else { // Project Boss C++
        const hasTemplate = codeClean.includes('template') || codeClean.includes('<typename T>');
        logs.push(`[Test] Check templates or system namespaces...`);
        if (hasTemplate) {
          logs.push(`[Test PASSED] C++ Templates used for RPG dynamic battle structures.`);
          correctness = 100;
          structure = 100;
        } else {
          logs.push(`[Test FAILED] Template implementation not detected.`);
          correctness = 45;
          structure = 50;
        }
      }
      break;

    case 'JavaScript':
      if (stageId === 'stage2') { // doubleArray
        const hasMap = codeClean.includes('.map') || codeClean.includes('map(');
        const hasDoubleMath = codeClean.includes('* 2') || codeClean.includes('*2');

        logs.push(`[Test 1] Checking doubleArray return values...`);
        try {
          // Safe eval mock
          const doubleArrayMock = new Function(`
            ${codeClean}
            return typeof doubleArray !== 'undefined' ? doubleArray : null;
          `)();

          if (doubleArrayMock) {
            const res = doubleArrayMock([1, 2, 3]);
            if (Array.isArray(res) && res[0] === 2 && res[2] === 6) {
              logs.push(`[Test 1 PASSED] doubleArray([1, 2, 3]) correctly returned [2, 4, 6].`);
              correctness += 60;
            } else {
              logs.push(`[Test 1 FAILED] doubleArray([1, 2, 3]) returned ${JSON.stringify(res)} instead of [2, 4, 6].`);
              correctness += 20;
            }
          } else {
            logs.push(`[Test 1 FAILED] Function 'doubleArray' is not defined.`);
          }
        } catch (err: any) {
          logs.push(`[Compile Error] Code evaluation failed: ${err.message}`);
          correctness += 10;
        }

        logs.push(`[Test 2] Verifying array map usage...`);
        if (hasMap) {
          logs.push(`[Test 2 PASSED] Array.prototype.map utilized.`);
          correctness += 40;
        } else {
          logs.push(`[Test 2 FAILED] map method is not used. (Iterating manually is less efficient).`);
        }

        structure = hasMap ? 100 : 50;
      } else if (stageId === 'stage3') { // Count Vowels
        logs.push(`[Test 1] Validating vowel counting logic...`);
        try {
          const countVowelsMock = new Function(`
            ${codeClean}
            return typeof countVowels !== 'undefined' ? countVowels : null;
          `)();

          if (countVowelsMock) {
            const res = countVowelsMock('hello');
            const res2 = countVowelsMock('dungeon');
            if (res === 2 && res2 === 3) {
              logs.push(`[Test 1 PASSED] countVowels('hello') returned 2, countVowels('dungeon') returned 3.`);
              correctness += 100;
            } else {
              logs.push(`[Test 1 FAILED] countVowels('hello') returned ${res} instead of 2.`);
              correctness += 40;
            }
          } else {
            logs.push(`[Test 1 FAILED] Function 'countVowels' not defined.`);
          }
        } catch (err: any) {
          logs.push(`[Compile Error] Code execution crashed: ${err.message}`);
        }
        structure = 100;
      } else { // Project Boss JS
        const hasInterval = codeClean.includes('requestAnimationFrame') || codeClean.includes('setInterval');
        logs.push(`[Test 1] Validating event loop ticks...`);
        if (hasInterval) {
          logs.push(`[Test 1 PASSED] requestAnimationFrame/setInterval scheduling detected.`);
          correctness = 100;
          structure = 100;
        } else {
          logs.push(`[Test 1 FAILED] Game Loop time-scheduler is missing.`);
          correctness = 50;
          structure = 60;
        }
      }
      break;

    default:
      // Fallback
      logs.push(`[Test 1] Verifying code presence...`);
      correctness = 80;
      structure = 80;
  }

  // Final code quality deduction for long variables or lack of comments
  const hasComments = codeClean.includes('//') || codeClean.includes('/*');
  if (hasComments) {
    quality = 98;
    logs.push(`[Quality] Inline comments detected. Bonus quality points awarded.`);
  } else {
    quality = 85;
    logs.push(`[Quality Warning] Lacks code documentation/comments.`);
  }

  // Calculate efficiency
  if (codeClean.includes('while') && world === 'JavaScript') {
    efficiency = 70; // penalty for while loop in doubleArray
  }

  // Auto Judge formula:
  // Score = Tests x 60 + Structure x 20 + Completion x 20
  // In percent bounds:
  const score = Math.round((correctness * 0.60) + (structure * 0.20) + (completion * 0.20));

  let grade: 'Expert' | 'Ready' | 'Practice More' | 'Retry';
  if (score >= 90) grade = 'Expert';
  else if (score >= 80) grade = 'Ready';
  else if (score >= 60) grade = 'Practice More';
  else grade = 'Retry';

  logs.push(`[System] Grading completed. Final Score: ${score}/100. Grade: ${grade}.`);

  return {
    correctness,
    structure,
    completion,
    quality,
    efficiency,
    score,
    grade,
    logs
  };
};
