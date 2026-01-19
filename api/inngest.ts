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

export const config = {
    runtime: "nodejs",
};

export default serve({
    client: inngest,
    functions: [
        userCompletedLab,
        cyberPracticeSubmitted,
        sqlPracticeSubmitted,
        aiMistakeAnalysis,
        updateUserAnalytics,
        emailNotification,
        weeklyProgressReport,
        generateUserWeeklyReport,
    ],
});
