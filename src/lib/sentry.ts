import * as Sentry from "@sentry/react";

// Better Stack client reference
let betterStackClient: Sentry.BrowserClient | null = null;
let betterStackScope: Sentry.Scope | null = null;

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
            // Hook to forward events to Better Stack
            beforeSend(event) {
                forwardToBetterStack(event);
                return event; // Continue sending to Sentry.io
            },
        });
        console.log("Sentry.io initialized.");
    } else {
        console.warn("Sentry DSN not found, skipping Sentry.io initialization.");
    }
};

// Initialize Better Stack (standalone Sentry-compatible client)
export const initBetterStack = () => {
    if (import.meta.env.VITE_BETTERSTACK_DSN) {
        betterStackClient = new Sentry.BrowserClient({
            dsn: import.meta.env.VITE_BETTERSTACK_DSN,
            transport: Sentry.makeFetchTransport,
            stackParser: Sentry.defaultStackParser,
            integrations: [],
        });
        betterStackScope = new Sentry.Scope();
        betterStackScope.setClient(betterStackClient);
        betterStackClient.init();
        console.log("Better Stack error tracking initialized.");
    } else {
        console.warn("Better Stack DSN not found, skipping initialization.");
    }
};

// Forward Sentry events to Better Stack
const forwardToBetterStack = (event: Sentry.Event) => {
    if (betterStackClient && betterStackScope) {
        // Clone and send to Better Stack
        betterStackClient.sendEvent(event);
    }
};

// Manual capture for BOTH services (use this for custom error handling)
export const captureError = (error: any, context?: Record<string, any>) => {
    console.error("Capturing error:", error);
    Sentry.captureException(error, { extra: context });
    // Better Stack will receive it via beforeSend hook
};

export const captureMessage = (message: string) => {
    console.log("Capturing message:", message);
    Sentry.captureMessage(message);
    // Better Stack will receive it via beforeSend hook
};
