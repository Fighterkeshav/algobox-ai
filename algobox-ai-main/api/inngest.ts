import { serve } from "inngest/next";
import { inngest } from "./inngest_core/client.js";
import {
    userCompletedLab,
    cyberPracticeSubmitted,
    sqlPracticeSubmitted,
    aiMistakeAnalysis,
    updateUserAnalytics
} from "./inngest_core/functions/labs.js";
import { emailNotification } from "./inngest_core/functions/notifications.js";
import { weeklyProgressReport, generateUserWeeklyReport } from "./inngest_core/functions/schedule.js";
import { welcomeEmail, dailyStreakReminder, sendStreakReminderEmail } from "./inngest_core/functions/emails.js";

export const config = {
    runtime: "nodejs",
};

export default serve({
    client: inngest,
    functions: [
        // Lab & Practice
        userCompletedLab,
        cyberPracticeSubmitted,
        sqlPracticeSubmitted,
        aiMistakeAnalysis,
        updateUserAnalytics,
        // Notifications
        emailNotification,
        // Scheduled
        weeklyProgressReport,
        generateUserWeeklyReport,
        // Email Functions
        welcomeEmail,
        dailyStreakReminder,
        sendStreakReminderEmail,
    ],
});
