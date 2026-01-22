import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { userId, progressData } = await req.json();

        const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
        if (!GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not configured");
        }

        // Prepare context for the AI
        const solvedProblems = Object.values(progressData)
            // @ts-ignore
            .filter(p => p.status === "solved")
            // @ts-ignore
            .map(p => p.problem_id);

        // Simple logic to determine level
        const solvedCount = solvedProblems.length;
        let level = "Beginner";
        if (solvedCount > 20) level = "Intermediate";
        if (solvedCount > 50) level = "Advanced";

        const systemPrompt = `You are an expert Computer Science Curriculum Designer.
    Your job is to generate a PERSONALIZED, DYNAMIC Study Plan (Roadmap) for a student based on their progress.

    Return the result as a STRICT JSON array of "RoadmapNode" objects.
    
    Structure of RoadmapNode:
    {
      "id": "string (unique)",
      "title": "string",
      "description": "string (2-3 words)",
      "difficulty": "beginner" | "intermediate" | "advanced",
      "estimatedTime": "string (e.g. '3 days')",
      "skills": ["string", "string"],
      "children": [ ... array of nested RoadmapNodes ... ]
    }

    RULES:
    1. Create 3-4 High Level Modules (e.g., "Foundations", "Data Structures", "Advanced Algorithms").
    2. Inside them, create sub-nodes.
    3. TAILOR it to the user.
       - IF they solved 'Two Sum' (Arrays), suggest 'Sliding Window' next.
       - IF they are brand new, recommend 'Variables' and 'Loops'.
       - IF they solved 'Linked Lists', suggest 'Trees'.
    4. Return ONLY the JSON. No Markdown. No comments.
    `;

        const userPrompt = `Generate a study plan for a user at "${level}" level.
    
    Solved Problems (${solvedCount}): ${solvedProblems.join(", ") || "None yet"}.
    
    Create a detailed roadmap for the next 4 weeks.`;

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
                    temperature: 0.1
                })
            }
        );

        if (!response.ok) {
            const err = await response.text();
            console.error("Groq API error:", err);
            throw new Error("Failed to generate plan");
        }

        const data = await response.json();
        let content = data.choices?.[0]?.message?.content;

        // Clean up markdown code blocks if present
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        let roadmap;
        try {
            roadmap = JSON.parse(content);
        } catch (e) {
            console.error("JSON Parse Error", e);
            console.log("Raw content:", content);
            // Fallback or error
            throw new Error("AI generated invalid JSON");
        }

        return new Response(
            JSON.stringify({ roadmap }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error in generate-study-plan:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
