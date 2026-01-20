import { Inngest, EventSchemas } from "inngest";

// Event types for frontend-triggered Inngest events
type Events = {
    "user.completed.lab": {
        data: {
            userId: string;
            labId: string;
            score: number;
        };
    };
    "ai.requested": {
        data: {
            userId: string;
            prompt: string;
            context?: string;
        }
    };
    "user.signup": {
        data: {
            userId: string;
            email: string;
            name?: string;
        }
    };
};

export const inngest = new Inngest({
    id: "algobox-ai",
    schemas: new EventSchemas().fromRecord<Events>(),
});

// Alias for clearer naming in components
export const inngestClient = inngest;
