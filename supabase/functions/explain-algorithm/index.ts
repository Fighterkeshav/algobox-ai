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
    const rateLimit = enforceRateLimit(req, "explain-algorithm");
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

    const { algorithm, step, stepType, description, code } = await req.json();

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const systemPrompt = `You are an elite Computer Science Professor and algorithm teacher. Your task is to explain the current algorithm step with profound clarity.

    Guidelines for 100x Quality:
    - **Analogy:** Start with a real-world analogy if possible (e.g. array pointers = two fingers reading a book).
    - **Context:** Relate this specific step to the overall goal of the algorithm.
    - **Complexity Hint:** Briefly mention why this step keeps the algorithm efficient (Time/Space) if relevant.
    - **Code Reference:** If code context is provided, tightly weave the exact variable names into your explanation in bold.
    - **Tone:** Encouraging, brilliant, and incredibly concise (max 3 sentences). Do not hallucinate extra steps outside the current one.`;

    const userPrompt = `Explain this step in the ${algorithm} algorithm:

Step Type: ${stepType}
Description: ${description}
${code ? `\nRelevant Code:\n${code}` : ''}

Provide a clear, beginner-friendly explanation of what's happening and why.`;

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
          max_tokens: 300,
          temperature: 0.7
        })
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || "Unable to generate explanation.";

    return new Response(
      JSON.stringify({ explanation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in explain-algorithm:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
