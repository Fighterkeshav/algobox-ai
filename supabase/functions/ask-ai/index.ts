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
    const rateLimit = enforceRateLimit(req, "ask-ai", { maxRequests: 15, windowSeconds: 60 });
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: "Too many chat requests. Please take a deep breath and try again shortly." }),
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

    const { prompt, context } = await req.json();

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const systemPrompt = `You are an elite Staff Engineer and algorithm mentor at a top tech company. Your role is to help the user solve a specific programming problem.
    
    CRITICAL RULES:
    1. USE THE SOCRATIC METHOD. NEVER GIVE THE FULL WORKING CODE ENTIRELY AWAY IN YOUR FIRST RESPONSE UNLESS EXPLICITLY BEGGED FOR.
    2. Guide the user with hints, mental models, and edge-case questions.
    3. Always discuss Time and Space complexity (Big-O notation) analytically when analyzing approaches via thought experiments.
    4. Keep output concise, professional, and directly actionable.
    5. Format with gorgeous Markdown (bold keywords, small inline code snippets for clarity, bullet points for lists).
    6. If the user posts an error, point exactly to the logical flaw without necessarily fixing the whole script immediately.
    `;

    const userPrompt = `Context:\n${context || "No specific problem context provided."}\n\nUser Question:\n${prompt}`;

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
          max_tokens: 1500,
          temperature: 0.3
        })
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Upstream rate limit exceeded. Please wait a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      throw new Error(`AI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "No response generated.";

    return new Response(
      JSON.stringify({ message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ask-ai:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal system error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
