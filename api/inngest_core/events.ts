import { type EventSchemas } from "inngest";

export type Events = {
    // Lab & Practice Events
    "user.completed.lab": {
        data: {
            userId: string;
            labId: string;
            score: number;
            timeSpentSeconds: number;
            labType: "cyber" | "sql" | "algo";
        };
    };
    "user.failed.lab": {
        data: {
            userId: string;
            labId: string;
            error?: string;
            attemptCount: number;
        };
    };
    "cyber.practice.submitted": {
        data: {
            userId: string;
            submissionContent: string;
            challengeId: string;
        };
    };
    "sql.practice.submitted": {
        data: {
            userId: string;
            query: string;
            challengeId: string;
            executionTimeMs: number;
            success: boolean;
        };
    };

    // AI & Feedback
    "ai.feedback.requested": {
        data: {
            userId: string;
            context: string;
            prompt: string;
            metadata?: Record<string, any>;
        };
    };

    // Scheduling & Reporting
    "user.weekly.report": {
        data: {
            userId?: string; // Optional: if null, runs for all appropriate users (fan-out)
        };
    };

    // System
    "app/send.email": {
        data: {
            to: string;
            subject: string;
            template: string;
            vars?: Record<string, any>;
        };
    };
};
