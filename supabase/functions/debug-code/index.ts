import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, error, language, problemContext, tests, skipAnalysis, executionResults, userQuestion, visualize } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    // Helper to call Groq (or fallback to Gemini if you prefer, but sticking to Groq as per existing code)
    async function callLLM(systemPrompt: string, userPrompt: string) {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            max_tokens: 4096,
            temperature: 0.2
          })
        }
      );
      if (!response.ok) {
        throw new Error(`LLM API Error: ${response.status}`);
      }
      const data = await response.json();
      return data.choices?.[0]?.message?.content;
    }

    // Handle Visualization Request
    if (visualize || language === 'sql') {
      let visualization = null;

      if (language === 'sql') {
        const systemPrompt = `You are an SQL Query Engine Simulator.
            Your task is to generate valid JSON data that represents the result of the user's SQL query.
            
            Rules:
            1. Analyze the SQL query to understand the columns and expected data.
            2. Generate appropriate meaningful mock data (5-10 rows).
            3. Return ONLY valid JSON in the following format:
            {
                "type": "sql",
                "data": [
                    { "id": 1, "name": "John Doe", "email": "john@example.com" },
                    ...
                ]
            }
            4. If the query is invalid, generate a JSON with an error message in a table row or just empty.
            5. Do NOT output markdown or explanation, JUST the JSON.
            `;
        const content = await callLLM(systemPrompt, `Generate mock results for this SQL query:\n\n${code}`);
        try {
          // simple cleanup to get json if wrapped in backticks
          const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
          visualization = JSON.parse(jsonStr);
        } catch (e) {
          console.error("Failed to parse SQL visualization JSON:", e);
          visualization = { type: 'sql', data: [] }; // Fallback
        }
      } else {
        // Algorithm Visualization - Enhanced for ALL problem types
        const systemPrompt = `You are an Algorithm Execution Trace Generator.
            Your task is to trace code execution and generate JSON for VISUAL STEP-BY-STEP animation.
            
            DETECT the algorithm pattern and use APPROPRIATE state fields:
            
            === VISUALIZATION TYPES ===
            
            1. NUMBER COMPARISON (Palindrome, comparisons):
               Use: "original", "reversed", "comparison"
               Example state:
               {
                 "original": 121,
                 "reversed": 121,
                 "comparison": { "left": 121, "right": 121, "operator": "==", "result": true },
                 "variables": { "x": 121, "rev": 121 },
                 "result": true
               }
            
            2. DIGIT-BY-DIGIT (Number reversal, string operations):
               Use: "digits", "pointers", "highlighted"
               Example state:
               {
                 "digits": [1, 2, 1],
                 "pointers": { "left": 0, "right": 2 },
                 "highlighted": [0, 2],
                 "variables": { "step": "comparing" }
               }
            
            3. ARRAY with Hash Map (Two Sum):
               Use: "array", "hashMap", "comparing", "found"
               Example state:
               {
                 "array": [2, 7, 11, 15],
                 "target": 9,
                 "comparing": [0, 1],
                 "hashMap": { "2": 0 },
                 "found": [0, 1],
                 "result": [0, 1]
               }
            
            4. TWO POINTERS (Reverse, Container Water, 3Sum):
               Use: "array", "pointers", "highlighted"
               Example state:
               {
                 "array": ["h","e","l","l","o"],
                 "pointers": { "left": 0, "right": 4 },
                 "highlighted": [0, 4]
               }
            
            5. STACK (Valid Parentheses):
               Use: "stack", "highlighted", without "array"
               Example state:
               {
                 "stack": ["(", "["],
                 "variables": { "char": "]", "action": "pop and match" }
               }
            
            6. BINARY SEARCH:
               Use: "array", "pointers" with left/mid/right
               Example state:
               {
                 "array": [-1,0,3,5,9,12],
                 "target": 9,
                 "pointers": { "left": 0, "mid": 2, "right": 5 }
               }
            
            7. DP / Kadane's (Max Subarray):
               Use: "array", "window", "variables"
               Example state:
               {
                 "array": [-2,1,-3,4,-1,2,1,-5,4],
                 "window": { "start": 3, "end": 6 },
                 "highlighted": [3, 4, 5, 6],
                 "variables": { "currentSum": 6, "maxSum": 6 }
               }
            
            === JSON FORMAT ===
            {
                "type": "algorithm",
                "algorithm": "<pattern-name>",
                "steps": [
                    {
                        "index": 0,
                        "type": "initialize|iterate|compare|swap|found|complete",
                        "description": "Clear description for user",
                        "state": { ... appropriate fields ... }
                    }
                ]
            }
            
            RULES:
            - ALWAYS include "variables" showing key variable values
            - Use "result" field when algorithm finds answer
            - Generate 5-15 meaningful steps
            - Descriptions should explain WHAT is happening
            - Return ONLY valid JSON, no markdown
            `;
        const content = await callLLM(systemPrompt, `Trace this ${language} code and generate visualization steps:\n\n${code}`);
        try {
          const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
          visualization = JSON.parse(jsonStr);
        } catch (e) {
          console.error("Failed to parse Algorithm visualization JSON:", e);
        }
      }

      // For SQL, we treat visualization as the main result, so we return early or combine
      return new Response(
        JSON.stringify({ visualization, execution: { available: true, passed: true } }), // Mock execution success for viz
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ... EXISTING EXECUTION LOGIC ...
    // Judge0 configuration (optional). If not configured we skip execution but still run AI analysis.
    // Default to the public Judge0 CE instance
    const JUDGE0_API_URL = Deno.env.get("JUDGE0_API_URL") || "https://ce.judge0.com";
    const JUDGE0_API_KEY = Deno.env.get("JUDGE0_API_KEY");
    const JUDGE0_API_HOST = Deno.env.get("JUDGE0_API_HOST"); // Optional: for RapidAPI

    async function judge0Fetch(path: string, init?: RequestInit) {
      const headers: Record<string, string> = {};
      const initHeaders = init?.headers;
      if (initHeaders) {
        if (initHeaders instanceof Headers) {
          initHeaders.forEach((value, key) => { headers[key] = value; });
        } else if (Array.isArray(initHeaders)) {
          initHeaders.forEach(([key, value]) => { headers[key] = value; });
        } else {
          Object.assign(headers, initHeaders);
        }
      }

      // Only add auth headers if a key is explicitly configured
      if (JUDGE0_API_KEY) {
        if (JUDGE0_API_HOST) {
          // RapidAPI pattern
          headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
          headers["X-RapidAPI-Host"] = JUDGE0_API_HOST;
        } else {
          // Standard/Self-hosted auth pattern
          headers["Authorization"] = `Bearer ${JUDGE0_API_KEY}`;
        }
      }

      // Ensure we don't have double slashes if path starts with /
      const baseUrl = JUDGE0_API_URL.replace(/\/$/, "");
      const cleanPath = path.startsWith("/") ? path : `/${path}`;

      return fetch(`${baseUrl}${cleanPath}`, { ...(init || {}), headers });
    }

    // Hardcoded language IDs for common languages (Judge0 CE)
    const LANGUAGE_MAP: Record<string, number> = {
      "python": 71,      // Python 3.8.1
      "python3": 71,
      "py": 71,
      "javascript": 63,  // JavaScript (Node.js 12.14.0)
      "js": 63,
      "node": 63,
      "c++": 54,         // C++ (GCC 9.2.0)
      "cpp": 54,
      "c": 50,           // C (GCC 9.2.0)
      "java": 62,        // Java (OpenJDK 13.0.1)
      "typescript": 74,  // TypeScript (3.7.4)
      "ts": 74,
      "go": 60,          // Go (1.13.5)
      "rust": 73,        // Rust (1.40.0)
      "ruby": 72,        // Ruby (2.7.0)
      "csharp": 51,      // C# (Mono 6.6.0)
      "c#": 51,
    };

    function findLanguageId(lang: string): number | null {
      const lc = (lang || "").toLowerCase().trim();
      return LANGUAGE_MAP[lc] || null;
    }

    // Auto-wrap code to add stdin/stdout handling if missing
    function wrapCodeForExecution(code: string, language: string, testInput: string): string {
      const lang = (language || "").toLowerCase().trim();

      // Detect if code already has stdin reading
      const hasPythonInput = /\binput\s*\(/.test(code) || /sys\.stdin/.test(code);
      const hasJsInput = /readline|process\.stdin|require\s*\(\s*['"]readline['"]/.test(code);
      const hasCppInput = /\bcin\b|getline|scanf/.test(code);

      // Detect if code has print/output
      const hasPythonPrint = /\bprint\s*\(/.test(code);
      const hasJsConsole = /console\.log/.test(code);
      const hasCppOutput = /\bcout\b|printf/.test(code);

      // Python wrapping
      if (lang === "python" || lang === "python3" || lang === "py") {
        if (hasPythonInput && hasPythonPrint) {
          return code; // Already has I/O
        }

        // Try to detect the main function name
        const funcMatch = code.match(/def\s+(\w+)\s*\([^)]*\)\s*:/);
        if (funcMatch) {
          const funcName = funcMatch[1];
          // Check if function is already called
          const isCalled = new RegExp(`\\b${funcName}\\s*\\(`).test(code.split(funcMatch[0])[1] || "");

          if (!isCalled) {
            // Parse the test input to determine argument structure
            return `import json
import sys
import re

${code}

# Auto-generated input handling
try:
    line = input().strip()
    args = []
    
    # Handle format like "[2,7,11,15], 9" - array followed by other args
    if line.startswith('['):
        # Find the closing bracket
        bracket_count = 0
        end_idx = 0
        for i, c in enumerate(line):
            if c == '[':
                bracket_count += 1
            elif c == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    end_idx = i
                    break
        
        # Parse the array
        arr_str = line[:end_idx + 1]
        args.append(json.loads(arr_str))
        
        # Parse remaining arguments after the array
        remaining = line[end_idx + 1:].strip()
        if remaining.startswith(','):
            remaining = remaining[1:].strip()
        if remaining:
            # Split by comma and parse each value
            for part in remaining.split(','):
                part = part.strip()
                if part:
                    try:
                        args.append(json.loads(part))
                    except:
                        args.append(part)
    elif line.startswith('{'):
        args.append(json.loads(line))
    else:
        # Simple comma-separated values
        for part in line.split(','):
            part = part.strip()
            if part:
                try:
                    args.append(json.loads(part))
                except:
                    args.append(part)
    
    # Call function with parsed args
    if len(args) == 0:
        result = ${funcName}()
    elif len(args) == 1:
        result = ${funcName}(args[0])
    else:
        result = ${funcName}(*args)
    
    # Print result
    if isinstance(result, (list, dict)):
        print(json.dumps(result, separators=(',', ':')))
    elif isinstance(result, bool):
        print(str(result).lower())
    elif result is None:
        print('null')
    else:
        print(result)
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)
`;
          }
        }
        return code;
      }

      // JavaScript wrapping
      if (lang === "javascript" || lang === "js" || lang === "node") {
        if (hasJsInput && hasJsConsole) {
          return code; // Already has I/O
        }

        // Try to detect the main function name
        const funcMatch = code.match(/function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])\s*=>/);
        if (funcMatch) {
          const funcName = funcMatch[1] || funcMatch[2];
          // Check if function is already called with readline
          if (!hasJsInput) {
            return `${code}

// Auto-generated input handling
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', (line) => {
    try {
        let args;
        line = line.trim();
        // Try to parse as array of arguments by wrapping in []
        try {
            args = JSON.parse('[' + line + ']');
        } catch (e) {
            // Fallback: splitting by comma (only for simple cases, not recommended for complex structures)
            args = line.split(',').map(p => {
                p = p.trim();
                try { return JSON.parse(p); } catch { return p; }
            });
        }
        const result = Array.isArray(args) && args.length > 1 ? ${funcName}(...args) : ${funcName}(Array.isArray(args) ? args[0] : args);
        console.log(typeof result === 'object' ? JSON.stringify(result) : result);
    } catch (e) {
        console.error('Error:', e.message);
    }
    rl.close();
});`;
          }
        }
        return code;
      }

      // C++ wrapping
      if (lang === "c++" || lang === "cpp") {
        if (hasCppInput && hasCppOutput) {
          return code; // Already has I/O
        }

        // For C++, we need a more careful approach - just return as-is if no main or if main exists
        const hasMain = /int\s+main\s*\(/.test(code);
        if (hasMain) {
          return code;
        }

        // Check for class Solution pattern (LeetCode style)
        const classMatch = code.match(/class\s+Solution\s*\{/);
        if (classMatch) {
          // Find the method
          const methodMatch = code.match(/(?:vector<\w+>|int|bool|string|void)\s+(\w+)\s*\([^)]*\)/);
          if (methodMatch) {
            const methodName = methodMatch[1];
            return `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;

${code}

int main() {
    Solution sol;
    string line;
    getline(cin, line);
    // Basic parsing - user should provide proper input format
    cout << "Solution method: ${methodName}" << endl;
    return 0;
}`;
          }
        }
        return code;
      }

      return code;
    }


    async function runSubmission(source_code: string, language_id: number | null, stdin?: string) {
      if (!language_id) {
        return { error: "language_not_supported" };
      }

      const body: any = {
        source_code,
        language_id,
        stdin: stdin || "",
      };

      const res = await judge0Fetch(`/submissions?base64_encoded=false&wait=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        return { error: `judge0_error: ${res.status} ${text}` };
      }

      const data = await res.json();
      return data;
    }

    // Attempt to run tests with Judge0 if available
    let execution: any = { available: false };

    if (executionResults) {
      execution = executionResults;
    } else {
      try {
        if (JUDGE0_API_URL) {
          const langId = await findLanguageId(language || "");
          if (langId) {
            execution.available = true;
            execution.tests = [];
            let systemError = null;

            if (Array.isArray(tests) && tests.length > 0) {
              for (const t of tests) {
                if (systemError) break;

                const input = t.input ?? "";
                const expected = t.expected ?? null;
                // Auto-wrap code if it doesn't have stdin/stdout handling
                const wrappedCode = wrapCodeForExecution(code, language || "", input);
                const result = await runSubmission(wrappedCode, langId, input);

                // Check for API-level errors (not code execution errors)
                if (result.error && typeof result.error === 'string' && result.error.startsWith('judge0_error')) {
                  systemError = result.error;
                  execution.available = false;
                  execution.error = "Execution server unavailable (API error). Falling back to static analysis.";
                  execution.details = result.error; // Keep technical details for debugging but not for display
                  execution.tests = []; // Clear partial tests
                  break;
                }

                const stdout = (result.stdout ?? result.stdout === "") ? result.stdout : null;
                const passed = expected != null ? (stdout != null ? stdout.trim() === expected.trim() : false) : null;
                execution.tests.push({ input, expected, result, stdout, passed });
              }

              if (!systemError) {
                execution.passed = execution.tests.every((t: any) => t.passed === true);
              }
            } else {
              // Single run without tests
              const result = await runSubmission(code, langId, undefined);
              if (result.error && typeof result.error === 'string' && result.error.startsWith('judge0_error')) {
                execution.available = false;
                execution.error = "Execution server unavailable. Static analysis only.";
              } else {
                execution.latest = result;
              }
            }
          } else {
            execution.available = false;
            // execution.error = "language_not_supported"; // Don't error, just don't try execution
          }
        }
      } catch (err) {
        console.error("Judge0 execution failed:", err);
        execution.available = false;
        execution.error = "Execution server error. Falling back to static analysis.";
      }
    }

    if (skipAnalysis) {
      return new Response(
        JSON.stringify({ analysis: null, execution }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert coding tutor specializing in debugging and algorithm implementation.

Your role:
1. Analyze the execution results and the user's code.
2. STRICTLY respect the programming language provided. Do NOT hallucinate Python errors if the code is JavaScript/C++.
3. Use Markdown formatting heavily:
   - Use \`\`\`language blocks for ALL code.
   - Use ### Headers for sections.
   - Use **Bold** for emphasis.
   - Ensure there are empty lines between sections for readability.

Context:
Language: ${language}

Scenarios:
A. If code is empty or just starter code:
   - Ask the user to try writing a solution.
   - Offer a hint about the algorithm (e.g. "Try using a hash map").

B. If passed (all tests green):
   - ### Great Job! 🎉
   - Praise the user.
   - ### Optimization
   - Suggest one improvement.

C. If functionality failed:
   - ### Bug Detected 🐞
   - Explain what went wrong.
   - ### Fix
   - Provide the corrected code block.

Format Rules:
- NEVER output plain text code. ALWAYS use code blocks.
- Keep explanation concise.`;

    const executionSummary = JSON.stringify(execution, null, 2);

    const userPrompt = `Debug this ${language} code:

\`\`\`${language}
${code}
\`\`\`

${error ? `Error message: ${error}` : ''}
${problemContext ? `Problem context: ${problemContext}` : ''}

Execution summary:
${executionSummary}

${userQuestion ? `\nUSER QUESTION: ${userQuestion}\n` : 'Help me understand what\'s wrong and how to fix it.'}`;

    const analysis = await callLLM(systemPrompt, userPrompt);

    return new Response(
      JSON.stringify({ analysis, execution }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in debug-code:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
