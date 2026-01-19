import * as Sentry from "@sentry/react";

// Initialize Sentry.io
export const initSentry = () => {
    if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            environment: import.meta.env.MODE,
        });
    } else {
        console.warn("Sentry DSN not found, skipping Sentry.io initialization.");
    }
};

// Better Stack Error Reporter (uses Sentry SDK format)
let betterStackClient: Sentry.BrowserClient | null = null;

export const initBetterStack = () => {
    if (import.meta.env.VITE_BETTERSTACK_DSN) {
        betterStackClient = new Sentry.BrowserClient({
            dsn: import.meta.env.VITE_BETTERSTACK_DSN,
            transport: Sentry.makeFetchTransport,
            stackParser: Sentry.defaultStackParser,
            integrations: [],
        });
        console.log("Better Stack error tracking initialized.");
    } else {
        console.warn("Better Stack DSN not found, skipping initialization.");
    }
};

// Capture error to BOTH Sentry.io and Better Stack
export const captureError = (error: any, context?: Record<string, any>) => {
    console.error("Capturing error:", error);

    // Send to Sentry.io (primary)
    Sentry.captureException(error, { extra: context });

    // Send to Better Stack (secondary)
    if (betterStackClient) {
        betterStackClient.captureException(error, { extra: context } as any, Sentry.getCurrentScope());
    }
};
