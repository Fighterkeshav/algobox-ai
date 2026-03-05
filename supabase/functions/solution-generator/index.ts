import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { enforceRateLimit } from "../_shared/rateLimit.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const rateLimit = enforceRateLimit(req, "solution-generator");
        if (!rateLimit.allowed) {
            return new Response(
                JSON.stringify({ error: "Too many AI requests. Please try again shortly." }),
                {
                    status: 429,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                        "Retry-After": String(rateLimit.retryAfter),
                    },
                },
            );
        }

        const { problem, language } = await req.json();

        const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
        if (!GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not configured");
        }

        const systemPrompt = `You are a world-class competitive programmer and algorithm expert.
Write the most optimal valid ${language} solution for the given problem.
Rules:
- Return ONLY raw code (no markdown, no explanations, no comments unless essential).
- Keep output minimal and directly executable.
- Use the best known time/space complexity for the constraints.
- Include only what is required to solve the problem.`;

        const userPrompt = `Problem Title: ${problem.title}
Problem Description: ${problem.description}
Constraints: ${problem.constraints ? problem.constraints.join("\n") : "Standard constraints"}

Write the optimal ${language} solution now.`;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-120b",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    max_tokens: 1024,
                    temperature: 0.1 // Low temperature for deterministic, optimal code
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API error:", response.status, errorText);
            throw new Error(`Groq API Error: ${response.statusText}`);
        }

        const data = await response.json();
        let code = data.choices?.[0]?.message?.content || "";

        // Clean up if the LLM accidentally added markdown
        code = code.replace(/```javascript/g, "").replace(/```/g, "").trim();

        return new Response(
            JSON.stringify({ code }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error in solution-generator:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
