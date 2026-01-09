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
    const { code, error, language, problemContext, tests } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Judge0 configuration (optional). If not configured we skip execution but still run AI analysis.
    const JUDGE0_API_URL = Deno.env.get("JUDGE0_API_URL") || "https://judge0.p.rapidapi.com";
    const JUDGE0_API_KEY = Deno.env.get("JUDGE0_API_KEY");
    const JUDGE0_API_HOST = Deno.env.get("JUDGE0_API_HOST"); // used for RapidAPI hosts like judge0-ce.p.rapidapi.com

    async function judge0Fetch(path: string, init?: RequestInit) {
      const headers = Object.assign({}, init?.headers || {});
      if (JUDGE0_API_KEY) {
        // Support RapidAPI header pattern when host is provided.
        if (JUDGE0_API_HOST) {
          headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
          headers["X-RapidAPI-Host"] = JUDGE0_API_HOST;
        } else {
          headers["Authorization"] = `Bearer ${JUDGE0_API_KEY}`;
        }
      }
      return fetch(`${JUDGE0_API_URL}${path}`, { ...(init || {}), headers });
    }

    async function findLanguageId(lang: string) {
      try {
        const res = await judge0Fetch(`/languages`);
        if (!res.ok) return null;
        const langs = await res.json();
        const lc = (lang || "").toLowerCase();
        // Try exact match on name or aliases (slug)
        const found = langs.find((l: any) => l.name?.toLowerCase() === lc || l.slug?.toLowerCase() === lc || (l.aliases || []).map((a: string)=>a.toLowerCase()).includes(lc));
        if (found) return found.id;
        // fallback: partial match
        const partial = langs.find((l: any) => l.name?.toLowerCase().includes(lc) || l.slug?.toLowerCase().includes(lc));
        return partial?.id || null;
      } catch (e) {
        console.warn("Failed to fetch languages from Judge0:", e);
        return null;
      }
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

    if (JUDGE0_API_URL) {
      const langId = await findLanguageId(language || "");
      if (langId) {
        execution.available = true;
        execution.tests = [];

        if (Array.isArray(tests) && tests.length > 0) {
          for (const t of tests) {
            const input = t.input ?? "";
            const expected = t.expected ?? null;
            const result = await runSubmission(code, langId, input);
            const stdout = (result.stdout ?? result.stdout === "" )? result.stdout : null;
            const passed = expected != null ? (stdout != null ? stdout.trim() === expected.trim() : false) : null;
            execution.tests.push({ input, expected, result, stdout, passed });
          }
          execution.passed = execution.tests.every((t: any) => t.passed === true);
        } else {
          // Single run without tests
          const result = await runSubmission(code, langId, undefined);
          execution.latest = result;
        }
      } else {
        execution.available = false;
        execution.error = "language_not_supported";
      }
    }

    const systemPrompt = `You are an expert coding tutor specializing in debugging and algorithm implementation.

Your role:
1. Identify the exact bug or issue in the code
2. Explain WHY it's wrong conceptually
3. Suggest the correct approach
4. Never give the complete solution - guide the student to learn

If provided, take into account execution results and test outcomes in your analysis. Be explicit about whether failing tests indicate a logic bug or a runtime/compilation issue.

Format your response as:
**Bug Found:** [Brief description]
**Why It's Wrong:** [Conceptual explanation]
**How to Fix:** [Guidance without full solution]
**Tip:** [One helpful learning tip]`;

    const executionSummary = JSON.stringify(execution, null, 2);

    const userPrompt = `Debug this ${language} code:

\`\`\`${language}
${code}
\`\`\`

${error ? `Error message: ${error}` : ''}
${problemContext ? `Problem context: ${problemContext}` : ''}

Execution summary:
${executionSummary}

Help me understand what's wrong and how to fix it.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Unable to analyze the code.";

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
