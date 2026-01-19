import { Inngest, EventSchemas } from "inngest";

// valid event keys:
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
    }
};

export const inngest = new Inngest({
    id: "algobox-ai",
<<<<<<< HEAD
    schemas: new EventSchemas().fromRecord<Events>(),
=======
>>>>>>> b012c708a4a6517bdffa3492caf383f9f4b6ebb2
});
