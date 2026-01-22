import { inngest } from "../../lib/inngest/client";

export const aiFeedback = inngest.createFunction(
    { id: "ai-feedback" },
    { event: "user.completed.lab" },
    async ({ event, step }) => {
        const { userId, labId, score, submissionId } = event.data;

        // 1. Fetch Submission Code (Mock)
        const submission = await step.run("fetch-submission", async () => {
            // In real app: await db.from('solutions').select('code').eq('id', submissionId)
            return { code: "console.log('Hello World');", language: "javascript" };
        });

        // 2. Generate AI Analysis (Mock LLM Call)
        const analysis = await step.run("generate-analysis", async () => {
            // In real app: Call Gemini/Groq with prompt
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate latency
            return {
                feedback: "Your code is clean, but consider using const instead of var.",
                suggestions: ["Use strict mode", "Add comments"],
                securityScore: 85
            };
        });

        // 3. Save Analysis to DB (Mock)
        await step.run("save-analysis", async () => {
            console.log(`Saving analysis for ${submissionId} to DB`, analysis);
            return { saved: true };
        });

        // 4. Notify User (Mock)
        await step.run("notify-user", async () => {
            console.log(`Notifying user ${userId} about feedback.`);
            return { notified: true };
        });

        return { success: true, submissionId, feedbackGenerated: true };
    }
);
