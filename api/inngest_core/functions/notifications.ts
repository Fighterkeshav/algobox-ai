import { inngest } from "../client.js";

// Centralized Notification Handler
export const emailNotification = inngest.createFunction(
    { id: "send-email-notification" },
    { event: "app/send.email" },
    async ({ event, step }) => {
        const { to, subject, template } = event.data;

        const result = await step.run("send-email-provider", async () => {
            // In a real app: await resend.emails.send(...)
            // console.log(`[Mock Email] To: ${to}, Subject: ${subject}, Template: ${template}`);

            // Simulate network delay
            await new Promise(r => setTimeout(r, 500));

            return { messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` };
        });

        return { sent: true, id: result.messageId };
    }
);
