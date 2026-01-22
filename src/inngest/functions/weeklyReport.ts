import { inngest } from "../../lib/inngest/client";

export const weeklyReport = inngest.createFunction(
    { id: "weekly-report" },
    { event: "user.progress.updated" },
    async ({ event, step }) => {
        // 1. Fetch user stats
        const stats = await step.run("fetch-user-stats", async () => {
            // Mock DB call
            return { totalSolved: 10, streak: 5 };
        });

        // 2. Generate AI Summary (Mock)
        const summary = await step.run("generate-ai-summary", async () => {
            return `Great job! You maintained a ${stats.streak} day streak.`;
        });

        // 3. Send Notification (Mock)
        await step.run("send-email", async () => {
            console.log(`Sending email to user ${event.data.userId}: ${summary}`);
            return { sent: true };
        });

        return { success: true, summary };
    }
);
