import { serve } from "inngest/edge";
import { inngest } from "../src/lib/inngest/client"; // Adjusted path since we are in /api
import { weeklyReport } from "../src/inngest/functions/weeklyReport";
import { aiFeedback } from "../src/inngest/functions/aiFeedback";

export const config = {
    runtime: 'edge',
};

export default serve({
    client: inngest,
    functions: [
        weeklyReport,
        aiFeedback,
    ],
});
